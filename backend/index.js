const express = require("express");
const multer = require("multer");
const gifFrames = require("gif-frames");
const GIFEncoder = require("gifencoder");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/split-gif", upload.single("gif"), async (req, res) => {
  const { rows, cols } = req.body;
  const filePath = req.file.path;

  try {
    // Extract frames from the GIF
    const frames = await gifFrames({ url: filePath, frames: "all", outputType: "canvas" });
    const frameWidth = frames[0].frameInfo.width;
    const frameHeight = frames[0].frameInfo.height;
    const partWidth = frameWidth / cols;
    const partHeight = frameHeight / rows;

    const parts = [];

    for (let frame of frames) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Create a new GIF encoder for each part
          const encoder = new GIFEncoder(partWidth, partHeight);
          // Create a canvas to draw the part of the image
          const canvas = createCanvas(partWidth, partHeight);
          const ctx = canvas.getContext("2d");

          // Start the GIF encoder
          encoder.start();
          // Set the repeat mode (0 = loop indefinitely)
          encoder.setRepeat(0);
          // Set the delay between frames
          encoder.setDelay(frame.frameInfo.delay);
          // Set the quality of the GIF
          encoder.setQuality(10);

          // Draw the part of the image onto the canvas
          ctx.drawImage(frame.getImage(), -c * partWidth, -r * partHeight);
          // Add the canvas as a frame to the encoder
          encoder.addFrame(ctx);
          // Finish the encoding process
          encoder.finish();

          // Get the encoded GIF data as a buffer
          const buffer = encoder.out.getData();
          // Define the path to save the part GIF
          const partPath = `uploads/part_${r}_${c}_${Date.now()}.gif`;
          // Write the buffer to a file
          fs.writeFileSync(partPath, buffer);

          // Add the part information to the parts array
          parts.push({
            path: partPath,
            position: { row: r, col: c }
          });
        }
      }
    }

    // Send the parts information as the response
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing GIF");
  } finally {
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});