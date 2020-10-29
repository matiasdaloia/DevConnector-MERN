const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      res
        .status(400)
        .json({ message: "There is no profile available for this user." });
    }

    // If profile exists, then send it as json
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route     Post api/profile
// @desc      update profile data
// @access    Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object

    const profileFields = {};

    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      // Create an array for skills
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object :

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // Insert the data into the DB:

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // If there is a profile for that user --> update it with fields if added any
      if (profile) {
        //update profile

        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // If profile does not exists, create profile
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Errors");
    }
  }
);

// @route     GET api/profile
// @desc      get all profiles
// @access    public

router.get("/", async (req, res) => {
  try {
    // get profiles from db
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route     GET api/profile/user/:user_id
// @desc      get profile by user id
// @access    public

router.get("/user/:user_id", async (req, res) => {
  try {
    // get profile from db
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    // check if profile does not exists
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);

    // check if profile does not exists also send another error message
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/profile
// @desc      delete profile, user and posts
// @access    private

router.delete("/", auth, async (req, res) => {
  try {
    // delete profile with users id
    await Profile.findOneAndRemove({ user: req.user.id });
    // delete user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User removed." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
