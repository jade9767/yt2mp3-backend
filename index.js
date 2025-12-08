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

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="track.mp3"'
    );

    ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
    }).pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
