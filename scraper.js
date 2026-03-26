const puppeteer = require("puppeteer");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const SPREADSHEET_ID = "1RN8e4uf27FIBAi_SQeH_vU4LZrM4KXe6uB_d3WHP5wE";
const HEADERS = ["Name", "Phone", "Address", "Website", "LinkedIn", "Pincode", "Keyword"];

const DEFAULT_KEYWORDS = [
  "companies", "business", "offices", "services",
  "stores", "industries", "agencies", "consultants"
];

const delay = ms => new Promise(res => setTimeout(res, ms));

async function getSheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

async function ensureSheet(sheets, pincode) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existingTitles = spreadsheet.data.sheets.map(s => s.properties.title);

  if (!existingTitles.includes(pincode)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: pincode } } }]
      }
    });

    // Add header row to new sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${pincode}!A1:G1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [HEADERS] }
    });

    console.log(`Created sheet tab: ${pincode}`);
  }
}

async function appendToSheet(sheets, rows, pincode) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${pincode}!A:G`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: rows }
  });
}

async function runScraper(pincodes, keywords = DEFAULT_KEYWORDS, onProgress) {
  const sheets = await getSheetsClient();

  // Create a sheet tab for each pincode upfront
  for (const pincode of pincodes) {
    await ensureSheet(sheets, pincode);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  const websitePage = await browser.newPage();

  const results = [];
  const seen = new Set();

  try {
    for (const pincode of pincodes) {
      for (const keyword of keywords) {
        const searchURL = `https://www.google.com/maps/search/${encodeURIComponent(keyword + " in " + pincode)}`;

        console.log(`Searching: ${keyword} in ${pincode}`);

        await page.goto(searchURL, { waitUntil: "domcontentloaded" });
        await delay(4000);

        const scrollContainer = await page.$('div[role="feed"]');

        if (!scrollContainer) {
          console.log(`No listings for ${keyword} in ${pincode}`);
          continue;
        }

        // Infinite scroll
        let previousHeight = 0;
        for (let i = 0; i < 100; i++) {
          const newHeight = await page.evaluate(el => {
            el.scrollBy(0, 2000);
            return el.scrollHeight;
          }, scrollContainer);

          if (newHeight === previousHeight) break;
          previousHeight = newHeight;
          await delay(2000);
        }

        const listings = await page.$$("a.hfpxzc");
        console.log(`Found ${listings.length} listings`);

        for (let i = 0; i < listings.length; i++) {
          try {
            const cards = await page.$$("a.hfpxzc");
            if (!cards[i]) continue;

            await cards[i].click();
            await page.waitForSelector("h1.DUwDvf", { timeout: 10000 });
            await delay(2000);

            const data = await page.evaluate(() => {
              const text = sel => document.querySelector(sel)?.innerText || null;
              const link = sel => document.querySelector(sel)?.href || null;
              return {
                name: text("h1.DUwDvf"),
                phone: text("button[data-item-id^='phone'] .Io6YTe"),
                address: text("button[data-item-id='address'] .Io6YTe"),
                website: link("a[data-item-id='authority']")
              };
            });

            if (!data.name || seen.has(data.name)) continue;
            seen.add(data.name);

            let linkedin = null;
            if (data.website) {
              try {
                await websitePage.goto(data.website, { waitUntil: "domcontentloaded", timeout: 15000 });
                const links = await websitePage.evaluate(() =>
                  Array.from(document.querySelectorAll("a")).map(a => a.href).filter(Boolean)
                );
                linkedin = links.find(l => l.includes("linkedin.com/company")) || null;
              } catch {
                // website unreachable, skip linkedin
              }
            }

            results.push({ ...data, linkedin, pincode, keyword });

            await appendToSheet(sheets, [[
              data.name, data.phone, data.address, data.website, linkedin, pincode, keyword
            ]], pincode);

            console.log(`Saved: ${data.name}`);

            if (onProgress) {
              onProgress({ scraped: results.length, latest: data.name, pincode, keyword });
            }

          } catch (err) {
            console.log(`Skipping listing ${i + 1}:`, err.message);
          }
        }
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

module.exports = { runScraper, DEFAULT_KEYWORDS };
