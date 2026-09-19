import "dotenv/config";

import cors from "cors";
import express from "express";

import { authRouter } from "./routes/auth";
import { bandsRouter } from "./routes/bands";
import { genresRouter } from "./routes/genres";
import { gigsRouter } from "./routes/gigs";
import { prContactsRouter } from "./routes/prContacts";
import { prCampaignsRouter } from "./routes/prCampaigns";
import { venuesRouter } from "./routes/venues"
import { initCalendarRouter } from "./routes/calendar";
import { pool } from "./database/postgres";

import {
    rehearsalProposalsRouter,
} from "./routes/rehearsalProposals";

import {
    rehearsalLocationsRouter,
} from "./routes/rehearsalLocations";

import {
    initSyncRouter,
} from "./routes/sync";

import {
    userBandsRouter,
} from "./routes/userBands";

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

app.use("/auth", authRouter);
app.use("/bands", bandsRouter);
app.use("/genres", genresRouter);
app.use("/gigs", gigsRouter);
app.use("/rehearsal-proposals", rehearsalProposalsRouter);
app.use("/rehearsal-locations", rehearsalLocationsRouter);
app.use("/pr-contacts", prContactsRouter);
app.use("/pr-campaigns", prCampaignsRouter);
app.use("/venues", venuesRouter);
app.use("/calendar", initCalendarRouter(pool));
app.use("/users", userBandsRouter);

app.use(
    "/sync",
    initSyncRouter(pool)
);

app.listen(PORT, () => {
    console.log(
        `SupportScout API running on port ${PORT}`
    );
});