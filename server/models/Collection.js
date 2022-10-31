const mongoose = require("mongoose");
const { assetSchema } = require("./Asset");
const { collectionInfoSchema } = require("./CollectionInfo");
const { Schema } = mongoose;

const collectionSchema = new Schema({
  id: Schema.ObjectId,
  collectionInfo: collectionInfoSchema,
  assets: [assetSchema],
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = {
  Collection,
};
