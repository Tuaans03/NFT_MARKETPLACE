const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const makeOfferOnChainSchema = mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    listing_id: {
      type: Number,
      required: true,
    },
    offer_id: {
      type: Number,
      required: true,
    },
    offer_address: {
      type: String,
      required: true,
    },
    offer_amount: {
      type: Number,
      required: true,
    },
    is_accept: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

makeOfferOnChainSchema.plugin(toJSON);
const MakeOfferOnChain = mongoose.model('MakeOfferOnChain',makeOfferOnChainSchema);

module.exports = MakeOfferOnChain;