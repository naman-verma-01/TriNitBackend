require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 3000;
const app = express();
const connecttomongoose = require('./db');
const {json} = require('body-parser')
const carbonemission = require('./router/carbonemission')
const userController = require('./router/userController')
var cors = require('cors');
app.use(express.json());
app.use(cors())
app.use(express.urlencoded());

connecttomongoose();
app.get('/',(req,res)=>{
    res.send('good morning!');
})
app.use('/api/carbonemission',carbonemission);
app.use('/api/user',userController);
// app.use('/api/note',usernotes);
// app.use('/api/message',messages);

const start = async () => {

    app.listen(port || port, async () => {
        console.log(`Server Connected To Port: ${port}`)
        
    });

};

start();