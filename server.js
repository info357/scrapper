const express = require("express");
const { runScraper, DEFAULT_KEYWORDS } = require("./scraper");

const app = express();
app.use(express.json());

// In-memory job store
const jobs = new Map();

function generateJobId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// POST /api/scrape - Start a scraping job
// Body: { pincodes: ["380015", "380014"], keywords: ["companies", ...] }
app.post("/api/scrape", (req, res) => {
  const { pincodes, keywords = DEFAULT_KEYWORDS } = req.body;

  if (!pincodes || !Array.isArray(pincodes) || pincodes.length === 0) {
    return res.status(400).json({ error: "pincodes array is required" });
  }

  const jobId = generateJobId();

  const job = {
    id: jobId,
    status: "running",
    pincodes,
    keywords,
    scraped: 0,
    latest: null,
    currentPincode: null,
    currentKeyword: null,
    results: [],
    error: null,
    startedAt: new Date().toISOString(),
    completedAt: null
  };

  jobs.set(jobId, job);

  // Run scraper in background (non-blocking)
  runScraper(pincodes, keywords, ({ scraped, latest, pincode, keyword }) => {
    job.scraped = scraped;
    job.latest = latest;
    job.currentPincode = pincode;
    job.currentKeyword = keyword;
  })
    .then(results => {
      job.status = "completed";
      job.results = results;
      job.completedAt = new Date().toISOString();
      console.log(`Job ${jobId} completed. Total: ${results.length}`);
    })
    .catch(err => {
      job.status = "failed";
      job.error = err.message;
      console.error(`Job ${jobId} failed:`, err.message);
    });

  res.status(202).json({
    jobId,
    status: "running",
    message: `Scraping started for ${pincodes.length} pincode(s). Each pincode will get its own sheet tab.`
  });
});

// GET /api/status/:jobId - Check job progress
app.get("/api/status/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });

  res.json({
    jobId: job.id,
    status: job.status,
    pincodes: job.pincodes,
    scraped: job.scraped,
    latest: job.latest,
    currentPincode: job.currentPincode,
    currentKeyword: job.currentKeyword,
    error: job.error,
    startedAt: job.startedAt,
    completedAt: job.completedAt
  });
});

// GET /api/jobs - List all jobs
app.get("/api/jobs", (req, res) => {
  const list = Array.from(jobs.values()).map(j => ({
    jobId: j.id,
    status: j.status,
    pincodes: j.pincodes,
    scraped: j.scraped,
    startedAt: j.startedAt,
    completedAt: j.completedAt
  }));
  res.json(list);
});

// GET /api/health - Health check for AWS load balancer
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Scraper API running on port ${PORT}`);
});
