const express = require("express");
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//            Comment
//=================================

//댓글 저장 후 다시 프론트단으로 보내줘서 띄워야한다. 그걸 실행함.
router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.json({ suceess: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComments", (req, res) => {
  Comment.find({ videoId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

router.post("/deleteComment", (req, res) => {
  Comment.findOneAndUpdate(
    { _id: req.body.commentId },
    { $set: { delete: 1 } }
  ).exec((err, docs) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, docs });
  });

  //   Comment.deleteOne({ _id: req.body.commentId }).exec((err, docs) => {
  //     if (err) return res.status(400).send(err);
  //     res.status(200).json({ success: true, docs });
  //   });
});

module.exports = router;
