const express = require("express");
const multer = require("multer");
const gifFrames = require("gif-frames");
const GIFEncoder = require("gifencoder");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 80;

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/split-gif", upload.single("gif"), async (req, res) => {
  const { rows, cols } = req.body;
  const filePath = req.file.path;

  try {
    const frames = await gifFrames({ url: filePath, frames: "all", outputType: "canvas" });
    const frameWidth = frames[0].frameInfo.width;
    const frameHeight = frames[0].frameInfo.height;
    const partWidth = frameWidth / cols;
    const partHeight = frameHeight / rows;

    const parts = [];

    for (let frame of frames) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const encoder = new GIFEncoder(partWidth, partHeight);
          const canvas = createCanvas(partWidth, partHeight);
          const ctx = canvas.getContext("2d");

          encoder.start();
          encoder.setRepeat(0);
          encoder.setDelay(frame.frameInfo.delay);
          encoder.setQuality(10);

          ctx.drawImage(frame.getImage(), -c * partWidth, -r * partHeight);
          encoder.addFrame(ctx);
          encoder.finish();

          const buffer = encoder.out.getData();
          const partPath = `uploads/part_${r}_${c}_${Date.now()}.gif`;
          fs.writeFileSync(partPath, buffer);

          parts.push({
            path: partPath,
            position: { row: r, col: c }
          });
        }
      }
    }

    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing GIF");
  } finally {
    fs.unlinkSync(filePath); // Clean up the uploaded file
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.resolve("./build/index.html"));
});

app.listen(port, () => {
  console.info(`Backend API started @ port ${port}`);
});