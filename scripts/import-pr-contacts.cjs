require("dotenv").config();

const path = require("path");
const XLSX = require("xlsx");
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is not defined"
    );
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const FILE_PATH = path.join(
    process.cwd(),
    "assets",
    "imports",
    "Band_PR_contact_list.ods"
);

function clean(value) {
    if (
        value === undefined ||
        value === null
    ) {
        return null;
    }

    const result = String(value).trim();

    return result || null;
}

function cleanEmail(value) {
    const email = clean(value);

    if (!email) {
        return null;
    }

    // Spreadsheet also contains values such as:
    // "Use contact form"
    // "Use application form"
    // "Use website contact"
    if (!email.includes("@")) {
        return null;
    }

    return email;
}

async function run() {
    const workbook =
        XLSX.readFile(FILE_PATH);

    const sheetName =
        workbook.SheetNames[0];

    if (!sheetName) {
        throw new Error(
            "Spreadsheet contains no sheets"
        );
    }

    const worksheet =
        workbook.Sheets[sheetName];

    const rows =
        XLSX.utils.sheet_to_json(
            worksheet,
            {
                defval: null,
            }
        );

    console.log(
        `Found ${rows.length} PR contacts`
    );

    const client =
        await pool.connect();

    let inserted = 0;
    let updated = 0;
    let manual = 0;

    try {
        await client.query("BEGIN");

        for (const row of rows) {
            const outlet =
                clean(row["Outlet"]);

            if (!outlet) {
                continue;
            }

            const language =
                clean(row["Language"]);

            const contactName =
                clean(
                    row[
                    "Contact Name / Department"
                    ]
                );

            const rawEmail =
                clean(row["Email"]);

            const email =
                cleanEmail(rawEmail);

            const contactType =
                clean(row["Type"]);

            const location =
                clean(row["Location"]);

            const bestPitch =
                clean(row["Best Pitch"]);

            const summary =
                clean(row["Summary"]);

            const sourceUrl =
                clean(row["Source URL"]);

            if (!email) {
                manual++;
            }

            /*
             * Match existing contacts by:
             *
             * outlet + contact name + email
             *
             * IS NOT DISTINCT FROM allows NULL
             * values to compare safely.
             */
            const existing =
                await client.query(
                    `
                    SELECT pr_contact_id
                    FROM pr_contacts
                    WHERE LOWER(outlet) =
                          LOWER($1)
                      AND contact_name
                          IS NOT DISTINCT FROM $2
                      AND email
                          IS NOT DISTINCT FROM $3
                    LIMIT 1
                    `,
                    [
                        outlet,
                        contactName,
                        email,
                    ]
                );

            if (existing.rowCount > 0) {
                await client.query(
                    `
                    UPDATE pr_contacts
                    SET
                        language = $1,
                        contact_type = $2,
                        location = $3,
                        best_pitch = $4,
                        summary = $5,
                        source_url = $6,
                        is_active = TRUE,
                        updated_at = NOW()
                    WHERE pr_contact_id = $7
                    `,
                    [
                        language,
                        contactType,
                        location,
                        bestPitch,
                        summary,
                        sourceUrl,
                        existing.rows[0]
                            .pr_contact_id,
                    ]
                );

                updated++;
            } else {
                await client.query(
                    `
                    INSERT INTO pr_contacts (
                        outlet,
                        language,
                        contact_name,
                        email,
                        contact_type,
                        location,
                        best_pitch,
                        summary,
                        source_url,
                        is_active
                    )
                    VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, TRUE
                    )
                    `,
                    [
                        outlet,
                        language,
                        contactName,
                        email,
                        contactType,
                        location,
                        bestPitch,
                        summary,
                        sourceUrl,
                    ]
                );

                inserted++;
            }
        }

        await client.query("COMMIT");

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "PR contact import complete"
        );
        console.log(
            "======================================"
        );
        console.log(
            `Rows:          ${rows.length}`
        );
        console.log(
            `Inserted:      ${inserted}`
        );
        console.log(
            `Updated:       ${updated}`
        );
        console.log(
            `Manual/form:   ${manual}`
        );
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            "PR contact import failed:",
            error
        );

        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

run();