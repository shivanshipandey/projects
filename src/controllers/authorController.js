const authorModel = require("../models/authorModel")
const validator = require('validator')
const jwt = require('jsonwebtoken')
//create Author

const createAuthor = async function (req, res) {
     try {
          let authorData = req.body
          let { fname, lname, title, email, password } = req.body
          //let compare = ['fname', 'lname', 'title', 'email', 'password']
          let arr = Object.keys(req.body)

          if (!fname) {
               return res.status(400).send({
                    status: false,
                    message: "fname is required."
               })
          }
          if (!lname) {
               return res.status(400).send({
                    status: false,
                    message: "lname is required."
               })
          }
          if (!title) {
               return res.status(400).send({
                    status: false,
                    message: "title is required."
               })
          }
          if (!email) {
               return res.status(400).send({
                    status: false,
                    message: "email is required."
               })
          }
          if (!password) {
               return res.status(400).send({
                    status: false,
                    message: "password is required."
               })
          }

          // for (let i = 0; i < compare.length; i++) {
          //      if (compare[i] != arr[i]) {
          //           return res.status(400).send({
          //                status: false,
          //                message: " Give fname, lname, title, e-mail, password only in this sequence"
          //           })
          //      }
          // }
          if (arr.length > 5) {
               return res.status(400).send({
                    status: false,
                    message: " Give fname, lname, title, e-mail, password only"
               })
          }

          let check1 = /^[a-zA-Z ]+$/.test(fname)
          let check2 = /^[a-zA-Z ]+$/.test(lname)
          if (check1 == false || check2 == false) {
               return res.status(400).send({
                    status: false,
                    message: "Please enter letters only, don't enter special characters or digits"
               })
          }
          if (fname.includes(" ") || lname.includes(" ")) {
               return res.status(400).send({
                    status: false,
                    message: "Space is not allowed"
               })
          }

          if (req.body.title === "Mr" || req.body.title === "Miss" || req.body.title === "Mrs") {

               if (!validator.isEmail(email)) {
                    return res.status(400).send({
                         status: false,
                         message: "Please enter valid e-mail id"
                    })
               }

               if (typeof (password) != "String") {
                    return res.status(400).send({
                         status: false,
                         message: "Give Password only in a String."
                    })
               }
               if (password.length < 8) {
                    return res.send({
                         status: false,
                         message: "Password length must be minimum 8 characters"
                    })
               }

               let checkemail = await authorModel.findOne({ email: email })
               if (checkemail) {
                    return res.status(409).send({
                         status: false,
                         message: "this e-mail id is already registered"
                    })
               }

               let firstName = fname.charAt(0).toUpperCase() + fname.slice(1).toLowerCase();
               let lastName = lname.charAt(0).toUpperCase() + lname.slice(1).toLowerCase();
               authorData.fname = firstName
               authorData.lname = lastName

               let authorStored = await authorModel.create(authorData)
               res.status(201).send({
                    status: true,
                    message: authorStored
               })
          }
          else {
               return res.status(400).send({
                    status: false,
                    message: "Title can be  Mr,  Miss,  Mrs only."
               })
          }
     }
     catch (error) {
          res.status(500).send({
               status: false,
               message: error.message
          })
     }
}

// Login Author

const loginAuthor = async function (req, res) {
     try {
          let { email, password } = req.body
          if (!email) {
               return res.status(400).send({
                    status: false,
                    message: "EmailId is mandatory"
               })
          }
          if (!password) {
               return res.status(400).send({
                    status: false,
                    message: "Password is mandatory"
               })
          }
          let authorCheck = await authorModel.findOne({
               email: email,
               password: password
          });
          if (!authorCheck) return res.status(400).send({
               status: false,
               message: "EmailId or password is incorrect"
          })
          let token = jwt.sign(
               {
                    authorId: authorCheck._id.toString(),
                    batch: "Plutonium",
                    organisation: "Project-1, Group-34"
               },
               "Blogging-Site"
          );
          return res.status(201).send({
               status: true,
               message: token
          })
     }
     catch (error) {
          res.status(500).send({
               status: false,
               message: error.message
          })
     }
}


module.exports = {
     createAuthor,
     loginAuthor
};



