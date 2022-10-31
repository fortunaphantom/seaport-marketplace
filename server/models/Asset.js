const mongoose = require("mongoose");
const { Schema } = mongoose;

const assetSchema = new Schema({
  tokenId: String,
  image: String,
  metadata: String,
  name: String,
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = {
  Asset,
  assetSchema,
};
