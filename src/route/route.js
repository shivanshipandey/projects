const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../Middleware/auth")



                         //USER API//
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)


                         //BOOKS API//
router.post('/books', middleware.authentication, middleware.authorisation2, bookController.createBook )
router.get("/books",middleware.authentication, bookController.getBookByQuery)
router.get('/books/:bookId',middleware.authentication, bookController.getBookByParam)
router.put("/books/:bookId", middleware.authentication, middleware.authorisation, bookController.updateBooks)
router.delete('/books/:bookId', middleware.authentication, middleware.authorisation, bookController.deletedByParams)
               

                         //REVIEW API//
router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteBookReview)



router.all("/*", function (req, res) {
    res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"
    })
})

module.exports = router;