const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (req, res) => {
  res.send("YouTube MP3 Backend is running.");
});

// Download route
app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const options = {
      filter: "audioonly",
      quality: "highestaudio",
      dlChunkSize: 0,
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "*/*",
          "Connection": "keep-alive",
          "Referer": "https://www.youtube.com/",
          "Origin": "https://www.youtube.com",
          "Cookie":
            "CONSENT=YES+cb.20240423-01-p0.en+FX+716; PREF=tz=America.Los_Angeles",
        },
      },
    };

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="track.mp3"'
    );

    ytdl(url, options)
      .on("error", (err) => {
        console.error("YTDL ERROR:", err);
        res.status(500).json({ error: "YouTube blocked request", details: err.message });
      })
      .pipe(res);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Download failed", details: err.message });
  }
});

// 🔥 This was missing
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});