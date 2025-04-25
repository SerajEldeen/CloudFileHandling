require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.use(cors());

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
});

const BUCKET = process.env.BUCKET;
const upload = multer({ dest: "uploads/" }); // temporarily save locally

// Upload file to S3
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  try {
    const fileStream = fs.createReadStream(file.path);
    const key = file.originalname;
    const uploadParams = {
      Bucket: BUCKET,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
      ACL: "public-read", // optional
    };

    const parallelUpload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const result = await parallelUpload.done();

    fs.unlinkSync(file.path);

    res.send("Successfully uploaded: " + result.Location);
  } catch (err) {
    console.error("Upload failed", err);
    res.status(500).send("Upload failed");
  }
});

// List files in S3
app.get("/list", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({ Bucket: BUCKET });
    const result = await s3.send(command);
    const files = result.Contents?.map((item) => item.Key);
    res.send(files);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error listing files");
  }
});

// Delete file from S3
app.delete("/delete/:filename", async (req, res) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: req.params.filename,
    });
    await s3.send(command);
    res.send("File deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting file");
  }
});

app.listen(3001, "0.0.0.0", () => console.log("Server running on port 3001"));
