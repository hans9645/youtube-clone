const express = require("express");
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================

router.post("/subscribeNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length });
  });
});

router.post("/subscribeCheck", (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    let check = false;
    if (subscribe.length !== 0) {
      check = true;
    }
    return res.status(200).json({ success: true, subscribeCheck: check });
  });
});

router.post("/subscribe", (req, res) => {
  const subscriber = new Subscriber(req.body);

  subscriber.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/unsubscribe", (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, doc });
  });
});

module.exports = router;
