const { v4: uuidv4 } = require("uuid");

const Upload = require("../models/Upload");

const persistSingleUpload = async (req, _res, next) => {
  try {
    if (req.file) {
      req.file.filename = uuidv4();
      await Upload.create({
        owner: req.user?._id,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const persistUploadedFiles = async (req, _res, next) => {
  try {
    if (req.files?.profilePhoto) {
      req.files.profilePhoto = await Promise.all(
        req.files.profilePhoto.map(async (file) => {
          const filename = uuidv4();
          await Upload.create({
            owner: req.user?._id,
            filename,
            mimetype: file.mimetype,
            size: file.size,
            data: file.buffer
          });
          return { ...file, filename };
        })
      );
    }

    if (req.files?.documents) {
      req.files.documents = await Promise.all(
        req.files.documents.map(async (file) => {
          const filename = uuidv4();
          await Upload.create({
            owner: req.user?._id,
            filename,
            mimetype: file.mimetype,
            size: file.size,
            data: file.buffer
          });
          return { ...file, filename };
        })
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { persistSingleUpload, persistUploadedFiles };
