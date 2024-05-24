const mongoose = require("mongoose");
const { connectDBs } = require("./db");
const { cals } = connectDBs();

const infoSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  회사명: {
    type: String,
  },
  티커: {
    type: String,
  },
  data: [
    {
      날짜: { type: Date, required: true },
      고가: { type: Number, required: true },
      저가: { type: Number, required: true },
      종가: { type: Number, required: true },
      거래량: { type: Number, required: true },
      등락률: { type: Number, required: true },
    },
  ],
});

//모델 생성
const Info = cals.model("Info", infoSchema, "Info");
module.exports = Info;
