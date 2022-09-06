const authorModel = require("../models/authorModel")
const validator = require('validator')
const createAuthor = async function (req, res) {
     try {
          let authorData = req.body
          let { fname, lname, email } = req.body
          if (!/^[A-Za-z]\S*$/.test(fname) || !/^[A-Za-z]\S*$/.test(lname)) {
               return res.status(400).send({ status: false, message: "Please enter letters only." })
          }
          if (!validator.isEmail(email)) {
               return res.status(400).send({ status: false, msg: "please enter valid e-mail id" })
          }
          let checkemail = await authorModel.findOne({ email: email })
          if (checkemail) {
               return res.status(409).send({ status: false, msg: "this e-mail id is already registered" })
          }
          let authorStored = await authorModel.create(authorData)
          res.status(201).send({ status: true, msg: "data created" })
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}

module.exports.createAuthor = createAuthor;

