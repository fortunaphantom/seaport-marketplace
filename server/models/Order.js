const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  id: Schema.ObjectId,
  parameters: {
    offerer: String,
    zone: String,
    offer: [
      {
        itemType: Number,
        token: String,
        identifierOrCriteria: String,
        startAmount: String,
        endAmount: String,
      },
    ],
    consideration: [
      {
        itemType: Number,
        token: String,
        identifierOrCriteria: String,
        startAmount: String,
        endAmount: String,
        recipient: String,
      },
    ],
    orderType: Number,
    startTime: String,
    endTime: String,
    zoneHash: String,
    salt: String,
    conduitKey: String,
    totalOriginalConsiderationItems: String,
  },
  signature: String,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = {
  Order,
};
