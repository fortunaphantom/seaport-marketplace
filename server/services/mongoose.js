const mongoose = require("mongoose");
const { Collection, Order } = require("../models");

async function connectMongo(url) {
  try {
    await mongoose.connect(url);
    console.log("connected mongodb");
  } catch (ex) {
    console.error("Error in connecting mongodb");
    console.error(ex);
  }
}

module.exports = {
  connectMongo,
};
