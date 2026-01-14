const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

const TFL_APP_ID = process.env.TFL_APP_ID || "";
const TFL_APP_KEY = process.env.TFL_APP_KEY || "";

app.use(express.static("public"));

app.get("/api/rail-status", async (req, res) => {
  const modes = "tube,overground,elizabeth-line";

  const creds =
    TFL_APP_ID && TFL_APP_KEY
      ? `?app_id=${encodeURIComponent(TFL_APP_ID)}&app_key=${encodeURIComponent(TFL_APP_KEY)}`
      : "";

  const url = `https://api.tfl.gov.uk/Line/Mode/${modes}/Status${creds}`;

  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "tfl-status-board/1.0" }
    });

    if (!r.ok) return res.status(502).json({ error: "TfL API error" });

    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Failed to reach TfL API" });
  }
});

app.listen(PORT, () => {
  console.log(`TfL board running on http://localhost:${PORT}`);
});
