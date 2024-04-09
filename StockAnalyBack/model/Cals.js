const mongoose = require("mongoose");
const { connectDBs } = require("./db");
const { cals } = connectDBs();

const calsSchema = new mongoose.Schema({
  회사명: {
    type: String,
  },
  티커: {
    type: String,
  },
  data: [
    {
      index: {
        type: String,
      },
      날짜: {
        type: Date,
      },
      SMA5: {
        type: String,
      },
      SMA10: {
        type: String,
      },
      SMA20: {
        type: String,
      },
      SMA60: {
        type: String,
      },
      SMA120: {
        type: String,
      },
      MACD: {
        type: String,
      },
      MACD_Signal: {
        type: String,
      },
      MACD_Histogram: {
        type: String,
      },
      "conversion line": {
        type: String,
      },
      "base line": {
        type: String,
      },
      "Leading Span A": {
        type: String,
      },
      "Leading Span B": {
        type: String,
      },
      "Lagging Span": {
        type: String,
      },
      "Future Leading Span A": {
        type: String,
      },
      "Future Leading Span B": {
        type: String,
      },
      "9th Highest Price": {
        type: String,
      },
      "26th Highest Price": {
        type: String,
      },
    },
  ],
});

//모델 생성
const Cals = cals.model("Cals", calsSchema, "Cals");
module.exports = Cals;
