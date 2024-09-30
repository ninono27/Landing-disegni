const express = require("express");

const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");

app.use(express.static(path.join(__dirname, "public")));

// Serve drawing_board.html at the root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(bodyParser.json({ limit: "10mb" }));

app.post("/upload", (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "No image data provided." });
    }

    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image data." });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1];

    const filename = `${uuidv4()}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    fs.mkdir(path.join(__dirname, "uploads"), { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating uploads directory:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server error." });
      }

      fs.writeFile(filePath, base64Data, "base64", (err) => {
        if (err) {
          console.error("Error saving the image:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to save image." });
        }

        const fileUrl = `/uploads/${filename}`;
        return res.status(200).json({
          success: true,
          message: "Image uploaded successfully.",
          url: fileUrl,
        });
      });
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

app.use("/uploads", express.static(UPLOAD_DIR));

// Catch-all route for any other requests
app.get("*", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
