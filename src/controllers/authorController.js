const authorModel = require("../models/authorModel")
const validator = require('validator')

//create Author

const createAuthor = async function (req, res) {
     try {
          let authorData = req.body
          let { fname, lname, email } = req.body
          let check1 = /^[a-zA-Z ]+$/.test(fname)
          let check2 = /^[a-zA-Z ]+$/.test(lname)
          if (check1 == false || check2 == false) {
               return res.status(400).send({ status: false, message: "Please enter letters only, don't enter special character or digit" })
          }
          if (!validator.isEmail(email)) {
               return res.status(400).send({ status: false, message: "please enter valid e-mail id" })
          }
          let checkemail = await authorModel.findOne({ email: email })
          if (checkemail) {
               return res.status(409).send({ status: false, message: "this e-mail id is already registered" })
          }
          let authorStored = await authorModel.create(authorData)
          res.status(201).send({ status: true, message: authorStored })
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}


module.exports = { createAuthor };



