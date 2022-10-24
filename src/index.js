const mongoose = require('mongoose')
const express = require('express')
const route = require('./route/route')
const bodyParser = require('body-parser')
const app = express()

const multer= require("multer");
const { AppConfig } = require('aws-sdk');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())


mongoose.connect('mongodb+srv://payal-chaudhary:BDoIPGJ3FjU4qpys@cluster0.jjm7nst.mongodb.net/Group35-Database',
{useNewUrlParser : true})

.then(() => console.log('MongoDb is connected'))
.catch(() => console.log(err))

app.use(route)

app.listen(process.env.PORT || 3000, function(){
    console.log("Express app is running on PORT" + (process.env.PORT || 3000) )
})

