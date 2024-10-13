const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const multerUpload = multer({ dest: "uploads/" });
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const getMetadata = (req, res) => {
  multerUpload.single("upfile")(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { originalname, mimetype, size } = req.file;
    res.json({
      name: originalname,
      type: mimetype,
      size: size,
    });
  });
};

app.post("/api/fileanalyse", getMetadata);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .then(
    console.log(
      "Connected to MongoDB + Backend listening on port",
      process.env.PORT
    )
  )
  .catch((error) => console.log(error));
