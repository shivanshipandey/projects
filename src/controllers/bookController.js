const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require("../models/reviewModel")


let isValid = mongoose.Types.ObjectId.isValid

//=====================================================CREATE BOOK ===============================================================================================//

const createBook = async function (req, res) {
    try {

        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, releasedAt } = data

        let dataBody = Object.keys(data)
        if (dataBody.length == 0) {
            return res.status(400).send({ status: false, message: "DataBody can not be empty" })
        }

        if (!title) {
            return res.status(400).send({ status: false, message: "Title is mandatory" })
        }

        let titleCheck = await bookModel.findOne({ title })
        if (titleCheck) {
            return res.status(400).send({ status: false, message: "This title already exists" })
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, message: "Excerpt is mandatory" })
        }

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is mandatory" })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "Not a valid userId" })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is mandatory" })
        }

        if (ISBN.length < 13 || ISBN.length > 13) {
            return res.status(400).send({ status: false, message: "Length of ISBN number is incorrect" })
        }

        let isbnCheck = await bookModel.findOne({ ISBN })
        if (isbnCheck) {
            return res.status(400).send({ status: false, message: "This ISBN Number is already registerd" })
        }

        if (!category) {
            return res.status(400).send({ status: false, message: "Category is mandatory" })
        }

        let categoryCheck = await bookModel.findOne({ category })
        if (categoryCheck) {
            return res.status(400).send({ status: false, message: "This category is already registered" })
        }

        if (!subcategory) {
            return res.status(400).send({ status: false, mssg: "Subcategory is mandatory" })
        }

        if (reviews) {
            if (typeof (reviews) != Number) {
                return res.status(400).send({ status: false, message: "Give reviews only in a Number." })
            }
        }

        if (isDeleted) {
            if (typeof (isDeleted) != "boolean") {
                return res.status(400).send({ status: false, message: "isDeleted can be true or false only" })
            }
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "releasedAt is mandatory" })
        }

        let isValidDate = Date(`${releasedAt}`, 'YYYY-MM-DD') ////if required check for empty validation too}
        if (isValidDate == false) {
            return res.status(400).send({ status: false, message: 'releseAt should be in YYYY-MM-DD format.' });
        }

        let bookData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: bookData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//=======================================   GET BOOKS BY QUERY PARAMS   ============================================================================



const getBookByQuery = async function (req, res) {
    try {

        let data = req.query

        let size = Object.entries(data).length
        if (size < 1) {
            return res.status(400).send({ status: false, message: "Query param not given" })
        }

        const getBook = await bookModel.find({ $and: [data, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1}).sort({ title: 1 })

        if (getBook.length == 0) {
            return res.status(404).send({ status: false, message: "No Book found" })
        }
        res.status(200).send({ status: true, message: "BookList", data: getBook })

    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



//==============================================================GET BOOKS BY PATH PARAMS===================================================



const getBookByParam = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId) {
            return res.status(400).send({ status: false, message: "Please provide bookId" })
        }

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is invalid" })
        }

        let getAllBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!getAllBook) {
            return res.status(404).send({ status: false, message: "No book found" })
        
        }
        let findReview = await reviewModel.find({ bookId: bookId, isDeleted: false })
        let object = {
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
        return res.status(200).send({ status: true, message: "Book Lists with Reviews", data: { object } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}



//===================================================   UPDATE THE BOOK   =========================================================================



const updateBooks = async function (req, res) {
    try {

        let bookId = req.params.bookId;

        if (!bookId) {
            return res.status(400).send({ status: false, message: "Please provide bookId" })
        }

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is invalid" })
        }

        let checkData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkData) {
            return res.status(404).send({ status: false, message: "This book is not found" })
        }

        let data = req.body
        let { title, excerpt, releasedAt, ISBN} = data

        let dataBody = Object.keys(data)
        if (dataBody.length == 0) {
            return res.status(400).send({ status: false, message: "DataBody can not be empty" })
        }

        let checkTitle = await bookModel.findOne({ title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "This title already Exists" })
        }

        let checkIsbn = await bookModel.findOne({ ISBN })
        if (checkIsbn) {
            return res.status(400).send({ status: false, message: "This ISBN already exists" })
        }


        let updatedBook = await bookModel.findByIdAndUpdate({ _id: bookId, isDeleted: false }, { title, excerpt, releasedAt, ISBN }, { new: true })
        return res.status(200).send({ status: true, message: "Book Updated Successfully", data: updatedBook })

    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
}



//=============================================================  DELETE BY PARAMS  ======================================



const deletedByParams = async function (req, res) {
    try {

        let bookId = req.params.bookId;

        if (!bookId) {
            return res.status(400).send({ status: false, message: "please enter bookId" });
        }

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is not valid" })
        }

        let findBookId = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "Book does not exists" });
        }

        let findData = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: Date.now() }, { new: true }).select({ isDeleted: 1, deletedAt: 1 });
        res.status(200).send({ status: true, message: "Book deletion is successful", data: findData });

    } catch (error) {
        res.status(500).send(error.message)
    }
};
module.exports = { createBook, getBookByQuery, getBookByParam, deletedByParams, updateBooks }