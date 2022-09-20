const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')

const createBook = async function(req, res){
    try{
    let data = req.body
    let bookData = await bookModel.create(data)
     return res.status(201).send({status : true, mssg : bookData})
    }catch (error){
        res.status(500).send({status : false, mssg : error.message})
    }
}

module.exports={createBook}