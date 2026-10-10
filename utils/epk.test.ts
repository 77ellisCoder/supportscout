import test from "node:test";
import assert from "node:assert/strict";

import { buildEpkArchiveEntries } from "./epk";

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
