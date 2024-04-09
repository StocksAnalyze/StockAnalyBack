const mongoose = require("mongoose");
const { connectDBs } = require("./db");
const { kosdaq } = connectDBs();

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

const KOSDAQ = kosdaq.model("KOSDAQ", kosdaqSchema, "KOSDAQ");
module.exports = KOSDAQ;
