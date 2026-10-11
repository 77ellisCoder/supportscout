import {
    PDFDocument,
    StandardFonts,
    clip,
    endPath,
    popGraphicsState,
    pushGraphicsState,
    rectangle,
    rgb,
    type PDFFont,
    type PDFImage,
    type PDFPage,
} from "pdf-lib/cjs";

export type EpkPdfImage = {
    name: string;
    bytes: Uint8Array;
};

export type RenderEpkPdfInput = {
    bandName: string;
    documentType: "bio" | "press-release";
    text: string;
    logoImage?: EpkPdfImage | null;
    pressImage?: EpkPdfImage | null;
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PAGE_MARGIN = 48;
const HERO_HEIGHT = 190;
const BRAND_RED = rgb(0.78, 0.13, 0.17);
const DARK = rgb(0.11, 0.11, 0.12);
const MUTED = rgb(0.4, 0.4, 0.42);

export async function renderEpkPdf({
    bandName,
    documentType,
    text,
    logoImage = null,
    pressImage = null,
}: RenderEpkPdfInput): Promise<Uint8Array> {
    const pdf = await PDFDocument.create();
    pdf.setTitle(
        `${bandName} - ${documentType === "bio" ? "Band Bio" : "Press Release"}`
    );
    pdf.setAuthor(bandName);
    pdf.setCreator("SupportScout");

    const regularFont = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    const embeddedLogo = await embedImage(pdf, logoImage);
    const embeddedPressImage = await embedImage(pdf, pressImage);
    const pages: PDFPage[] = [];
    let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);

    let textTop = drawHeader({
        page,
        bandName,
        documentType,
        logo: embeddedLogo,
        pressImage: embeddedPressImage,
        boldFont,
    });

    const paragraphs = text
        .trim()
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
        .filter(Boolean);

    for (const paragraph of paragraphs) {
        const lines = wrapText(paragraph, regularFont, 11, PAGE_WIDTH - PAGE_MARGIN * 2);

        for (const line of lines) {
            if (textTop < PAGE_MARGIN + 28) {
                page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                pages.push(page);
                textTop = PAGE_HEIGHT - PAGE_MARGIN;
            }

            page.drawText(line, {
                x: PAGE_MARGIN,
                y: textTop,
                size: 11,
                font: regularFont,
                color: DARK,
            });
            textTop -= 16;
        }

        textTop -= 10;
    }

    pages.forEach((currentPage, index) => {
        currentPage.drawLine({
            start: { x: PAGE_MARGIN, y: 30 },
            end: { x: PAGE_WIDTH - PAGE_MARGIN, y: 30 },
            thickness: 0.6,
            color: rgb(0.84, 0.84, 0.85),
        });
        currentPage.drawText(
            `${bandName.toUpperCase()}  |  ${documentType === "bio" ? "BIO" : "PRESS RELEASE"}`,
            {
                x: PAGE_MARGIN,
                y: 17,
                size: 7,
                font: regularFont,
                color: MUTED,
            }
        );
        currentPage.drawText(`${index + 1}`, {
            x: PAGE_WIDTH - PAGE_MARGIN,
            y: 17,
            size: 7,
            font: regularFont,
            color: MUTED,
        });
    });

    return pdf.save();
}

async function embedImage(
    pdf: PDFDocument,
    image: EpkPdfImage | null
): Promise<PDFImage | null> {
    if (!image) {
        return null;
    }

    const extension = image.name.split(".").pop()?.toLowerCase();

    if (extension === "png") {
        return pdf.embedPng(image.bytes);
    }

    if (extension === "jpg" || extension === "jpeg") {
        return pdf.embedJpg(image.bytes);
    }

    return null;
}

function drawHeader({
    page,
    bandName,
    documentType,
    logo,
    pressImage,
    boldFont,
}: {
    page: PDFPage;
    bandName: string;
    documentType: RenderEpkPdfInput["documentType"];
    logo: PDFImage | null;
    pressImage: PDFImage | null;
    boldFont: PDFFont;
}): number {
    let cursorY = PAGE_HEIGHT - PAGE_MARGIN;
    const isBio = documentType === "bio";

    if (pressImage) {
        drawCoverImage(
            page,
            pressImage,
            0,
            PAGE_HEIGHT - HERO_HEIGHT,
            PAGE_WIDTH,
            HERO_HEIGHT
        );
        cursorY = PAGE_HEIGHT - HERO_HEIGHT - 34;
    }

    page.drawText(isBio ? "BAND BIO" : "PRESS RELEASE", {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 9,
        font: boldFont,
        color: BRAND_RED,
    });
    cursorY -= 31;

    page.drawText(sanitizePdfText(bandName), {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 26,
        font: boldFont,
        color: DARK,
        maxWidth: logo ? PAGE_WIDTH - PAGE_MARGIN * 2 - 125 : PAGE_WIDTH - PAGE_MARGIN * 2,
    });

    if (logo) {
        drawContainedImage(
            page,
            logo,
            PAGE_WIDTH - PAGE_MARGIN - 112,
            cursorY - 11,
            112,
            46
        );
    }

    cursorY -= 24;

    page.drawLine({
        start: { x: PAGE_MARGIN, y: cursorY },
        end: { x: PAGE_WIDTH - PAGE_MARGIN, y: cursorY },
        thickness: 1.2,
        color: BRAND_RED,
    });
    cursorY -= 25;

    return cursorY;
}

function drawContainedImage(
    page: PDFPage,
    image: PDFImage,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number
): number {
    const scale = Math.min(
        maxWidth / image.width,
        maxHeight / image.height
    );
    const width = image.width * scale;
    const height = image.height * scale;
    const imageX = x + (maxWidth - width) / 2;
    const imageY = y + (maxHeight - height) / 2;

    page.drawImage(image, {
        x: imageX,
        y: imageY,
        width,
        height,
    });

    return y;
}

function drawCoverImage(
    page: PDFPage,
    image: PDFImage,
    x: number,
    y: number,
    width: number,
    height: number
): void {
    const scale = Math.max(
        width / image.width,
        height / image.height
    );
    const imageWidth = image.width * scale;
    const imageHeight = image.height * scale;

    page.pushOperators(
        pushGraphicsState(),
        rectangle(x, y, width, height),
        clip(),
        endPath()
    );
    page.drawImage(image, {
        x: x + (width - imageWidth) / 2,
        y: y + (height - imageHeight) / 2,
        width: imageWidth,
        height: imageHeight,
    });
    page.pushOperators(popGraphicsState());
}

function wrapText(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number
): string[] {
    const words = sanitizePdfText(text).split(/\s+/);
    const lines: string[] = [];
    let line = "";

    for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;

        if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
            line = candidate;
            continue;
        }

        if (line) {
            lines.push(line);
        }

        line = word;
    }

    if (line) {
        lines.push(line);
    }

    return lines;
}

function sanitizePdfText(text: string): string {
    return text
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[–—]/g, "-")
        .replace(/…/g, "...")
        .replace(/[^\u0000-\u00ff]/g, "?");
}