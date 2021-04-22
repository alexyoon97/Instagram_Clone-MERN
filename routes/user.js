const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { route, post } = require("./auth");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password") // dont select password to frontend
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: err });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  //add follower to who got followed
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      //add follwing to user
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  //delete follower who followed
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      //delete follwing user
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/userprofilepic", requireLogin, (req, res) => {
  User.find({ _id: req.user._id })
    .updateOne({ userProfilePic: req.body.pic })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
  //orUser.findByIdAndupdate...
  //{$set:{userProfilePic : req.body.pic}}
});

router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } }) //find email mathes email with regex
    .select("-password")
    .then((user) => {
      console.log(user)
      res.json({ user });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
