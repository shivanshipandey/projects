const mongoose = require('mongoose')
const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

let isValid = mongoose.Types.ObjectId.isValid


const createReview = async function(req, res){
    try{

        let book = req.params.bookId

        if(!isValid(book)){
            return res.status(400).send({status : false, mssg : "BookId is not valid"})
        }

        let data = req.body
        let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted} = data

        let dataBody = Object.keys(data)
        if(dataBody.length == 0){
            return res.status(400).send({ status : false, mssg : "DataBody can not be empty"})
        }

        if(!bookId){
            return res.status(400).send({ status : false, mssg : "bookId is mandatory"})
        }

        if(!reviewedBy){
            return res.status(400).send({ status : false, mssg : "Plz specify who has reviewed"})
        }

        if(!rating){
            return res.status(400).send({ status : false, mssg : "Ratings is mandatory"})
        }

        if(rating < 1 || rating > 5){
            return res.status(400).send({ status : false, mssg : "Ratings can only be lied between 1 and 5"})
        }

        if (review) {
            if (typeof (review) != "string") {
                 return res.status(400).send({ status: false, message: "review should be in Strings only" })
            }
          }
        
        if(isDeleted) {
            if (typeof (isDeleted) != "boolean") {
                 return res.status(400).send({ status: false, message: "isDeleted can be true or false only" })
            }
        }

        let bookCheck = await bookModel.findOne({_id: bookId, isDeleted : false})
        if(!bookCheck){
            return res.status(404).send({ status : false, mssg : "No such book found"})
        }

        data.reviewedAt = new Date()

        let reviewData = await reviewModel.create(data)
        let selectReview = await reviewModel.findById(reviewData._id).select({_id:1, bookId : 1, reviewBy : 1, reviewAt: 1, rating: 1, review: 1})

        if(selectReview){
            updateBook = await bookModel.findOneAndUpdate({_id : reviewData.bookId, isDeleted : false}, {$inc: { reviews : 1}},{new: true})
        }
        return res.status(400).send({ status : false , mssg : "success", data : reviewData})
    }catch(error){
        return res.status(500).send({ status : false, mssg : error.message})
    }
}

module.exports = { createReview}