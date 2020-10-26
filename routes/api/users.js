const express = require("express");
const gravatar = require("gravatar");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

// @route POST api/users
// @desc Test Route
// @access Public

router.post(
  "/",

  [
    //Express Validator :
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password of 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.body); // in order to allow req.body we need to include bodyparser in server.js

    const errors = validationResult(req);
    //Check if there is any error then send a 400 status response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Query for the user in MongoDB:
      let user = await User.findOne({ email: email });
      //See if the user exists :
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      //If user does not exists --> create new User in MongoDB :
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt the password using bcrypt
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
