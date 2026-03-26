// const axios = require('axios');

// const API_KEY = 'AIzaSyAxx7rOzPPyuydpOvccU4J_eTSln6DXPGI';
// const searchQuery = 'software companies in Delhi';

// async function getCompanies() {
//   try {
//     const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;
//     console.log({searchUrl})
//     const searchResponse = await axios.get(searchUrl);
    
//     const places = searchResponse.data.results;
//     console.log({places})

//     for (const place of places) {
//       const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${API_KEY}`;
//       const detailsResponse = await axios.get(detailsUrl);

//       const details = detailsResponse.data.result;

//       console.log({
//         name: details.name,
//         address: details.formatted_address,
//         phone: details.formatted_phone_number,
//         website: details.website,
//         rating: details.rating,
//         reviews: details.user_ratings_total
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// getCompanies();

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const ObjectsToCsv = require('objects-to-csv');

// (async () => {
//   const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
//   const page = await browser.newPage();

//   const searchQuery = 'software companies in Delhi';
//   const googleMapsURL = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

//   console.log(`Opening: ${googleMapsURL}`);
//   await page.goto(googleMapsURL, { waitUntil: 'networkidle2' });

//   await page.waitForSelector('.hfpxzc');
//   console.log('Initial results loaded...');

//   // Infinite scroll
//   const scrollContainerSelector = '.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd';
//   let previousHeight = 0;
//   let scrollTries = 0;

//   while (scrollTries < 20) {
//     const scrollContainer = await page.$(scrollContainerSelector);

//     if (scrollContainer) {
//       await page.evaluate(el => el.scrollBy(0, 1000), scrollContainer);
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       const currentHeight = await page.evaluate(el => el.scrollHeight, scrollContainer);

//       if (currentHeight === previousHeight) {
//         scrollTries++;
//         console.log(`Scroll stuck, try ${scrollTries}/20`);
//       } else {
//         scrollTries = 0;
//         previousHeight = currentHeight;
//         console.log('Scrolled further...');
//       }
//     } else {
//       console.log('Scroll container not found!');
//       break;
//     }
//   }

//   console.log('Finished scrolling... Extracting details per card.');

//   const cardSelectors = await page.$$('.hfpxzc');
//   console.log(`Found ${cardSelectors.length} business cards.`);

//   const results = [];

//   for (let i = 0; i < cardSelectors.length; i++) {
//     console.log(`Processing ${i + 1}/${cardSelectors.length}...`);
//     try {
//       await cardSelectors[i].click();
//       await new Promise(resolve => setTimeout(resolve, 3000)); // wait for details panel to load

//       const data = await page.evaluate(() => {
//         const getText = (selector) => document.querySelector(selector)?.innerText || null;
//         const getHref = (selector) => document.querySelector(selector)?.href || null;

//         const name = getText('h1.DUwDvf.fontHeadlineLarge');
//         const category = getText('.RcCsl.fVHpi.w4vB1d span');
//         const address = getText('button[data-item-id="address"] .UsdlK');
//         const phone = getText('button[data-item-id^="phone"] .UsdlK');
//         const website = getHref('a[data-item-id="authority"]');
//         const rating = getText('.F7nice span');
//         const reviews = getText('.F7nice .UY7F9')?.replace(/[()]/g, '') || null;

//         return { name, category, address, phone, website, rating, reviews };
//       });

//       if (data.name) results.push(data);
//     } catch (err) {
//       console.error(`Error processing card ${i + 1}:`, err);
//     }
//   }

//   console.log(`Extracted ${results.length} valid business entries.`);

//   // Save to CSV
//   console.log({results})
//   const csv = new ObjectsToCsv(results);
//   const outputPath = path.join(__dirname, 'google_maps_businesses.csv');
//   await csv.toDisk(outputPath);

//   console.log(`Data saved to ${outputPath}`);

//   await browser.close();
// })();


// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const ObjectsToCsv = require('objects-to-csv');

// (async () => {
//   const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
//   const page = await browser.newPage();

//   const searchQuery = 'software companies in Delhi';
//   const googleMapsURL = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

//   console.log(`Opening: ${googleMapsURL}`);
//   await page.goto(googleMapsURL, { waitUntil: 'networkidle2' });

//   await page.waitForSelector('.hfpxzc');
//   console.log('Initial results loaded...');

//   // Infinite scroll
//   const scrollContainerSelector = '.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd';
//   let previousHeight = 0;
//   let scrollTries = 0;

//   while (scrollTries < 20) {
//     const scrollContainer = await page.$(scrollContainerSelector);

//     if (scrollContainer) {
//       await page.evaluate(el => el.scrollBy(0, 1000), scrollContainer);
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       const currentHeight = await page.evaluate(el => el.scrollHeight, scrollContainer);

//       if (currentHeight === previousHeight) {
//         scrollTries++;
//         console.log(`Scroll stuck, try ${scrollTries}/20`);
//       } else {
//         scrollTries = 0;
//         previousHeight = currentHeight;
//         console.log('Scrolled further...');
//       }
//     } else {
//       console.log('Scroll container not found!');
//       break;
//     }
//   }

//   console.log('Finished scrolling... Extracting details per card.');

//   const cardSelectors = await page.$$('.hfpxzc');
//   console.log(`Found ${cardSelectors.length} business cards.`);

//   const results = [];

//   for (let i = 0; i < cardSelectors.length; i++) {
//     console.log(`Processing ${i + 1}/${cardSelectors.length}...`);
//     try {
//       await cardSelectors[i].click();
//       await page.waitForSelector('h1', { timeout: 10000 }); // Wait for the business name
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // Optional: take screenshot for debugging
//       // await page.screenshot({ path: `screenshot_${i + 1}.png` });

//       // const data = await page.evaluate(() => {
//       //   const getText = (selector) => {
//       //     const el = document.querySelector(selector);
//       //     return el ? el.innerText.trim() : null;
//       //   };

//       //   const getHref = (selector) => {
//       //     const el = document.querySelector(selector);
//       //     return el ? el.href : null;
//       //   };

//       //   const name = getText('h1');
//       //   const category = getText('button[jsaction*="pane.category"]') || getText('.RcCsl span');
//       //   const address = getText('[data-item-id="address"]') || getText('button[data-item-id="address"]');
//       //   const phone = getText('[data-item-id^="phone"]') || getText('button[data-item-id^="phone"]');
//       //   const website = getHref('a[data-item-id="authority"]');
//       //   const rating = getText('.F7nice span');
//       //   const reviews = getText('.F7nice .UY7F9')?.replace(/[()]/g, '');
//       const data = await page.evaluate(() => {
//         const safeQuery = (selector) => {
//           const el = document.querySelector(selector);
//           return el ? el.innerText.trim() : null;
//         };
      
//         const safeLink = (selector) => {
//           const el = document.querySelector(selector);
//           return el ? el.href : null;
//         };
      
//         const name = safeQuery('h1.DUwDvf'); // Google's business name heading
//         const category = safeQuery('div.fontBodyMedium span[jsaction]'); // Business category
//         const address = safeQuery('button[data-item-id="address"] .Io6YTe');
//         const phone = safeQuery('button[data-item-id^="phone"] .Io6YTe');
//         const website = safeLink('a[data-item-id="authority"]');
//         const rating = safeQuery('.F7nice span');
//         const reviews = safeQuery('.F7nice .UY7F9')?.replace(/[()]/g, '');

//         return { name, category, address, phone, website, rating, reviews };
//       });

//       if (data.name) results.push(data);
//     } catch (err) {
//       console.error(`Error processing card ${i + 1}:`, err.message);
//     }
//   }

//   console.log(`Extracted ${results.length} valid business entries.`);

//   // Save to CSV
//   console.log({ results });
//   const csv = new ObjectsToCsv(results);
//   const outputPath = path.join(__dirname, 'google_maps_businesses.csv');
//   await csv.toDisk(outputPath);

//   console.log(`Data saved to ${outputPath}`);

//   await browser.close();
// })();

// const puppeteer = require("puppeteer");
// const ObjectsToCsv = require("objects-to-csv");

// const zipcodes = ["380015", "380014"];
// const searchKeyword = "software companies";

// const delay = (time) => new Promise((res) => setTimeout(res, time));

// async function extractSocialLinks(page, website) {
//   const socials = {
//     linkedin: null,
//     facebook: null,
//     instagram: null,
//     twitter: null,
//     youtube: null
//   };

//   try {
//     await page.goto(website, { waitUntil: "domcontentloaded", timeout: 15000 });

//     const links = await page.evaluate(() => {
//       return Array.from(document.querySelectorAll("a"))
//         .map(a => a.href)
//         .filter(Boolean);
//     });

//     for (const link of links) {
//       if (link.includes("linkedin.com")) socials.linkedin = link;
//       if (link.includes("facebook.com")) socials.facebook = link;
//       if (link.includes("instagram.com")) socials.instagram = link;
//       if (link.includes("twitter.com") || link.includes("x.com")) socials.twitter = link;
//       if (link.includes("youtube.com")) socials.youtube = link;
//     }

//   } catch (err) {
//     console.log("Could not open website:", website);
//   }

//   return socials;
// }

// (async () => {

//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null
//   });

//   const page = await browser.newPage();
//   const results = [];

//   for (const zip of zipcodes) {

//     const query = `${searchKeyword} in ${zip}`;
//     const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

//     console.log("Searching:", query);

//     await page.goto(url, { waitUntil: "networkidle2" });

//     await page.waitForSelector(".hfpxzc");

//     const scrollContainer = await page.$(".m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd");

//     for (let i = 0; i < 20; i++) {
//       await page.evaluate(el => el.scrollBy(0, 1000), scrollContainer);
//       await delay(2000);
//     }

//     const cards = await page.$$(".hfpxzc");

//     console.log(`Found ${cards.length} companies`);

//     for (let i = 0; i < cards.length; i++) {

//       try {

//         const currentCards = await page.$$(".hfpxzc");

//         await currentCards[i].click();

//         await page.waitForSelector("h1.DUwDvf", { timeout: 10000 });

//         await delay(2000);

//         const data = await page.evaluate(() => {

//           const text = (sel) => document.querySelector(sel)?.innerText || null;
//           const link = (sel) => document.querySelector(sel)?.href || null;

//           return {
//             name: text("h1.DUwDvf"),
//             category: text("div.fontBodyMedium span"),
//             address: text("button[data-item-id='address'] .Io6YTe"),
//             phone: text("button[data-item-id^='phone'] .Io6YTe"),
//             website: link("a[data-item-id='authority']"),
//             rating: text(".F7nice span"),
//             reviews: text(".F7nice .UY7F9")
//           };

//         });

//         if (!data.name) continue;

//         console.log("Scraped:", data.name);

//         let socials = {
//           linkedin: null,
//           facebook: null,
//           instagram: null,
//           twitter: null,
//           youtube: null
//         };

//         if (data.website) {
//           socials = await extractSocialLinks(page, data.website);
//         }

//         results.push({
//           ...data,
//           ...socials,
//           zipcode: zip
//         });

//       } catch (err) {

//         console.log({err})
//         console.log("Skipping company");

//       }
//     }
//   }

//   console.log("Total companies:", results.length);

//   const csv = new ObjectsToCsv(results);

//   await csv.toDisk("./companies_with_socials.csv");

//   console.log("Saved CSV");

//   await browser.close();

// })();

// const puppeteer = require("puppeteer");
// const ObjectsToCsv = require("objects-to-csv");

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// const keyword = "software companies";
// const pincode = "110001";

// (async () => {

//   const browser = await puppeteer.launch({
//     headless: true,
//     defaultViewport: null
//   });

//   const page = await browser.newPage();

//   const results = [];

//   const searchURL = `https://www.google.com/maps/search/${encodeURIComponent(keyword + " in " + pincode)}`;

//   console.log("Opening:", searchURL);

//   await page.goto(searchURL, { waitUntil: "networkidle2" });

//   await page.waitForSelector(".hfpxzc");

//   const scrollContainerSelector = ".m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd";

//   const scrollContainer = await page.$(scrollContainerSelector);

//   console.log("Scrolling results...");

//   let previousHeight = 0;

//   for (let i = 0; i < 25; i++) {

//     const newHeight = await page.evaluate((el) => {

//       el.scrollBy(0, 1000);

//       return el.scrollHeight;

//     }, scrollContainer);

//     if (newHeight === previousHeight) break;

//     previousHeight = newHeight;

//     await delay(2000);
//   }

//   console.log("Scrolling finished");

//   const totalListings = (await page.$$(".hfpxzc")).length;

//   console.log("Total listings:", totalListings);

//   for (let i = 0; i < totalListings; i++) {

//     try {

//       const cards = await page.$$(".hfpxzc");

//       if (!cards[i]) continue;

//       await cards[i].click();

//       await page.waitForSelector("h1", { timeout: 10000 });

//       await delay(2000);

//       const data = await page.evaluate(() => {

//         const text = (selector) =>
//           document.querySelector(selector)?.innerText || null;

//         const link = (selector) =>
//           document.querySelector(selector)?.href || null;

//         const name = text("h1");

//         const category = text("button[jsaction*='pane.rating.category']") ||
//                          text("div.fontBodyMedium span");

//         const address = text("button[data-item-id='address'] .Io6YTe");

//         const phone = text("button[data-item-id^='phone'] .Io6YTe");

//         const website = link("a[data-item-id='authority']");

//         const rating = text(".F7nice span");

//         const reviews =
//           document
//             .querySelector(".F7nice .UY7F9")
//             ?.innerText.replace(/[()]/g, "") || null;

//         return {
//           name,
//           category,
//           address,
//           phone,
//           website,
//           rating,
//           reviews
//         };

//       });

//       if (data.name) {

//         results.push(data);

//         console.log("Saved:", data.name);

//       }

//     } catch (e) {

//       console.log("Skipping business", e.message);

//     }
//   }

//   console.log("Total saved:", results.length);

//   const csv = new ObjectsToCsv(results);

//   await csv.toDisk("./leads.csv");

//   console.log("CSV saved: leads.csv");

//   await browser.close();

// })();


// const puppeteer = require("puppeteer");
// const ObjectsToCsv = require("objects-to-csv");
// const readline = require("readline-sync");

// const delay = (ms) => new Promise(res => setTimeout(res, ms));

// const pincodeInput = readline.question("Enter pincodes (comma separated): ");
// const pincodes = pincodeInput.split(",").map(p => p.trim());

// function extractEmails(text) {
//   const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g;
//   const matches = text.match(regex);
//   return matches ? [...new Set(matches)] : [];
// }

// (async () => {

//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: ["--start-maximized"]
//   });

//   const page = await browser.newPage();
//   const results = [];

//   for (const pincode of pincodes) {

//     const searchURL = `https://www.google.com/maps/search/${encodeURIComponent(pincode)}`;
//     console.log("Searching:", searchURL);

//     await page.goto(searchURL, { waitUntil: "domcontentloaded" });

//     // wait for map results container
//     await page.waitForSelector('div[role="feed"]', { timeout: 60000 });

//     const scrollContainer = await page.$('div[role="feed"]');

//     let previousHeight = 0;

//     for (let i = 0; i < 80; i++) {

//       const newHeight = await page.evaluate(el => {
//         el.scrollBy(0, 2000);
//         return el.scrollHeight;
//       }, scrollContainer);

//       if (newHeight === previousHeight) break;

//       previousHeight = newHeight;

//       await delay(2000);
//     }

//     const cards = await page.$$("a.hfpxzc");

//     console.log(`Listings found for ${pincode}:`, cards.length);

//     for (let i = 0; i < cards.length; i++) {

//       try {

//         const elements = await page.$$("a.hfpxzc");
//         if (!elements[i]) continue;

//         await elements[i].click();

//         await page.waitForSelector("h1", { timeout: 15000 });

//         await delay(2000);

//         const data = await page.evaluate(() => {

//           const text = sel =>
//             document.querySelector(sel)?.innerText || null;

//           const link = sel =>
//             document.querySelector(sel)?.href || null;

//           return {
//             name: text("h1"),
//             phone: text("button[data-item-id^='phone'] .Io6YTe"),
//             address: text("button[data-item-id='address'] .Io6YTe"),
//             website: link("a[data-item-id='authority']")
//           };

//         });

//         if (!data.name) continue;

//         let emails = [];

//         if (data.website) {

//           try {

//             await page.goto(data.website, {
//               waitUntil: "domcontentloaded",
//               timeout: 15000
//             });

//             const pageText = await page.evaluate(() => document.body.innerText);

//             emails = extractEmails(pageText);

//           } catch (err) {
//             console.log("Website visit failed");
//           }
//         }

//         results.push({
//           name: data.name,
//           phone: data.phone,
//           address: data.address,
//           website: data.website,
//           emails: emails.join(", "),
//           pincode
//         });

//         console.log("Saved:", data.name);

//         // go back to maps
//         await page.goBack({ waitUntil: "domcontentloaded" });
//         await page.waitForSelector('div[role="feed"]');

//       } catch (err) {

//         console.log("Skipping business");

//       }
//     }
//   }

//   console.log("Total leads:", results.length);

//   const csv = new ObjectsToCsv(results);
//   await csv.toDisk("./all_companies.csv");

//   console.log("CSV saved: all_companies.csv");

//   await browser.close();

// })();


// const puppeteer = require("puppeteer");
// const ObjectsToCsv = require("objects-to-csv");
// const readline = require("readline-sync");

// const delay = ms => new Promise(res => setTimeout(res, ms));

// const pincodeInput = readline.question("Enter pincodes (comma separated): ");
// const pincodes = pincodeInput.split(",").map(p => p.trim());

// const keywords = [
//   "companies",
//   "business",
//   "offices",
//   "services",
//   "stores",
//   "industries",
//   "agencies",
//   "consultants"
// ];

// (async () => {

//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: ["--start-maximized"]
//   });

//   const page = await browser.newPage();

//   const results = [];
//   const seen = new Set();

//   for (const pincode of pincodes) {

//     for (const keyword of keywords) {

//       const searchURL =
//         `https://www.google.com/maps/search/${encodeURIComponent(keyword + " in " + pincode)}`;

//       console.log("\nSearching:", keyword, "in", pincode);

//       await page.goto(searchURL, { waitUntil: "domcontentloaded" });

//       // await page.waitForTimeout(4000);
//       await delay(4000);

//       const scrollContainer = await page.$('div[role="feed"]');

//       if (!scrollContainer) {
//         console.log("No listings for", keyword);
//         continue;
//       }

//       let previousHeight = 0;

//       for (let i = 0; i < 100; i++) {

//         const newHeight = await page.evaluate(el => {
//           el.scrollBy(0, 2000);
//           return el.scrollHeight;
//         }, scrollContainer);

//         if (newHeight === previousHeight) break;

//         previousHeight = newHeight;

//         await delay(2000);
//       }

//       const listings = await page.$$("a.hfpxzc");

//       console.log("Listings found:", listings.length);

//       for (let i = 0; i < listings.length; i++) {

//         try {

//           const cards = await page.$$("a.hfpxzc");

//           if (!cards[i]) continue;

//           await cards[i].click();

//           await page.waitForSelector("h1.DUwDvf", { timeout: 10000 });

//           await delay(2000);

//           const data = await page.evaluate(() => {

//             const text = sel =>
//               document.querySelector(sel)?.innerText || null;

//             const link = sel =>
//               document.querySelector(sel)?.href || null;

            

//             return {
//               name: text("h1.DUwDvf"),
//               phone: text("button[data-item-id^='phone'] .Io6YTe"),
//               address: text("button[data-item-id='address'] .Io6YTe"),
//               website: link("a[data-item-id='authority']")
//             };

//           });
//           const socials = {
//             linkedin: null,
//           };
//           const links = await page.evaluate(() => {
//             return Array.from(document.querySelectorAll("a"))
//               .map(a => a.href)
//               .filter(Boolean);
//           });
      
//           console.log({links: links.length})
//           for (const link of links) {
//             if (link.includes("linkedin.com")) socials.linkedin = link;
//           }

//           if (!data.name) continue;

//           console.log({socials})

//           if (seen.has(data.name)) continue;

//           seen.add(data.name);

//           results.push({
//             name: data.name,
//             phone: data.phone,
//             address: data.address,
//             website: data.website,
//             keyword,
//             pincode,
//             linkedIn: socials.linkedin
//           });

//           console.log("Saved:", data.name);

//         } catch (err) {

//           console.log("Skipping listing", {err});

//         }
//       }
//     }
//   }

//   console.log("\nTotal unique companies:", results.length);

//   const csv = new ObjectsToCsv(results);

//   await csv.toDisk("./advanced_maps_leads.csv");

//   console.log("CSV saved: advanced_maps_leads.csv");

//   await browser.close();

// })();


const puppeteer = require("puppeteer");
const ObjectsToCsv = require("objects-to-csv");
const readline = require("readline-sync");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const spreadsheetId = "1RN8e4uf27FIBAi_SQeH_vU4LZrM4KXe6uB_d3WHP5wE"; // from sheet URL

async function appendToSheet(rows) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const result = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows
    }
  });
  console.log({result})
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// User input
const pincodeInput = readline.question("Enter pincodes (comma separated): ");
const pincodes = pincodeInput.split(",").map(p => p.trim());

const keywords = [
  "companies",
  "business",
  "offices",
  "services",
  "stores",
  "industries",
  "agencies",
  "consultants"
];

(async () => {

  const browser = await puppeteer.launch({
    headless: false, // change to true for background
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  // ✅ separate page for website scraping
  const websitePage = await browser.newPage();

  const results = [];
  const seen = new Set();

  for (const pincode of pincodes) {

    for (const keyword of keywords) {

      const searchURL =
        `https://www.google.com/maps/search/${encodeURIComponent(keyword + " in " + pincode)}`;

      console.log("\nSearching:", keyword, "in", pincode);

      await page.goto(searchURL, { waitUntil: "domcontentloaded" });
      await delay(4000);

      const scrollContainer = await page.$('div[role="feed"]');

      if (!scrollContainer) {
        console.log("No listings for", keyword);
        continue;
      }

      let previousHeight = 0;

      // ✅ infinite scroll
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

      console.log("Listings found:", listings.length);

      for (let i = 0; i < listings.length; i++) {

        try {

          const cards = await page.$$("a.hfpxzc");

          if (!cards[i]) continue;

          await cards[i].click();

          await page.waitForSelector("h1.DUwDvf", { timeout: 10000 });
          await delay(2000);

          const data = await page.evaluate(() => {

            const text = sel =>
              document.querySelector(sel)?.innerText || null;

            const link = sel =>
              document.querySelector(sel)?.href || null;

            return {
              name: text("h1.DUwDvf"),
              phone: text("button[data-item-id^='phone'] .Io6YTe"),
              address: text("button[data-item-id='address'] .Io6YTe"),
              website: link("a[data-item-id='authority']")
            };

          });

          if (!data.name) continue;

          // ✅ LinkedIn extraction from WEBSITE
          let linkedin = null;

          if (data.website) {
            try {

              await websitePage.goto(data.website, {
                waitUntil: "domcontentloaded",
                timeout: 15000
              });

              const links = await websitePage.evaluate(() => {
                return Array.from(document.querySelectorAll("a"))
                  .map(a => a.href)
                  .filter(Boolean);
              });

              linkedin =
                links.find(l => l.includes("linkedin.com/company")) || null;

            } catch (err) {
              console.log("Website visit failed");
            }
          }

          // ✅ remove duplicates
          if (seen.has(data.name)) continue;
          seen.add(data.name);

          results.push({
            name: data.name,
            phone: data.phone,
            address: data.address,
            website: data.website,
            keyword,
            pincode,
            linkedIn: linkedin
          });
          
          // ✅ send to Google Sheets
          await appendToSheet([[
            data.name,
            data.phone,
            data.address,
            data.website,
            linkedin,
            pincode,
            keyword
          ]]);

          console.log("Saved:", data.name);

        } catch (err) {
          console.log("Skipping listing:", err.message);
        }
      }
    }
  }

  console.log("\nTotal unique companies:", results.length);

  const csv = new ObjectsToCsv(results);

  await csv.toDisk("./advanced_maps_leads.csv");

  console.log("CSV saved: advanced_maps_leads.csv");

  await browser.close();

})();