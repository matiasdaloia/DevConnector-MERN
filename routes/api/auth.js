const express = require("express");
const router = express.Router();

// @route GET api/auth
// @route Test Route
// @route Public access

router.get("/", (req, res) => {
  res.send("auth API");
});

module.exports = router;
