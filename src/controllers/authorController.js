const authorModel = require("../models/authorModel")
const validator = require('validator')
const jwt = require('jsonwebtoken')
//create Author

const createAuthor = async function (req, res) {
     try {
          let authorData = req.body
          let { fname, lname, email } = req.body
          let check1 = /^[a-zA-Z ]+$/.test(fname)
          let check2 = /^[a-zA-Z ]+$/.test(lname)
          if (check1 == false || check2 == false) {
               return res.status(400).send({ status: false, message: "Please enter letters only, don't enter special characters or digits" })
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

// Login Author

const loginAuthor = async function (req, res) {
     try {
         let { email, password } = req.body
         if (!email) return res.status(400).send({ status: false, message: "EmailId is mandatory" })
         if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })
         let authorCheck = await authorModel.findOne({ email: email, password: password });
         if (!authorCheck) return res.status(400).send({ status: false, message: "EmailId or password is incorrect" })
         let token = jwt.sign(
             {
                 authorId: authorCheck._id.toString(),
                 batch: "Plutonium",
                 organisation: "Project-1, Group-34"
             },
             "Blogging-Site"
         );
         return res.status(201).send({ status: true, message: token })
     }
     catch (error) {
         res.status(500).send({ status: false, message: error.message })
     }
 }


module.exports = { createAuthor, loginAuthor };



