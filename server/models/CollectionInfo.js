const mongoose = require("mongoose");
const { Schema } = mongoose;

const collectionInfoSchema = new Schema({
  name: String,
  symbol: String,
  address: String,
  collectionType: Number,
  chainId: Number,
  image: String,
});

const CollectionInfo = mongoose.model("CollectionInfo", collectionInfoSchema);

module.exports = {
  CollectionInfo,
  collectionInfoSchema,
};
