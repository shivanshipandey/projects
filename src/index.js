const express = require('express')
const route = require('./route/route')
const mongoose = require('mongoose')
const app = express()


app.use(express.json());

mongoose.connect(
    'mongodb+srv://agDuke:aakash1234@cluster0.oyazcaq.mongodb.net/group-34-Database?retryWrites=true&w=majority'
,{useNewUrlParser: true})

.then(()=> console.log('MongoDB is connected'))
.catch((err)=> console.log(err))

app.use('/', route)


app.listen( process.env.PORT || 3000 , ()=>{
    console.log ('express is runnig on PORT ' + (process.env.PORT || 3000))
})