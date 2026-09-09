import { Router } from "express";

import { pool } from "../database/postgres";

export const prCampaignsRouter = Router();

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