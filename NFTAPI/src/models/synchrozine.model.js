const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const sychronizeSchema = mongoose.Schema({
    from_block:{
        type:Number,
        required:true
    },
    to_block:{
        type:Number,
        required:true
    }
},{
    timestamps:true,
});

sychronizeSchema.plugin(toJSON);
const Sychronize = mongoose.model("Sychronize",sychronizeSchema);
module.exports = Sychronize;