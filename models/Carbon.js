const mongoose = require('mongoose');
const {Schema} = mongoose;
const carbonemissionschema = new Schema({
    userid:{
        type:String,
        required:true
    },
    webpage:{
        type:String,
        required:true,
    },
    datatransferredingb:{
        type:String,
        required:true,
    },
    totaldata:{
         type:String,
         required:true
    },
    carbonemission:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
    },
    count:{
        type:String,
        required:true,
    },

   date:{
        type:Date,
        default:Date.now
    }
})

const Carbon = mongoose.model('Carbon',carbonemissionschema);
module.exports = Carbon;
