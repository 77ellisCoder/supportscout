import JSZip from "jszip";

import { renderEpkPdf, type EpkPdfImage } from "./epk-pdf";

export type EpkAssetReference =
    | number
    | string
    | {
        name?: string;
        uri: string;
        width?: number;
        height?: number;
    };

export type BuildEpkArchiveEntriesInput = {
    bandName: string;
    bioFiles?: string[];
    photoFiles?: string[];
    songFiles?: string[];
};

export type CreateBandEpkArchiveInput = {
    bandName: string;
    bioText?: string;
    pressReleaseText?: string;
    logoFile?: EpkAssetReference | null;
    bioFiles?: EpkAssetReference[];
    photoFiles?: EpkAssetReference[];
    songFiles?: EpkAssetReference[];
    additionalFiles?: EpkAssetReference[];
};

export function buildEpkArchiveEntries({
    bioFiles = [],
    photoFiles = [],
    songFiles = [],
}: BuildEpkArchiveEntriesInput): string[] {
    const addFiles = (
        folderName: string,
        files: string[]
    ): string[] =>
        files.map(
            (file) =>
                `${folderName}/${sanitizeFileName(file)}`
        );

    return [
        ...addFiles(
            "Bio + Press Release",
            bioFiles
        ),
        ...addFiles(
            "Press Photos",
            photoFiles
        ),
        ...addFiles(
            "Song Files",
            songFiles
        ),
    ];
}

export async function createBandEpkArchive({
    bandName,
    bioText = "",
    pressReleaseText = "",
    logoFile = null,
    bioFiles = [],
    photoFiles = [],
    songFiles = [],
    additionalFiles = [],
}: CreateBandEpkArchiveInput): Promise<{
    fileName: string;
    zipPath: string;
}> {
    if (logoFile == null || photoFiles.length === 0) {
        throw new Error(
            "Select a band logo and at least one press image before creating the EPK."
        );
    }

    const zip = new JSZip();
    const rootName = sanitizeArchiveName(
        bandName || "SupportScout Band"
    );
    const rootFolder = zip;

    const bioFolder = rootFolder.folder("Bio + Press Release");

    if (!bioFolder) {
        throw new Error(
            "Unable to create EPK text folder."
        );
    }

    const isWeb =
        typeof document !== "undefined" &&
        typeof window !== "undefined";

    const FileSystem = isWeb
        ? null
        : await import("expo-file-system/legacy");

    const logoImage = await loadPdfImage(logoFile, FileSystem);
    const pressImage = await loadPdfImage(photoFiles[0] ?? null, FileSystem);

    if (bioText.trim()) {
        const pdfBytes = await renderEpkPdf({
            bandName,
            documentType: "bio",
            text: bioText.trim(),
            logoImage,
            pressImage,
        });

        bioFolder.file("Band Bio.pdf", pdfBytes, { binary: true });
    }

    if (pressReleaseText.trim()) {
        const pdfBytes = await renderEpkPdf({
            bandName,
            documentType: "press-release",
            text: pressReleaseText.trim(),
            logoImage,
            pressImage,
        });

        bioFolder.file("Press Release.pdf", pdfBytes, { binary: true });
    }

    await addAssetFolder(
        rootFolder,
        "Bio + Press Release",
        bioFiles,
        null,
        FileSystem
    );

    if (logoFile) {
        await addAssetFolder(
            rootFolder,
            "Branding",
            [logoFile],
            "No logo was selected.",
            FileSystem
        );
    }

    await addAssetFolder(
        rootFolder,
        "Press Photos",
        photoFiles,
        "No press photos were provided.",
        FileSystem
    );

    await addAssetFolder(
        rootFolder,
        "Song Files",
        songFiles,
        "No song files were provided.",
        FileSystem
    );

    await addAssetFolder(
        rootFolder,
        "Additional Materials",
        additionalFiles,
        "No additional materials were selected.",
        FileSystem
    );

    const fileName = `${rootName}_EPK.zip`;

    if (isWeb) {
        const blob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 6,
            },
        });

        const url = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(
            () => URL.revokeObjectURL(url),
            1000
        );

        return {
            fileName,
            zipPath: url,
        };
    }

    if (!FileSystem) {
        throw new Error(
            "Unable to create native EPK archive path."
        );
    }

    const compressed = await zip.generateAsync({
        type: "uint8array",
        compression: "DEFLATE",
        compressionOptions: {
            level: 6,
        },
    });

    const zipPath = `${FileSystem.documentDirectory}${fileName}`;
    const base64 = arrayBufferToBase64(compressed.buffer);

    await FileSystem.writeAsStringAsync(zipPath, base64, {
        encoding: FileSystem.EncodingType.Base64,
    });

    return {
        fileName,
        zipPath,
    };
}

async function addAssetFolder(
    rootFolder: JSZip,
    folderName: string,
    files: EpkAssetReference[],
    emptyMessage: string | null,
    FileSystem: typeof import("expo-file-system/legacy") | null
): Promise<void> {
    const folder = rootFolder.folder(folderName);

    if (!folder) {
        return;
    }

    if (files.length === 0) {
        if (emptyMessage) {
            folder.file(
                "README.txt",
                emptyMessage
            );
        }

        return;
    }

    for (const file of files) {
        const asset = await resolveAsset(file);
        const bytes = await loadAssetBytes(asset, FileSystem);

        folder.file(
            sanitizeFileName(asset.name),
            bytes,
            {
                binary: true,
            }
        );
    }
}

async function loadPdfImage(
    file: EpkAssetReference | null,
    FileSystem: typeof import("expo-file-system/legacy") | null
): Promise<EpkPdfImage | null> {
    if (!file) {
        return null;
    }

    const asset = await resolveAsset(file);
    const extension = asset.name.split(".").pop()?.toLowerCase();

    if (!extension || !["png", "jpg", "jpeg"].includes(extension)) {
        throw new Error(
            `EPK PDFs require PNG or JPEG images. Convert ${asset.name} and try again.`
        );
    }

    return {
        name: asset.name,
        bytes: await loadAssetBytes(asset, FileSystem),
    };
}

async function loadAssetBytes(
    asset: { name: string; uri: string },
    FileSystem: typeof import("expo-file-system/legacy") | null
): Promise<Uint8Array> {
    if (FileSystem) {
        return readAssetBytes(asset.uri, FileSystem);
    }

    const response = await fetch(asset.uri);

    if (!response.ok) {
        throw new Error(
            `Unable to load EPK asset ${asset.name} (${response.status}).`
        );
    }

    return new Uint8Array(await response.arrayBuffer());
}

async function resolveAsset(
    file: EpkAssetReference
): Promise<{
    name: string;
    uri: string;
}> {
    if (typeof file === "object") {
        return {
            name: sanitizeFileName(file.name ?? "asset"),
            uri: file.uri,
        };
    }

    const { Asset } = await import("expo-asset");
    const asset = Asset.fromModule(file);
    const fileName = asset.name
        ? `${asset.name}.${asset.type}`
        : "asset";

    if (
        typeof document !== "undefined" &&
        typeof window !== "undefined"
    ) {
        return {
            name: sanitizeFileName(fileName),
            uri: asset.uri,
        };
    }

    await asset.downloadAsync();

    if (!asset.localUri) {
        throw new Error(
            "Unable to resolve bundled EPK asset."
        );
    }

    return {
        name: sanitizeFileName(fileName),
        uri: asset.localUri,
    };
}

async function readAssetBytes(
    uri: string,
    FileSystem: typeof import("expo-file-system/legacy")
): Promise<Uint8Array> {
    const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    return Uint8Array.from(
        atob(base64),
        (character) => character.charCodeAt(0)
    );
}

function sanitizeArchiveName(value: string): string {
    return value
        .trim()
        .replace(/[\\/]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[<>:"|?*]+/g, "")
        .replace(/\s+/g, " ")
        .trim() || "SupportScout Band";
}

function sanitizeFileName(value: string): string {
    const fileName = value
        .split(/[\\/]/)
        .pop() ?? value;

    return fileName
        .replace(/[<>:"|?*]+/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function arrayBufferToBase64(
    value: ArrayBufferLike | Uint8Array
): string {
    const bytes =
        value instanceof Uint8Array
            ? value
            : new Uint8Array(value);

    let binary = "";

    for (let index = 0; index < bytes.length; index++) {
        binary += String.fromCharCode(bytes[index]);
    }

    return btoa(binary);
}
