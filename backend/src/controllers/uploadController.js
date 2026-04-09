const Upload = require("../models/Upload");

const createUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("A file is required");
      error.statusCode = 400;
      throw error;
    }

    res.status(201).json({
      success: true,
      fileUrl: `/api/uploads/${req.file.filename}`
    });
  } catch (error) {
    next(error);
  }
};

const getUpload = async (req, res, next) => {
  try {
    const upload = await Upload.findOne({ filename: req.params.filename });

    if (!upload) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    res.set("Content-Type", upload.mimetype);
    res.send(upload.data);
  } catch (error) {
    next(error);
  }
};

module.exports = { createUpload, getUpload };
