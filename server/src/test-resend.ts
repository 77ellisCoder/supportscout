import "dotenv/config";
import { Resend } from "resend";

const apiKey =
    process.env.RESEND_API_KEY;

if (!apiKey) {
    throw new Error(
        "RESEND_API_KEY is not set"
    );
}

const resend =
    new Resend(apiKey);

async function main() {
    const {
        data,
        error,
    } = await resend.emails.send({
        from:
            process.env.FROM_SUPPORTSCOUT,

        to: [
            "77.ellis.christopher@gmail.com",
        ],

        subject:
            "SupportScout Resend test",

        html:
            "<p>SupportScout email is working! 🎸</p>",
    });

    if (error) {
        console.error(
            "Resend error:",
            error
        );

        process.exit(1);
    }

    console.log(
        "Email sent:",
        data
    );
}

main();