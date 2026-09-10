import "dotenv/config";

import cors from "cors";
import express from "express";

import { bandsRouter } from "./routes/bands";
import { genresRouter } from "./routes/genres";
import { gigsRouter } from "./routes/gigs";
import { prContactsRouter } from "./routes/prContacts";
import { prCampaignsRouter } from "./routes/prCampaigns";

import {
    verifyEmailConnection,
} from "./services/email/EmailService";

const app = express();

const PORT = Number(
    process.env.API_PORT ?? 3001
);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
    });
});

// Verify email connection on startup
verifyEmailConnection()
    .then(() => {
        console.log(
            "SMTP connection verified"
        );
    })
    .catch((error) => {
        console.error(
            "SMTP connection failed:",
            error
        );
    });

app.use("/bands", bandsRouter);
app.use("/genres", genresRouter);
app.use("/gigs", gigsRouter);
app.use("/pr-contacts", prContactsRouter);
app.use("/pr-campaigns", prCampaignsRouter);

app.listen(PORT, () => {
    console.log(
        `SupportScout API running on port ${PORT}`
    );
});