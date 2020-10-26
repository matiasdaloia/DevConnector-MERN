const express = require("express");
const router = express.Router();

// @route GET api/users
// @route Test Route
// @route Public access

router.get("/", (req, res) => {
  res.send("Users API");
});

module.exports = router;
