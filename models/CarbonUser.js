const mongoose = require('mongoose');
const {Schema} = mongoose;

const carbonUserschema = new Schema({
    userid:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    overAllEmission:{
        type:Number,
    },
   date:{
        type:Date,
        default:Date.now
    }
})

const CarbonUser = mongoose.model('CarbonUser',carbonUserschema);
module.exports = CarbonUser;
