const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const auctionOnChainSchema = mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    aiction_id: {
      type: Number,
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Data,
      required: true,
    },
    starting_price: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
    is_ended: {
      type: Boolean,
      required: true,
    },
    winner_address: {
      type: String,
      default: "0",
    },
    winner_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

auctionOnChainSchema.plugin(toJSON);
const AustionOnChain = mongoose.model("AuctionOnChain", auctionOnChainSchema);
module.exports = AustionOnChain;
