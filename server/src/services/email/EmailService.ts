import nodemailer from "nodemailer";

const smtpPort = Number(
    process.env.SMTP_PORT ?? 465
);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure:
        process.env.SMTP_SECURE === "true",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function verifyEmailConnection() {
    await transporter.verify();
}

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
    return transporter.sendMail({
        from: process.env.PR_FROM_EMAIL,
        to,
        subject,
        text,

        attachments: attachment
            ? [
                  {
                      filename: attachment.filename,
                      path: attachment.path,
                  },
              ]
            : [],
    });
}