const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

// @route GET api/auth
// @route Test Route
// @route Public access

router.get("/", auth, async (req, res) => {
  try {
    // Get the user data from database using JWT:
    const user = await User.findById(req.user.id).select("-password");

    // Send user data in json
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/auth
// @desc Login and get token back
// @access Public

router.post(
  "/",

  [
    //Express Validator :

    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password does not exists").exists(),
  ],
  async (req, res) => {
    console.log(req.body); // in order to allow req.body we need to include bodyparser in server.js

    const errors = validationResult(req);
    //Check if there is any error then send a 400 status response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Query for the user in MongoDB:
      let user = await User.findOne({ email });
      // See if the user exists :
      if (!user) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Check if password Matches
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Return JWT (json web token)
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
