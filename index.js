const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

ffmpeg.setFfmpegPath(ffmpegPath);

// Test route
app.get("/", (req, res) => {
  res.send("yt2mp3 backend is alive!");
});

// 🔥 MP3 download route
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");

    ffmpeg(ytdl(videoUrl, { quality: "highestaudio" }))
      .audioBitrate(128)
      .format("mp3")
      .pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download audio" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
