import fs from "node:fs/promises";

import {
    Resend,
} from "resend";

const apiKey =
    process.env.RESEND_API_KEY;

if (!apiKey) {
    throw new Error(
        "RESEND_API_KEY is required"
    );
}

const resend =
    new Resend(apiKey);

type SendEmailInput = {
    to: string;
    subject: string;
    text: string;

    attachment?: {
        filename: string;
        path: string;
    };
};

export async function sendEmail({
    to,
    subject,
    text,
    attachment,
}: SendEmailInput) {

    const attachments =
        attachment
            ? [
                {
                    filename:
                        attachment.filename,

                    content:
                        await fs.readFile(
                            attachment.path
                        ),
                },
            ]
            : undefined;

    const {
        data,
        error,
    } = await resend.emails.send({
        from:
            process.env.PR_FROM_EMAIL ?? process.env.FROM_SUPPORTSCOUT,

        to: [to],

        subject,

        text,

        attachments,
    });

    if (error) {
        throw new Error(
            `Resend email failed: ${error.message}`
        );
    }

    return data;
}