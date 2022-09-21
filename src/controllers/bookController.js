const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require("../models/reviewModel")


let isValid = mongoose.Types.ObjectId.isValid


const createBook = async function(req, res){
    try{
    let data = req.body
    let {title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt} = data


    let dataBody = Object.keys(data)
    if(dataBody.length == 0){
        return res.status(400).send({ status : false, mssg : "DataBody can not be empty"})
    }

    if(!title){
        return res.status(400).send({ status : false, mssg : "Title is mandatory"})
    }

    let titleCheck = await bookModel.findOne({title})
    if(titleCheck){
        return res.status(400).send({ status : false, mssg : "This title already exists"})
    }

    if(!excerpt){
        return res.status(400).send({ status : false, mssg : "Excerpt is mandatory"})
    }

    if(!userId){
        return res.status(400).send({ status : false, mssg : "userId is mandatory"})
    }

    if(!isValid(userId)){
        return res.status(400).send({ status : false, mssg : "Not a valid userId"})
    }

    if(!ISBN){
        return res.status(400).send({ status : false, mssg : "ISBN is mandatory"})
    }

    if(ISBN.length < 13 || ISBN.length > 13){
        return res.status(400).send({ status : false, mssg : "Length of ISBN number is incorrect"})
    }

    let isbnCheck = await bookModel.findOne({ISBN})
    if(isbnCheck){
        return res.status(400).send({ status : false, mssg : "This ISBN Number is already registerd"})
    }

    if(!category){
        return res.status(400).send({ status : false, mssg : "Category is mandatory"})
    }

    let categoryCheck = await bookModel.findOne({category})
    if(categoryCheck){
        return res.status(400).send({ status : false, mssg : "This category is already registered"})
    }

    if(!subcategory){
        return res.status(400).send({ status : false, mssg : "Subcategory is mandatory"})
    }

    if(reviews){
    if (typeof (reviews) != Number) {
        return res.status(400).send({ status: false, message: "Give reviews only in a Number." })
   }
}

   if (isDeleted) {
    if (typeof (isDeleted) != "boolean") {
         return res.status(400).send({ status: false, message: "isDeleted can be true or false only" })
    }
  }

  if(!releasedAt){
    return res.status(400).send({ status : false, mssg : "releasedAt is mandatory"})
  }

    let bookData = await bookModel.create(data)
     return res.status(201).send({status : true, mssg : "success", data : bookData})

    }catch (error){
        res.status(500).send({status : false, mssg : error.message})
    }
}






/////GET BOOKS Query param////

const getBookByQuery= async function(req,res){
    try{
        let data = req.query
        let size = Object.entries(data).length
        if(size<1){
            return res.status(400).send({status:false, message:"Query param not given"})
        }
        const getBook= await bookModel.find({isDeleted:false,data}).select({_id:1, title:1, excerpt:1, 
            userId:1, category:1,  releasedAt:1, reviews:1}).sort({title:1})
        
    if(getBook.length==0){
        return res.status(404).send({status:false, message: "No Book found"})
    }
    //const bookSorted = getBook.sort((a,b)=> (a.title).localeCompare(b.title))
    res.status(200).send({status:true, message: "BookList", data: getBook})///array or object

    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

//=================================GET BLOGS BY PATH PARAMS=======================

const getBookByParam = async function(req,res){
    try{
        let bookId = req.params.bookId;
        if(!bookId){
            return res.status(400).send({status:false, message:"Please provide bookId"})
        }

        let getAllBook= await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!getAllBook){
            return res.status(404).send({status:false, message:"No book found"})

        }
        let findReview = await reviewModel.find({bookId:bookId, isDeleted:false})
        let object ={
        _id: getAllBook._id,
            title: getAllBook.title,
            excerpt: getAllBook.excerpt,
            userId: getAllBook.userId,
            category: getAllBook.category,
            subcategory: getAllBook.subcategory,
            isDeleted: getAllBook.isDeleted,
            reviews: getAllBook.reviews,
            releasedAt: getAllBook.releasedAt,
            createdAt: getAllBook.createdAt,
            updatedAt: getAllBook.updatedAt,
            reviewsData: findReview
        }
        return res.status(200).send({status:true, message: "Book Lists with Reviews", data:{getAllBook, object}})
        ///isDeleted==False
    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    
    }
}

//=======================================UPDATE================

const updateBooks = async function (req, res) {
    try {
        let data = req.body
        let id = req.params.bookId
        let ISBN = data.ISBN

        //update body empty or not
        if (!data) {
            return res.status(400).send({ status: false, message: "request body can't be empty" })
        }

        //check book available or not
        let book = await bookModel.findOne({ _id: id, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "This book is not available or already deleted" })
        }

        //correct details to update or not
        if (!(data.title || data.ISBN || data.excerpt || data.releaseDate)) {
            return res.status(400).send({ status: false, message: "Please enter the correct details to update" })
        }

        //title validation
        if (data.title) {
            if (!isValid(data.title)) {
                return res.status(400).send({ status: false, message: "Title can not be empty" })
            }
            let usedTitle = await bookModel.findOne({ title: data.title })
            if (usedTitle) {
                return res.status(400).send({ status: false, message: "This title is already used, please entered a unique title" })
            }
        }

        if (data.excerpt) {
            if (!isValid(data.excerpt)) {
                return res.status(400).send({ status: false, message: "excerpt can not be empty" })
            }
        }

        //releasedAt validation
        if (data.releaseDate) {
            if (!/^(0[1-9]|[12][0-9]|3[01]-(0[1-9]|1[0-2])-\d{4})$/.test(data.releaseDate)) {
                return res.status(400).send({ status: false, message: `Release date must be in "DD-MM-YYYY" format or must be a valid date` })
            }
        }
        
        
               //         (0[1-9]|[12][0-9]|3[01]) For Day

            // (0[1-9]|1[012]) For Month

                    // \d{4} For Year
            
                  // [-] For -




        //ISBN validation
        if (data.ISBN) {
            if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) {
                return res.status(400).send({ status: false, message: "The ISBN is not valid" });
            }
        }
        let usedISBN = await bookModel.findOne({ ISBN: ISBN })
        if (usedISBN) {
            return res.status(400).send({ status: false, message: "Book with this ISBN is already exist" })
        }

        //this  book is successfully updated
        let updateBook = await bookModel.findByIdAndUpdate({ _id: id }, { title: data.title, ISBN: data.ISBN, excerpt: data.excerpt, releasedAt: data.releaseDate }, { new: true })
        return res.status(200).send({ status: true, message: "Book Update Successfully", data: updateBook })
    }
    catch (err) {
        return res.status(500).send({ error: err.message });
    }
}

//=============================================================
const deletedByParams = async function (req, res) {
    try {
          let bookid = req.params.bookId;
          if (!bookid) {
            return res
              .status(400)
              .send({ status: false, message: "please enter bookId" });
          }
          let findBookkId = await bookModel.findById(bookid);
          if (!findBookkId) {
            return res.status(404).send({ status: false, message: "book is not exits" });
          }
          if (findBookkId.isDeleted == false) {
            let findData = await bookModel.findOneAndUpdate(
              { _id: bookid },
              { $set: { isDeleted: true, deletedAt: Date.now() } },
              { new: true }
            );
            res
              .status(200)
              .send({ status: true, message: "Book deletion is successful" });
          } else {
           return res.status(404).send({ message: "Book is allredy deleted" });
          }
    } catch (error) {
        res.status(500).send(error.message)
    }
   };
module.exports={createBook , getBookByQuery, getBookByParam, deletedByParams , updateBooks}