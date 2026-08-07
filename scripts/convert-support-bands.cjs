const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const projectRoot = path.resolve(__dirname, "..");

const inputPath = path.join(
  projectRoot,
  "assets",
  "imports",
  "Support Bands.ods"
);

const outputPath = path.join(
  projectRoot,
  "assets",
  "imports",
  "support-bands.json"
);

if (!fs.existsSync(inputPath)) {
  console.error(`Spreadsheet not found: ${inputPath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(inputPath);

if (workbook.SheetNames.length === 0) {
  console.error("The spreadsheet contains no worksheets.");
  process.exit(1);
}

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const sourceRows = XLSX.utils.sheet_to_json(worksheet, {
  defval: null,
  raw: false,
});

function normaliseText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const result = String(value).trim();
  return result.length > 0 ? result : null;
}

function parseInteger(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDrawRange(value) {
  const text = normaliseText(value);

  if (!text) {
    return {
      estimatedDrawMin: null,
      estimatedDrawMax: null,
    };
  }

  const numbers = text
    .match(/\d+/g)
    ?.map((number) => Number.parseInt(number, 10))
    .filter(Number.isFinite);

  if (!numbers || numbers.length === 0) {
    return {
      estimatedDrawMin: null,
      estimatedDrawMax: null,
    };
  }

  if (numbers.length === 1) {
    return {
      estimatedDrawMin: numbers[0],
      estimatedDrawMax: numbers[0],
    };
  }

  return {
    estimatedDrawMin: Math.min(numbers[0], numbers[1]),
    estimatedDrawMax: Math.max(numbers[0], numbers[1]),
  };
}

const bands = sourceRows
  .map((row) => {
    const draw = parseDrawRange(
      row["Estimated Draw"] ??
        row["Estimated draw"] ??
        row["Draw"]
    );

    return {
      bandName: normaliseText(row["Band"]),
      genreStyle: normaliseText(
        row["Genre / Style"] ??
          row["Genre"] ??
          row["Style"]
      ),
      similarArtists: normaliseText(
        row["Similar Artists"] ??
          row["Similar artists"]
      ),
      memberCount: parseInteger(
        row["Members"] ??
          row["Member Count"] ??
          row["Member count"]
      ),
      recentUpcomingGigs: normaliseText(
        row["Recent / Upcoming Gigs"] ??
          row["Recent/Upcoming Gigs"] ??
          row["Gigs"]
      ),
      estimatedDrawMin: draw.estimatedDrawMin,
      estimatedDrawMax: draw.estimatedDrawMax,
      redTemplesFit: parseInteger(
        row["Red Temples Fit"] ??
          row["Red Temples fit"] ??
          row["Fit"]
      ),
      bookingPriority: normaliseText(
        row["Booking Priority"] ??
          row["Booking priority"] ??
          row["Priority"]
      ),
      notes: normaliseText(row["Notes"]),
    };
  })
  .filter((band) => band.bandName);

fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      source: "Support Bands.ods",
      worksheet: sheetName,
      generatedAt: new Date().toISOString(),
      bands,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`Converted ${bands.length} bands.`);
console.log(`Source worksheet: ${sheetName}`);
console.log(`Created: ${outputPath}`);