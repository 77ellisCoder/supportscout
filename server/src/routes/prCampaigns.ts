import { Router } from "express";
import { pool } from "../database/postgres";
import fs from "fs";
import path from "path";
import multer from "multer";

import { sendEmail } from "../services/email/EmailService";

export const prCampaignsRouter = Router();

const uploadRoot = path.resolve(
    process.cwd(),
    "server/uploads/pr-campaigns"
);

fs.mkdirSync(uploadRoot, {
    recursive: true,
});

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadRoot);
    },

    filename: (req, file, callback) => {
        const campaignId = req.params.id;

        const safeOriginalName =
            file.originalname.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );

        callback(
            null,
            `${campaignId}-${Date.now()}-${safeOriginalName}`
        );
    },
});

const upload = multer({
    storage,

    limits: {
        fileSize: 25 * 1024 * 1024,
    },

    fileFilter: (_req, file, callback) => {
        const isMp3 =
            file.mimetype === "audio/mpeg" ||
            file.originalname
                .toLowerCase()
                .endsWith(".mp3");

        if (!isMp3) {
            callback(
                new Error(
                    "Only MP3 files are supported"
                )
            );

            return;
        }

        callback(null, true);
    },
});

prCampaignsRouter.get("/", async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                pc.pr_campaign_id AS "id",
                pc.name,
                pc.subject,
                pc.status,
                pc.attachment_filename AS "attachmentFilename",
                pc.created_at AS "createdAt",
                pc.updated_at AS "updatedAt",
                pc.sent_at AS "sentAt",
                COUNT(pcr.pr_campaign_recipient_id)::int
                    AS "recipientCount"
            FROM pr_campaigns pc
            LEFT JOIN pr_campaign_recipients pcr
                ON pcr.pr_campaign_id =
                    pc.pr_campaign_id
            GROUP BY
                pc.pr_campaign_id
            ORDER BY
                pc.created_at DESC
        `);

        res.json(
            result.rows.map((row) => ({
                ...row,
                id: Number(row.id),
                recipientCount:
                    Number(row.recipientCount),
            }))
        );
    } catch (error) {
        console.error(
            "GET /pr-campaigns failed:",
            error
        );

        res.status(500).json({
            error: "Unable to load PR campaigns",
        });
    }
});

prCampaignsRouter.post("/", async (req, res) => {
    const {
        name,
        subject,
        emailBody,
        contactIds,
    } = req.body;

    if (!name?.trim()) {
        return res.status(400).json({
            error: "Campaign name is required",
        });
    }

    if (!subject?.trim()) {
        return res.status(400).json({
            error: "Subject is required",
        });
    }

    if (!emailBody?.trim()) {
        return res.status(400).json({
            error: "Email body is required",
        });
    }

    if (
        !Array.isArray(contactIds) ||
        contactIds.length === 0
    ) {
        return res.status(400).json({
            error: "At least one recipient is required",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const campaignResult = await client.query(
            `
            INSERT INTO pr_campaigns (
                name,
                subject,
                email_body,
                status
            )
            VALUES ($1, $2, $3, 'draft')
            RETURNING
                pr_campaign_id AS "id",
                name,
                subject,
                email_body AS "emailBody",
                status,
                created_at AS "createdAt"
            `,
            [
                name.trim(),
                subject.trim(),
                emailBody.trim(),
            ]
        );

        const campaign =
            campaignResult.rows[0];

        const uniqueContactIds = [
            ...new Set(
                contactIds
                    .map(Number)
                    .filter(Number.isInteger)
            ),
        ];

        if (uniqueContactIds.length === 0) {
            throw new Error(
                "No valid recipient IDs supplied"
            );
        }

        /*
         * Only add active contacts that actually
         * exist in the PR contact database.
         */
        const contactsResult =
            await client.query(
                `
                SELECT pr_contact_id
                FROM pr_contacts
                WHERE pr_contact_id = ANY($1::bigint[])
                  AND is_active = TRUE
                `,
                [uniqueContactIds]
            );

        if (contactsResult.rowCount === 0) {
            throw new Error(
                "No valid recipients found"
            );
        }

        for (const contact of contactsResult.rows) {
            await client.query(
                `
                INSERT INTO pr_campaign_recipients (
                    pr_campaign_id,
                    pr_contact_id,
                    status
                )
                VALUES ($1, $2, 'pending')
                `,
                [
                    campaign.id,
                    contact.pr_contact_id,
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            ...campaign,
            id: Number(campaign.id),
            recipientCount:
                contactsResult.rowCount,
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            "POST /pr-campaigns failed:",
            error
        );

        res.status(500).json({
            error: "Unable to create PR campaign",
        });
    } finally {
        client.release();
    }
});

prCampaignsRouter.post(
    "/:id/attachment",
    upload.single("attachment"),

    async (req, res) => {
        const campaignId = Number(req.params.id);

        if (
            !Number.isInteger(campaignId) ||
            campaignId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid campaign ID",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "MP3 attachment is required",
            });
        }

        try {
            const relativePath = path.relative(
                process.cwd(),
                req.file.path
            );

            const result = await pool.query(
                `
                UPDATE pr_campaigns
                SET
                    attachment_filename = $1,
                    attachment_path = $2,
                    updated_at = NOW()
                WHERE pr_campaign_id = $3
                RETURNING
                    pr_campaign_id AS "id",
                    attachment_filename AS "attachmentFilename",
                    attachment_path AS "attachmentPath"
                `,
                [
                    req.file.originalname,
                    relativePath,
                    campaignId,
                ]
            );

            if (result.rowCount === 0) {
                fs.unlinkSync(req.file.path);

                return res.status(404).json({
                    error: "Campaign not found",
                });
            }

            const campaign =
                result.rows[0];

            res.json({
                ...campaign,
                id: Number(campaign.id),
            });
        } catch (error) {
            /*
             * Don't leave an orphaned upload behind
             * if the database update fails.
             */
            if (
                req.file?.path &&
                fs.existsSync(req.file.path)
            ) {
                fs.unlinkSync(req.file.path);
            }

            console.error(
                "Campaign attachment upload failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to save campaign attachment",
            });
        }
    }
);

prCampaignsRouter.get(
    "/:id",
    async (req, res) => {
        const campaignId = Number(req.params.id);

        if (
            !Number.isInteger(campaignId) ||
            campaignId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid campaign ID",
            });
        }

        try {
            const campaignResult =
                await pool.query(
                    `
                    SELECT
                        pr_campaign_id AS "id",
                        name,
                        subject,
                        email_body AS "emailBody",
                        attachment_filename AS "attachmentFilename",
                        attachment_path AS "attachmentPath",
                        status,
                        created_at AS "createdAt",
                        updated_at AS "updatedAt",
                        sent_at AS "sentAt"
                    FROM pr_campaigns
                    WHERE pr_campaign_id = $1
                    `,
                    [campaignId]
                );

            if (campaignResult.rowCount === 0) {
                return res.status(404).json({
                    error: "Campaign not found",
                });
            }

            const recipientsResult =
                await pool.query(
                    `
                    SELECT
                        r.pr_campaign_recipient_id
                            AS "recipientId",
                        r.pr_contact_id
                            AS "contactId",
                        r.status,
                        r.sent_at
                            AS "sentAt",
                        r.error_message
                            AS "errorMessage",
                        c.outlet,
                        c.contact_name
                            AS "contactName",
                        c.email
                    FROM pr_campaign_recipients r
                    JOIN pr_contacts c
                        ON c.pr_contact_id =
                            r.pr_contact_id
                    WHERE r.pr_campaign_id = $1
                    ORDER BY c.outlet
                    `,
                    [campaignId]
                );

            const campaign =
                campaignResult.rows[0];

            res.json({
                ...campaign,
                id: Number(campaign.id),

                recipients:
                    recipientsResult.rows.map(
                        (recipient) => ({
                            ...recipient,
                            recipientId: Number(
                                recipient.recipientId
                            ),
                            contactId: Number(
                                recipient.contactId
                            ),
                        })
                    ),
            });
        } catch (error) {
            console.error(
                `GET /pr-campaigns/${campaignId} failed:`,
                error
            );

            res.status(500).json({
                error:
                    "Unable to load campaign",
            });
        }
    }
);

prCampaignsRouter.post(
    "/:id/send-test",
    async (req, res) => {
        const campaignId = Number(req.params.id);

        if (
            !Number.isInteger(campaignId) ||
            campaignId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid campaign ID",
            });
        }

        try {
            const result = await pool.query(
                `
                SELECT
                    pr_campaign_id AS "id",
                    name,
                    subject,
                    email_body AS "emailBody",
                    attachment_filename AS "attachmentFilename",
                    attachment_path AS "attachmentPath",
                    status
                FROM pr_campaigns
                WHERE pr_campaign_id = $1
                `,
                [campaignId]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    error: "Campaign not found",
                });
            }

            const campaign = result.rows[0];

            /*
             * Deliberately hard-coded for development.
             *
             * This endpoint must NOT use
             * pr_campaign_recipients.
             */
            const testRecipient =
                "info@redtemples.band";

            await sendEmail({
                to: testRecipient,
                subject: campaign.subject,
                text: campaign.emailBody,

                attachment:
                    campaign.attachmentFilename &&
                        campaign.attachmentPath
                        ? {
                            filename:
                                campaign.attachmentFilename,
                            path:
                                campaign.attachmentPath,
                        }
                        : undefined,
            });

            console.log(
                `Test campaign ${campaignId} sent to ${testRecipient}`
            );

            res.json({
                success: true,
                campaignId,
                sentTo: testRecipient,
            });
        } catch (error) {
            console.error(
                `POST /pr-campaigns/${campaignId}/send-test failed:`,
                error
            );

            res.status(500).json({
                error: "Unable to send test email",
            });
        }
    }
);