const router = require("express").Router();
const { createUpload, getUpload } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const { persistSingleUpload } = require("../services/uploadService");

router.post("/", protect, upload.single("file"), persistSingleUpload, createUpload);
router.get("/:filename", getUpload);

module.exports = router;
