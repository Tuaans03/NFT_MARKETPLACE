const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const transactionSchema = mongoose.Schema({
    transaction_hash:{
        type:String,
        required:true,
    },
    block_hash:{
        type:String,
        required:true,
    },
    block_number:{
        type:Number,
        required:true,
    },
    event_name:{
        type:String,
        required:true,
    },
    sender:{
        type:String,
        required:true,
    },
    receiver:{
        type:String,
        required:true,
    },
    synchronize:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Sychronize'
    },
},{
    timestamps:true,
});

transactionSchema.plugin(toJSON);
const Transaction = mongoose.model('Transaction',transactionSchema);
module.exports = Transaction;