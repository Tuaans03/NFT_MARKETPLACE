const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const buyOnchainSchema = mongoose.Schema(
  {
    nftOnchain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NftOnChain',
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
    buyer: {
      type: String,
      required: true,
    },
    buyAmount: {
      type: BigInt,
      required: true,
    },
    buyPrice: {
      type: BigInt,
      required: true,
    },
    buyType: {
      type: String,
      enum: ['direct', 'offer', 'bid'],
      required: true,
    },
    blockTimeStamp: {
      type: BigInt,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

buyOnchainSchema.plugin(toJSON);

const buyOnchain = mongoose.model('buyOnchain', buyOnchainSchema);

module.exports = buyOnchain;
