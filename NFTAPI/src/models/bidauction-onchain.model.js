const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const bidAuctionOnChainSchema = mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    auction_id: {
      type: Number,
      required: true,
    },
    bid_auction_id: {
      type: Number,
      required: true,
    },
    bidder: {
      type: String,
      required: true,
    },
    bid_amount: {
      type: String,
      required: true,
    },
    is_claimed: {
      type: Boolean,
      default: false,
    },
    is_winned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

bidAuctionOnChainSchema(toJSON);
const BidAuctionOnChain = mongoose.model(
  "BidAuctionOnChain",
  bidAuctionOnChainSchema
);
module.exports = BidAuctionOnChain;
