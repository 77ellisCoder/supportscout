import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

import { buildEpkArchiveEntries, createBandEpkArchive } from "./epk";
import { renderEpkPdf } from "./epk-pdf";

test("buildEpkArchiveEntries creates the expected folder structure", () => {
    const entries = buildEpkArchiveEntries({
        bandName: "Red Temples",
        bioFiles: ["bio.pdf"],
        photoFiles: ["photo-1.jpg"],
        songFiles: ["song-1.mp3"],
    });

    assert.deepEqual(entries, [
        "Red Temples_EPK/Bio + Press Release/bio.pdf",
        "Red Temples_EPK/Press Photos/photo-1.jpg",
        "Red Temples_EPK/Song Files/song-1.mp3",
    ]);
});

test("renderEpkPdf creates a one-page A4 bio with embedded logo and press image", async () => {
    const logoBytes = new Uint8Array(
        await readFile(fileURLToPath(new URL("../assets/SupportScoutLogo.png", import.meta.url)))
    );
    const pdfBytes = await renderEpkPdf({
        bandName: "Red Temples",
        documentType: "bio",
        text: "A band bio paragraph.",
        logoImage: {
            name: "logo.png",
            bytes: logoBytes,
        },
        pressImage: {
            name: "press-photo.png",
            bytes: logoBytes,
        },
    });
    const pdf = await PDFDocument.load(pdfBytes);
    const page = pdf.getPages()[0];

    assert.equal(pdf.getPageCount(), 1);
    assert.ok(Math.abs(page.getWidth() - 595.28) < 1);
    assert.ok(Math.abs(page.getHeight() - 841.89) < 1);
    assert.equal((new TextDecoder().decode(pdfBytes)).match(/\/Subtype \/Image/g)?.length, 2);
});

test("createBandEpkArchive requires a logo and press image", async () => {
    await assert.rejects(
        createBandEpkArchive({
            bandName: "Red Temples",
            bioText: "Band biography.",
            pressReleaseText: "New single announcement.",
        }),
        /Select a band logo and at least one press image/
    );
});

test("createBandEpkArchive includes the bio and press release as PDFs", async () => {
    const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
    const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const originalCreateObjectUrl = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
    const logoBase64 = await readFile(
        fileURLToPath(new URL("../assets/SupportScoutLogo.png", import.meta.url)),
        "base64"
    );
    const imageUri = `data:image/png;base64,${logoBase64}`;
    let archiveBlob: Blob | null = null;

    Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: {
            createElement: () => ({
                click() {},
                remove() {},
                href: "",
                download: "",
            }),
            body: {
                appendChild() {},
            },
        },
    });
    Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: {
            setTimeout() {},
        },
    });
    Object.defineProperty(URL, "createObjectURL", {
        configurable: true,
        value: (blob: Blob) => {
            archiveBlob = blob;
            return "blob:epk-test";
        },
    });

    try {
        await createBandEpkArchive({
            bandName: "Red Temples",
            bioText: "Band biography.",
            pressReleaseText: "New single announcement.",
            logoFile: {
                name: "logo.png",
                uri: imageUri,
            },
            photoFiles: [{
                name: "press-photo.png",
                uri: imageUri,
            }],
        });

        assert.ok(archiveBlob);
        const archive = await JSZip.loadAsync(archiveBlob);
        const bioPath = "Red Temples_EPK/Bio + Press Release/Band Bio.pdf";
        const pressPath = "Red Temples_EPK/Bio + Press Release/Press Release.pdf";
        const bioFile = archive.file(bioPath);
        const pressFile = archive.file(pressPath);

        assert.ok(bioFile);
        assert.ok(pressFile);
        assert.ok(archive.file("Red Temples_EPK/Branding/logo.png"));
        assert.ok(archive.file("Red Temples_EPK/Press Photos/press-photo.png"));
        assert.equal(archive.file("Red Temples_EPK/Bio + Press Release/Band Bio.txt"), null);
        assert.equal(archive.file("Red Temples_EPK/Bio + Press Release/Press Release.txt"), null);
        const bioPdfBytes = await bioFile.async("uint8array");
        const pressPdfBytes = await pressFile.async("uint8array");
        assert.equal((await PDFDocument.load(bioPdfBytes)).getPageCount(), 1);
        assert.equal((await PDFDocument.load(pressPdfBytes)).getPageCount(), 1);
        assert.equal((new TextDecoder().decode(bioPdfBytes)).match(/\/Subtype \/Image/g)?.length, 2);
        assert.equal((new TextDecoder().decode(pressPdfBytes)).match(/\/Subtype \/Image/g)?.length, 2);
    } finally {
        if (originalDocument) {
            Object.defineProperty(globalThis, "document", originalDocument);
        } else {
            Reflect.deleteProperty(globalThis, "document");
        }

        if (originalWindow) {
            Object.defineProperty(globalThis, "window", originalWindow);
        } else {
            Reflect.deleteProperty(globalThis, "window");
        }

        if (originalCreateObjectUrl) {
            Object.defineProperty(URL, "createObjectURL", originalCreateObjectUrl);
        }
    }
});
