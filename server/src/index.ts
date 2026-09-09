import "dotenv/config";

import cors from "cors";
import express from "express";

import { bandsRouter } from "./routes/bands";
import { prContactsRouter } from "./routes/prContacts";
import { prCampaignsRouter } from "./routes/prCampaigns";

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

app.use("/bands", bandsRouter);
app.use("/pr-contacts", prContactsRouter);
app.use("/pr-campaigns", prCampaignsRouter);

app.listen(PORT, () => {
    console.log(
        `SupportScout API running on port ${PORT}`
    );
});