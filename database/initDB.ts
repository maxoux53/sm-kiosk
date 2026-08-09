import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const initSql = readFileSync(
    join(__dirname, "scripts", "init.sql"),
    { encoding: "utf-8" },
);
const seedSql = readFileSync(
    join(__dirname, "scripts", "seed-dev.sql"),
    { encoding: "utf-8" },
);
const requests = initSql + "\n" + seedSql;

try {
    await pool.query(requests, []);
    console.log("done.");
} catch (e) {
    console.error(e);
    process.exit(1);
} finally {
    await pool.end();
}
