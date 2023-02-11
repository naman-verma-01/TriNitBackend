const mongoose = require('mongoose');
const connecttomongoose = () =>{
    mongoose.connect('mongodb+srv://Naman_Verma:OA3vct6fPNU9SNN5@clustersih2022.kyg4jf6.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    const db= mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    // we're connected!
    console.log("we are successfully connected.");
    });
}

module.exports = connecttomongoose;