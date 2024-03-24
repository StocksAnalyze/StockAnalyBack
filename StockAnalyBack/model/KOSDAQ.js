const mongoose = require("mongoose");

const kosdaqSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  company: {
    type: String,
  },
  code: {
    type: String,
  },
});

const KOSDAQ = mongoose.model("KOSDAQ", kosdaqSchema, "KOSDAQ");
module.exports = KOSDAQ;
