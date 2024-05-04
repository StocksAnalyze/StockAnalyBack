const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_HOST1;
const MOBILE_URI = process.env.MONGO_HOST2;
const MONGO_URI3 = process.env.MONGO_HOST3;

const connectDBs = () => {
  try {
    const kosdaq = mongoose.createConnection(MONGO_URI, {
      retryWrites: true,
      w: "majority",
    });
    const cals = mongoose.createConnection(MOBILE_URI, {
      retryWrites: true,
      w: "majority",
    });
    const probs = mongoose.createConnection(MONGO_URI3, {
      retryWrites: true,
      w: "majority",
    });

    return { kosdaq, cals, probs };
  } catch (error) {
    console.error(`Error:${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDBs };
