const mongoose = require('mongoose');
const connecttomongoose = () =>{
    mongoose.connect('mongodb+srv://naman:triNIThack@cluster0.mhi77gs.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    const db= mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    // we're connected!
    console.log("we are successfully connected.");
    });
}

module.exports = connecttomongoose;