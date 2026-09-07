import "dotenv/config";

import cors from "cors";
import express from "express";

import { bandsRouter } from "./routes/bands";

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

app.listen(PORT, () => {
    console.log(
        `SupportScout API running on port ${PORT}`
    );
});