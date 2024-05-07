const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const nftOnChainSchema = mongoose.Schema({
    tokenId:{
        type:Number,
        required:true,
    },
    creator:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    metadata:{
        type:String,
        required:true,
    },
    blockTimeStamp:{
        type:Number
    }
},{
    timestamps:true,
});

nftOnChainSchema.plugin(toJSON);
const NftOnChain = mongoose.model('NftOnChainSchema',nftOnChainSchema);
module.exports = NftOnChain;