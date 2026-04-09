const router = require("express").Router();
const { getAdminDashboard } = require("../controllers/dashboardController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/admin", protect, adminOnly, getAdminDashboard);

module.exports = router;
