const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const disLikeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },

    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true } //생성일자와 업데이트 일자가 자동표기가 됨.
);

const DisLike = mongoose.model("DisLike", disLikeSchema);
module.exports = { DisLike };
