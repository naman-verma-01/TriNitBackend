require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 3000;
const app = express();

const {json} = require('body-parser')
var cors = require('cors');
app.use(json());
app.use(cors())



const start = async () => {

    app.listen(port || port, async () => {
        console.log(`Server Connected To Port: ${port}`)
        
    });

};

start();