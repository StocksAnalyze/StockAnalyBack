const express = require("express");
const router = express.Router();

let Cals = require("../model/Cals");
let KOSDAQ = require("../model/KOSDAQ");

router.get("/company/:code", async (req, res, next) => {
  const code = req.params.code; // 클라이언트로부터 전달된 code 값
  console.log(code);

  try {
    const company = await KOSDAQ.findOne({ code: code });

    if (!company) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }

    res.json(company);
  } catch (err) {
    console.error("Error while fetching company:", err);
    next(err);
  }
});

router.get("/company", async (req, res, next) => {
  try {
    const companies = await KOSDAQ.find();
    res.json(companies);
  } catch (err) {
    console.error("Error while fetching companies:", err);
    next(err);
  }
});

router.get("/cals/:ticker", async (req, res, next) => {
  const ticker = req.params.ticker;

  try {
    // MongoDB에서 ticker 필드와 요청된 ticker 값이 일치하는 데이터를 찾습니다.
    const company = await Cals.findOne({ 티커: ticker });

    if (!company) {
      return res
        .status(404)
        .json({ message: "해당 티커에 대한 데이터를 찾을 수 없습니다." });
    }

    res.json(company);
  } catch (err) {
    console.error("회사 정보를 가져오는 동안 오류 발생:", err);
    next(err);
  }
});
module.exports = router;
