const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  getRecentItems,
  getLostItems,
  getFoundItems,
  searchItems,
  getItemById,
  getAllItemsAdmin
} = require("../controllers/itemController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { validateItemReport } = require("../middlewares/validationMiddleware");

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  validateItemReport,
  createItem
);

router.get("/", getItems);
router.get("/recent", getRecentItems);
router.get("/search", searchItems);
router.get("/admin", authMiddleware, adminMiddleware, getAllItemsAdmin);
router.get("/lost", getLostItems);
router.get("/found", getFoundItems);
router.get("/:id", getItemById);

module.exports = router;