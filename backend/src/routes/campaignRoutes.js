const router = require("express").Router();
const {
  getCampaigns,
  getCampaignBySlug,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = require("../controllers/campaignController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getCampaigns);
router.get("/:slug", getCampaignBySlug);
router.post("/", protect, adminOnly, createCampaign);
router.put("/:id", protect, adminOnly, updateCampaign);
router.delete("/:id", protect, adminOnly, deleteCampaign);

module.exports = router;
