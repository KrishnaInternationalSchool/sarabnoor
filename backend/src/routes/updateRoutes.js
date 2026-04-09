const router = require("express").Router();
const { getUpdates, createUpdate } = require("../controllers/updateController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getUpdates);
router.post("/", protect, adminOnly, createUpdate);

module.exports = router;
