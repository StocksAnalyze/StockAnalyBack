const express = require("express");
const router = express.Router();
const _ = require("lodash"); // lodash를 불러옵니다.

let Cals = require("../model/Cals");
let KOSDAQ = require("../model/KOSDAQ");
let KOSPI = require("../model/KOSPI");
let Probs = require("../model/Probs");
let Info = require("../model/Info");

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

router.get("/kosdaq/company", async (req, res, next) => {
  try {
    const companies = await KOSDAQ.find();
    // 각 문서에서 'company' 속성만 추출하여 새 배열 생성
    const companyNames = companies.map((company) => company.company);
    res.json(companyNames);
  } catch (err) {
    console.error("Error while fetching companies:", err);
    next(err);
  }
});

router.get("/kospi/company", async (req, res, next) => {
  try {
    const companies = await KOSPI.find();
    // 각 문서에서 'company' 속성만 추출하여 새 배열 생성
    const companyNames = companies.map((company) => company.company);
    res.json(companyNames);
  } catch (err) {
    console.error("Error while fetching companies:", err);
    next(err);
  }
});

router.get("/allcompany", async (req, res, next) => {
  try {
    // KOSDAQ과 KOSPI에서 회사 목록을 동시에 조회
    const [kosdaqCompanies, kospiCompanies] = await Promise.all([
      KOSDAQ.find(),
      KOSPI.find(),
    ]);

    // 각 문서에서 'company' 속성만 추출하여 새 배열 생성
    const kosdaqCompanyNames = kosdaqCompanies.map(
      (company) => company.company
    );
    const kospiCompanyNames = kospiCompanies.map((company) => company.company);

    // 두 시장의 회사 목록을 합침
    const allCompanyNames = kosdaqCompanyNames.concat(kospiCompanyNames);

    res.json(allCompanyNames);
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

router.get("/info/:company", async (req, res, next) => {
  const company = req.params.company;

  try {
    // MongoDB에서 ticker 필드와 요청된 ticker 값이 일치하는 데이터를 찾습니다.
    const info = await Info.findOne({ 회사명: company });

    if (!info) {
      return res
        .status(404)
        .json({ message: "해당 티커에 대한 데이터를 찾을 수 없습니다." });
    }

    // 배열의 길이를 구합니다
    let arrayLength = info.data.length;

    // 배열의 마지막 30개 요소를 잘라냅니다
    let last30DaysElements = info.data.slice(arrayLength - 30);

    res.json({
      data: last30DaysElements,
    });
  } catch (err) {
    console.error("회사 정보를 가져오는 동안 오류 발생:", err);
    next(err);
  }
});

// router.get("/probs", async (req, res, next) => {
//   try {
//     const probs = await Probs.find({});
//     if (!probs) {
//       return res.status(404).json({ message: "데이터가 없습니다." });
//     }

//     res.json({
//       회사명: probs.회사명,
//     });
//   } catch (err) {
//     console.error("회사 정보를 가져오는 동안 오류 발생:", err);
//     next(err);
//   }
// });

router.get("/probs/:company", async (req, res, next) => {
  const company = req.params.company;

  try {
    // MongoDB에서 ticker 필드와 요청된 ticker 값이 일치하는 데이터를 찾습니다.
    const prob = await Probs.findOne({ 회사명: company });

    if (!prob) {
      return res
        .status(404)
        .json({ message: "해당 티커에 대한 데이터를 찾을 수 없습니다." });
    }

    // Probs의 data 중 제일 최신 데이터들의 필드 값을 배열로 저장.
    // key - value 형식으로 저장. -> 리액트 렌더링 시 키 값도 사용하기 위해서.
    // mongoDB로 부터 전달 받은 data[].object의 필드 값을 정렬하려고 하니, Object에 mongoose 메타데이터들이 사라지지 않아
    // 하드코딩으로 구성.
    // delete prob.data[prob.data.length-1].날짜 이런 형식으로 필요없는 필드 값을 제거하려고 하는데, 제거 되지 않음.
    // prob.data[prob.data.length -1]로 최근 객체를 꺼내서 내림차순 정렬을 하려고 해도, 메타데이터가 생기며 정렬도 이뤄지지 않음.
    // 심지어, console.log(typeof prob.data[prob.data.length - 1]) => object가 출력
    // 그런데도, js object 메서드로 가공을 하려고 해도 메타데이터로 인해 되지가 않음.
    // mongoDB에서 꺼내온 객체에 대한 공부가 필요함
    // 우선은 구현을 위해, 우리가 지정한 주가 필드들을 하나씩 key 값을 하드 코딩하여 value로 꺼내온 후, 배열에 저장하는 방식을 선택.
    // 나중에 mongoDB로 부터 불러오는 객체의 형식에 대한 공부를 하고 리팩토링 진행해봐야 할 듯.
    let arr = [
      {
        "60 days MA Trend":
          prob.data[prob.data.length - 1]["60 days MA Trend"] * 100,
      },
      {
        "Base and Conversion Narrow Status":
          prob.data[prob.data.length - 1]["Base and Conversion Narrow Status"] *
          100,
      },
      {
        "Base and Conversion Narrow Status (for Lagging)":
          prob.data[prob.data.length - 1][
            "Base and Conversion Narrow Status (for Lagging)"
          ] * 100,
      },
      { "MACD Status": prob.data[prob.data.length - 1]["MACD Status"] * 100 },
      {
        "Lagging Span x Base and conversion":
          prob.data[prob.data.length - 1][
            "Lagging Span x Base and conversion"
          ] * 100,
      },
      {
        "Lagging Span x Bong":
          prob.data[prob.data.length - 1]["Lagging Span x Bong"] * 100,
      },
      {
        "Leading Span Tail Direction":
          prob.data[prob.data.length - 1]["Leading Span Tail Direction"] * 100,
      },
      {
        "Bong and Cloud Status":
          prob.data[prob.data.length - 1]["Bong and Cloud Status"] * 100,
      },
      {
        "Conversion x Base line":
          prob.data[prob.data.length - 1]["Conversion x Base line"] * 100,
      },
      {
        "Bong x Base and Conversion":
          prob.data[prob.data.length - 1]["Bong x Base and Conversion"] * 100,
      },
      {
        "5day cross MA Check":
          prob.data[prob.data.length - 1]["5day cross MA Check"] * 100,
      },
      {
        "10day cross MA Check":
          prob.data[prob.data.length - 1]["10day cross MA Check"] * 100,
      },
      {
        "20day cross MA Check":
          prob.data[prob.data.length - 1]["20day cross MA Check"] * 100,
      },
      {
        "60day cross MA Check":
          prob.data[prob.data.length - 1]["60day cross MA Check"] * 100,
      },
      {
        "120day cross MA Check":
          prob.data[prob.data.length - 1]["120day cross MA Check"] * 100,
      },
      {
        "9day Highest Price Trend":
          prob.data[prob.data.length - 1]["9day Highest Price Trend"] * 100,
      },
      {
        "26day Highest Price Trend":
          prob.data[prob.data.length - 1]["26day Highest Price Trend"] * 100,
      },
    ];

    // value 값으로 배열 정렬
    arr.sort((obj1, obj2) => {
      // 각 객체의 값을 추출합니다. Object.values()는 객체의 모든 값을 배열로 반환합니다.
      // 여기서는 각 객체에 하나의 키-값 쌍만 있다고 가정하므로, 첫 번째 원소(0번 인덱스)를 사용합니다.
      let value1 = Object.values(obj1)[0];
      let value2 = Object.values(obj2)[0];

      // 내림차순 정렬을 위해 value2에서 value1을 뺍니다.
      return value2 - value1;
    });

    res.json({
      data: arr,
    });
  } catch (err) {
    console.error("회사 정보를 가져오는 동안 오류 발생:", err);
    next(err);
  }
});

module.exports = router;
