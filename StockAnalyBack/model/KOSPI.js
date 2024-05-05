const mongoose = require("mongoose");
const { connectDBs } = require("./db");
const { kosdaq } = connectDBs();

const kospiSchema = new mongoose.Schema({
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

const KOSPI = kosdaq.model("KOSPI", kospiSchema, "KOSPI");
module.exports = KOSPI;
