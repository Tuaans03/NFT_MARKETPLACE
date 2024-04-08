const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const orderOnChainSchema = mongoose.Schema({
    tokenId:{
        type:Number,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    seller:{
        type:String,
        required:true,
    },
    listing_id:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    is_sold:{
        type:Boolean,
        required:true
    },
    blockTimeStamp:{
        type:Number
    }
},{
    timestamps:true
});

orderOnChainSchema.plugin(toJSON);
const OrderOnChain = mongoose.model('OrderOnChain',orderOnChainSchema);
module.exports = OrderOnChain;