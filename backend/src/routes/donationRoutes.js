const router = require("express").Router();
const {
  createDonationOrder,
  verifyDonation,
  getMyDonations,
  getAllDonations
} = require("../controllers/donationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createDonationOrder);
router.post("/verify", protect, verifyDonation);
router.get("/mine", protect, getMyDonations);
router.get("/", protect, adminOnly, getAllDonations);

module.exports = router;
