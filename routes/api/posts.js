const express = require("express");
const router = express.Router();

// @route GET api/Profile
// @route Test Route
// @route Public access

router.get("/", (req, res) => {
  res.send("Profile API");
});

module.exports = router;
