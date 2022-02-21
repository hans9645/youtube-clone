const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const multer = require("multer");
//const { auth } = require("../middleware/auth");
const ffmpeg = require("fluent-ffmpeg");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // mime type 체크하여 원하는 타입만 필터링

  if (
    file.mimetype == "video/mp4" ||
    file.mimetype == "video/quicktime" ||
    file.mimetype == "video/x-msvideo"
  ) {
    cb(null, true);
  } else {
    cb({ msg: "mp4 파일만 업로드 가능합니다." }, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  //클라이언트에서 받은 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, VideoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, VideoDetail });
    });
});

router.post("/thumbnail", (req, res) => {
  //썸네일 생성하고 비디오 러닝타임같은 듀레이션도 가져오기.
  let filePath = "";
  let fileDuration = "";

  //비디오 정보 가져오기.
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  //썸네일 생성
  ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
      console.log("Will generate" + filenames.join(", "));
      console.log(filenames);

      filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration, //사실 이부분은 ffmpeg로는 할 수 없다. ffmpeg.fforbe()를 사용해야함.
      });
    })
    .on("error", function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      //will take screenshots at 20%,40%,60%,80% of the video
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      //'%b' : input basename (filename w/o extension)
      filename: "thumbnail-%b.png",
    });
});

router.post("/uploadVideo", (req, res) => {
  //비디오 정보들을 데이터베이스에 저장함.

  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) {
      return res.json({ success: false, err });
    }
    res.status(200).json({ success: true });
  }); //mongoDB 메소드로 저장시킴.
});

router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 보낸다.
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/getSubscriptVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 보낸다.

  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscribeInfo) => {
      let subscriptedUser = [];
      if (err) return res.status(400).send(err);
      subscribeInfo.map((subscriber, index) => {
        subscriptedUser.push(subscriber.userTo);
      });

      Video.find({ writer: { $in: subscriptedUser } })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

module.exports = router;
