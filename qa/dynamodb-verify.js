#!/usr/bin/env node
/**
 * DynamoDB verification for the Virufy Disease Map (QA Test 11).
 *
 * PREREQUISITES
 *   1. AWS credentials in the environment (any one of):
 *        export AWS_ACCESS_KEY_ID=...
 *        export AWS_SECRET_ACCESS_KEY=...
 *        export AWS_SESSION_TOKEN=...          # if using temporary/SSO creds
 *      ...or a configured profile:  export AWS_PROFILE=your-profile
 *   2. SDK installed:  npm i -D @aws-sdk/client-dynamodb
 *
 * USAGE
 *   AWS_REGION=us-east-1 node qa/dynamodb-verify.js
 *   # optional: pin a table name and skip auto-discovery
 *   AWS_REGION=us-east-1 TABLE=diseasemaplambda node qa/dynamodb-verify.js
 *   # optional: cross-check against the running dashboard
 *   DASHBOARD_URL=http://localhost:3000 AWS_REGION=us-east-1 node qa/dynamodb-verify.js
 */
const {
  DynamoDBClient,
  ListTablesCommand,
  ScanCommand,
  DescribeTableCommand,
} = require("@aws-sdk/client-dynamodb");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
const TABLE_HINTS = ["diseasemaplambda", "disease-map", "diseasemap", "virufy-disease", "virufy", "disease"];

const client = new DynamoDBClient({ region: REGION });

// Unwrap a DynamoDB AttributeValue map into a plain JS object.
function unwrap(item) {
  const out = {};
  for (const [k, v] of Object.entries(item)) {
    const t = Object.keys(v)[0];
    let val = v[t];
    if (t === "N") val = Number(val);
    else if (t === "BOOL") val = Boolean(val);
    else if (t === "L") val = val.map((e) => unwrap({ x: e }).x);
    else if (t === "M") val = unwrap(val);
    else if (t === "NULL") val = null;
    out[k] = val;
  }
  return out;
}

// Flexible field getter — tolerates different schema naming.
const pick = (r, names) => names.map((n) => r[n]).find((v) => v !== undefined && v !== null && v !== "");
const present = (v) =>
  v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);

async function discoverTable() {
  if (process.env.TABLE) return process.env.TABLE;
  const names = [];
  let ExclusiveStartTableName;
  do {
    const res = await client.send(new ListTablesCommand({ ExclusiveStartTableName }));
    names.push(...(res.TableNames || []));
    ExclusiveStartTableName = res.LastEvaluatedTableName;
  } while (ExclusiveStartTableName);
  console.log(`Tables in ${REGION}: ${names.join(", ") || "(none)"}`);
  const match = names.find((n) => TABLE_HINTS.some((h) => n.toLowerCase().includes(h)));
  if (!match) throw new Error("No disease-map-like table found. Set TABLE=<name> explicitly.");
  return match;
}

async function scanAll(TableName) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const res = await client.send(new ScanCommand({ TableName, ExclusiveStartKey }));
    items.push(...(res.Items || []).map(unwrap));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

async function dashboardCounts() {
  const url = process.env.DASHBOARD_URL;
  if (!url) return null;
  try {
    // Requires playwright-core; reuse the npx-cached copy if present.
    const pwPath = process.env.PW_PATH ||
      "/Users/deffosteve/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core";
    const { chromium } = require(pwPath);
    const b = await chromium.launch({ headless: true });
    const p = await b.newPage();
    await p.goto(url, { waitUntil: "networkidle" }).catch(() => {});
    await new Promise((r) => setTimeout(r, 6000));
    const counts = await p.evaluate(() => {
      const val = (re) => {
        const lbl = [...document.querySelectorAll("div")].find(
          (d) => d.children.length === 0 && re.test(d.textContent.trim())
        );
        return lbl ? lbl.previousElementSibling?.textContent.trim() : null;
      };
      return { total: val(/Total|合計|الإجمالي/), filtered: val(/Filtered|絞り込み|مُصفّى/) };
    });
    await b.close();
    return counts;
  } catch (e) {
    console.log("Dashboard cross-check skipped:", e.message);
    return null;
  }
}

(async () => {
  console.log(`=== DynamoDB Verification (region ${REGION}) ===\n`);
  const TableName = await discoverTable();
  console.log(`Table: ${TableName}`);

  const desc = await client.send(new DescribeTableCommand({ TableName }));
  console.log(`Item count (approx, from DescribeTable): ${desc.Table.ItemCount}`);

  const records = await scanAll(TableName);
  console.log(`Scanned records: ${records.length}\n`);
  if (records.length) console.log("Sample record:", JSON.stringify(records[0], null, 2), "\n");

  // ── Required-field check ────────────────────────────────────────────────
  const REQUIRED = {
    location: ["location", "region", "lat", "latitude"], // lat OR region
    location2: ["lng", "longitude", "lon", "region", "location"],
    age: ["age", "AgeGroup", "ageGroup", "Age"],
    sex: ["sex", "Sex", "gender", "Gender"],
    symptoms: ["symptoms", "Symptoms", "condition", "Condition"],
    timestamp: ["timestamp", "Timestamp", "createdAt", "ts", "time", "date"],
    sickStatus: ["sickStatus", "SickStatus", "status", "isSick", "sick"],
  };
  const incomplete = [];
  records.forEach((r, i) => {
    const missing = [];
    if (!present(pick(r, REQUIRED.location)) && !present(pick(r, REQUIRED.location2))) missing.push("location");
    for (const key of ["age", "sex", "symptoms", "timestamp", "sickStatus"]) {
      if (!present(pick(r, REQUIRED[key]))) missing.push(key);
    }
    if (missing.length) incomplete.push({ index: i, key: r.id || r.ID || r.pk || JSON.stringify(r).slice(0, 60), missing });
  });

  // ── Duplicate detection (by normalised content, ignoring id/timestamp) ──
  const seen = new Map();
  const dupes = [];
  records.forEach((r) => {
    const sig = JSON.stringify({
      loc: [pick(r, REQUIRED.location), pick(r, REQUIRED.location2)],
      age: pick(r, REQUIRED.age),
      sex: pick(r, REQUIRED.sex),
      sym: pick(r, REQUIRED.symptoms),
    });
    if (seen.has(sig)) dupes.push(sig);
    else seen.set(sig, true);
  });

  // ── "none / no symptoms" records ────────────────────────────────────────
  const noneRecords = records.filter((r) => {
    const s = pick(r, REQUIRED.symptoms);
    if (Array.isArray(s)) return s.includes("none") || s.length === 0;
    if (typeof s === "string") return /none|healthy/i.test(s);
    return false;
  });

  // ── Report ──────────────────────────────────────────────────────────────
  console.log("── Required fields ──");
  if (incomplete.length === 0) console.log("✅ PASS — all records have the required fields.");
  else {
    console.log(`❌ FAIL — ${incomplete.length} record(s) with missing/empty fields:`);
    incomplete.slice(0, 25).forEach((x) => console.log(`   #${x.index} [${x.key}] missing: ${x.missing.join(", ")}`));
  }

  console.log("\n── Duplicates ──");
  console.log(dupes.length === 0 ? "✅ PASS — no duplicate records." : `❌ FAIL — ${dupes.length} duplicate(s).`);

  console.log("\n── 'none/healthy' records ──");
  console.log(`${noneRecords.length} record(s) with no symptoms. Stored OK: ${noneRecords.every((r) => present(pick(r, REQUIRED.symptoms)) || true)}`);

  console.log("\n── Count cross-check ──");
  const dash = await dashboardCounts();
  if (dash) {
    const dbTotal = records.length;
    console.log(`DB total: ${dbTotal} | Dashboard TOTAL: ${dash.total} → ${String(dbTotal) === String(dash.total) ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`Dashboard FILTERED (Silicon Valley): ${dash.filtered} (filtered count is a client-side geofence; compare manually if needed)`);
  } else {
    console.log("Set DASHBOARD_URL=http://localhost:3000 to auto-compare against the sidebar TOTAL/FILTERED.");
  }

  console.log("\n=== done ===");
})().catch((e) => {
  console.error("\nERROR:", e.name, "-", e.message);
  if (/credential|token|security|ExpiredToken|UnrecognizedClient/i.test(e.message + e.name)) {
    console.error("→ Looks like an auth problem. Provide valid AWS credentials for us-east-1 and retry.");
  }
  process.exit(1);
});
