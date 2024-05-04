const mongoose = require("mongoose");
const { connectDBs } = require("./db");
const { probs } = connectDBs();

const probsSchema = new mongoose.Schema({
  회사명: {
    type: String,
  },
  티커: {
    type: String,
  },
  data: [
    {
      날짜: { type: Date, required: true },
      "60 days MA Trend": { type: Number, required: true },
      "Base and Conversion Narrow Status": { type: Number, required: true },
      "Base and Conversion Narrow Status (for Lagging)": {
        type: Number,
        required: true,
      },
      "MACD Status": { type: Number, required: true },
      "Lagging Span x Base and conversion": { type: Number, required: true },
      "Lagging Span x Bong": { type: Number, required: true },
      "Leading Span Tail Direction": { type: Number, required: true },
      "Bong and Cloud Status": { type: Number, required: true },
      "Conversion x Base line": { type: Number, required: true },
      "Bong x Base and Conversion": { type: Number, required: true },
      "5day cross MA Check": { type: Number, required: true },
      "10day cross MA Check": { type: Number, required: true },
      "20day cross MA Check": { type: Number, required: true },
      "60day cross MA Check": { type: Number, required: true },
      "120day cross MA Check": { type: Number, required: true },
      "9day Highest Price Trend": { type: Number, required: true },
      "26day Highest Price Trend": { type: Number, required: true },
    },
  ],
});

//모델 생성
const Probs = probs.model("Probs", probsSchema, "Probs");
module.exports = Probs;
