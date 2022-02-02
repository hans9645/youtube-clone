const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } //생성일자와 업데이트 일자가 자동표기가 됨.
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
module.exports = { Subscriber };
