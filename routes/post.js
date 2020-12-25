const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { route, post } = require("./auth");
const Post = mongoose.model("Post");

router.get("/allpost", (req, res) => {
  //find() will finds all fields
  Post.find()
    .populate("postedBy", "_id name") // expand postedBy table and select only id and name
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getfollowpost",requireLogin, (req, res) => {
  //find() will finds all fields
  Post.find({postedBy:{$in:req.user.following}})//find a postedBy in fowlling
    .populate("postedBy", "_id name") // expand postedBy table and select only id and name
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  //do not store password inside post table
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id }, //add
    },
    {
      new: true, //new update
    }
  )
    .populate("comments.postedBy", "_id name") //expand postedBy object otherwise we cant see data inside
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id }, //remove
    },
    {
      new: true, //new update
    }
  )
    .populate("comments.postedBy", "_id name") //expand postedBy object otherwise we cant see data inside
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment }, //insert
    },
    {
      new: true, //new update
    }
  )
    .populate("comments.postedBy", "_id name") //expand postedBy object otherwise we cant see data inside
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletecomment/:commentId/:postId", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    { $pull: { comments: { _id: req.params.commentId } } },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name") //expand postedBy object otherwise we cant see data inside
    .populate("comments", "_id")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        //this is an object so convert to a string
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
