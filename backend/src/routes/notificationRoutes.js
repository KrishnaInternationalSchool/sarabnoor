const router = require("express").Router();
const {
  getNotifications,
  markNotificationAsRead
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;
