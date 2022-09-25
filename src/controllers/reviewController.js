const mongoose = require('mongoose')
const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

let isValid = mongoose.Types.ObjectId.isValid




// =====================================================  CREATE REVIEW  ================================================================//



let createReview = async function (req, res) {
    try {
      let reviewData = req.body;
      let bookId = req.params.bookId;
  


      if (!isValid(bookId))
        return res.status(400).send({ status: false, message: "Invalid book Id." })
  
  
      let { review, rating, reviewedBy, reviewedAt } = reviewData;

      reviewData.bookId = bookId
      if (!Object.keys(reviewData).length) {
        return res.status(400).send({ status: true, message: 'Bad Request, Please enter the details in the request body.' })
      }
  
      if (!review) {
        return res.status(400).send({ status: false, message: 'Review should be present.' })
      }

      if (review.length == 0) {
        return res.status(400).send({ status: false, message: 'Review field should not be empty.' })
      }
  
      if (!rating) {
        return res.status(400).send({ status: false, message: 'please provide rating' })
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).send({ status: false, message: 'Rating should be between 1 and 5 inclusively.' })
      }

      if (!reviewedAt) {
        return res.status(400).send({ status: false, message: "ReviewAt required name should not be empty." });
      }
  
     
      let bookData = await bookModel.findOne({ _id: bookId });
      if (!bookData) {
        return res.status(400).send({ status: false, message: 'Could not find the book with the given bookId' });
      }

      if (bookData.isDeleted) {
        return res.status(404).send({ status: false, message: 'This book has been deleted.' });
      }
  
      let addReviewData = await reviewModel.create(reviewData);
      let countReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).count();
      let updatedBookData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { reviews: countReviews } }, { new: true, upsert: true });
  
      let responseData = {updatedBookDocument: updatedBookData, reviewsData: addReviewData }
  
      res.status(201).send({ status: true, message: "Success", data: responseData });
    }
    catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  }



//=============================================  UPDATE REVIEW  ===========================================================================================================



const updateReview = async function (req, res) {
    try {
        let reviewId = req.params.reviewId
        let bookId = req.params.bookId

        if(!isValid(bookId)){
            return res.status(400).send({status : false, message : "BookId is not valid"})
        }
        if(!isValid(reviewId)){
            return res.status(400).send({status : false, message : "reviewId is not valid"})
        }

        let findBook = await bookModel.findOne({_id : bookId, isDeleted : false})
        if(!findBook){
            return res.status(404).send({ status : false, message : "BookId is not found"})
        }

        let findReview = await reviewModel.findOne({_id : reviewId, isDeleted : false})
        if(!findReview){
            return res.status(404).send({ status: false, message : " This review is not found"})
        }

        let data = req.body 
        let rating =data.rating
        
        let dataBody = Object.keys(data)
        if(dataBody.length == 0){
            return res.status(400).send({ status : false, message : "DataBody can not be empty"})
        }

        if(rating){
            if(rating < 1 || rating > 5){
                return res.status(400).send({ status : false, message : "Ratings can only be lied between 1 and 5"})
            }
        }
        
        let updatedReview = await reviewModel.findByIdAndUpdate({ _id: reviewId, isDeleted: false },req.body, {new : true}).select({_id : 1, bookId : 1, reviewedBy:1, reviewedAt:1, rating:1, review:1})
        let object ={
            _id: findBook._id,
                title: findBook.title,
                excerpt: findBook.excerpt,
                userId: findBook.userId,
                category: findBook.category,
                subcategory: findBook.subcategory,
                isDeleted: findBook.isDeleted,
                reviews: findBook.reviews,
                releasedAt: findBook.releasedAt,
                createdAt: findBook.createdAt,
                updatedAt: findBook.updatedAt,
                updatedReview: updatedReview
            }
            return res.status(200).send({status: true, message : "Review update is successful" , data : object})
            }catch (err) {
        return res.status(500).send({ error: err.message });
    }
}



//===============================================  DELETE REVIEW  ========================================================================
    


 const deleteBookReview = async function (req, res) {

        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
      
        if (!mongoose.isValidObjectId(bookId))
          return res.status(400).send({ status: false, message: "Invalid book id." })
      
        if (!mongoose.isValidObjectId(reviewId))
          return res.status(400).send({ status: false, message: "Invalid review id." })
      
        let checkBook = await bookModel.findOne({ _id: bookId });
        if (!checkBook) {
          return res.status(404).send({ status: true, message: 'The book does not exists with the given bookId.' });
        }

        let checkReview = await reviewModel.findOne({ _id: reviewId });
        if (!checkReview) {
          return res.status(404).send({ status: false, message: 'The review does not exist with the given reviewId.' });
        }
        
        if (checkBook.isDeleted == true || checkReview.isDeleted == true) {
          return res.status(404).send({ status: false, message: "can not delete review of deleted Book " })
        }
      
      
        let deletedReviewData = await reviewModel.findOneAndUpdate({ _id: reviewId }, {
          $set: { isDeleted: true }
        }, { new: true, upsert: true })
        let countReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).count();
        let updatedBookData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { reviews: countReviews } }, { new: true, upsert: true });
      
        return res.status(200).send({
          status: true, message: 'Success', Data: {
            UpdatedBookData: updatedBookData,
            deletedReviewData: deletedReviewData

          }
        })
      }

module.exports = { createReview , updateReview, deleteBookReview}