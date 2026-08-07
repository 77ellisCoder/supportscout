import { BandRepository } from "../../../repositories/BandRepository";

export async function seedDevelopmentData() {
    const existingBands = await BandRepository.getAll();

    if (existingBands.length > 0) {
        console.log("Database already seeded.");
        return;
    }

    console.log("Seeding development database...");

    await BandRepository.create({
        bandName: "Red Temples",
        isOurBand: true,
        isVerified: true,
        shortDescription: "Perth Indie Rock / Reggae",
    });

    await BandRepository.create({
        bandName: "Example Perth Band",
        shortDescription: "Placeholder band",
    });

    console.log("Seed complete.");
}