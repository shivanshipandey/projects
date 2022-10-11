const express =require('express');
const mongoose=require('mongoose');
const route = require('./routes/route');
const multer=require("multer")
const app=express();

app.use(express.json());
app.use(multer().any())

let url="mongodb+srv://project5productsManagementGroup-42:myGnQEOp010y0N42@cluster0.rf4tgvq.mongodb.net/group-42";

let port=process.env.PORT||3000;

mongoose.connect(url, {useNewUrlParser:true})
.then(()=>"MongoDB is connected")
.catch(err=>console.log(err))


app.use('/', route);

app.listen(port, ()=>{
    console.log("express app running on port "+port);
})
