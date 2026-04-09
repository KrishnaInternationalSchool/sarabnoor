const router = require("express").Router();
const {
  createVolunteerApplication,
  getMyVolunteerApplication,
  getAllVolunteerApplications,
  reviewVolunteerApplication
} = require("../controllers/volunteerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const { persistUploadedFiles } = require("../services/uploadService");

router.post(
  "/apply",
  protect,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "documents", maxCount: 5 }
  ]),
  persistUploadedFiles,
  createVolunteerApplication
);
router.get("/mine", protect, getMyVolunteerApplication);
router.get("/", protect, adminOnly, getAllVolunteerApplications);
router.patch("/:id/review", protect, adminOnly, reviewVolunteerApplication);

module.exports = router;
