const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
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
      counter: Number
    },
    signature: String,
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.parameters._id;
        for (let i = 0; i < ret.parameters.offer.length; i++) {
          delete ret.parameters.offer[i]._id;
        }
        for (let i = 0; i < ret.parameters.consideration.length; i++) {
          delete ret.parameters.consideration[i]._id;
        }
      },
    },
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = {
  Order,
};
