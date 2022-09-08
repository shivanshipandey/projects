const authorModel = require("../models/authorModel")
const validator = require('validator')
const jwt = require('jsonwebtoken')


//CREATE AUTHOR

const createAuthor = async function (req, res) {
     try {
          let authorData = req.body
          let { fname, lname, title, email, password } = req.body
          let arr = Object.keys(req.body)

          //All credentials are mandatory

          if (!fname) {
               return res.status(400).send({ status: false, message: "fname is required."})
          }
          if (!lname) {
               return res.status(400).send({status: false, message: "lname is required."})
          }
          if (!title) {
               return res.status(400).send({status: false, message: "title is required."})
          }
          if (!email) {
               return res.status(400).send({ status: false, message: "email is required." })
          }
          if (!password) {
               return res.status(400).send({status: false, message: "password is required." })
          }

          // Length of the req.body is fixed

          if (arr.length > 5) {
               return res.status(400).send({
                    status: false,
                    message: " Give fname, lname, title, e-mail, password only"
               })
          }

                    // fname & lname should be in alphabets only

                    let firstName = /^[a-zA-Z ]+$/.test(fname)
                    let lastName = /^[a-zA-Z ]+$/.test(lname)

                    if (firstName == false || lastName == false) {
                        return res.status(400).send({
                         status: false,
                         message: "Please enter letters only, don't enter special characters or digits"
                    })
               }

               // Space is not allowed in between of names

               if (fname.includes(" ") || lname.includes(" ")) {
                    return res.status(400).send({
                         status: false, message: "Space is not allowed"
                    })
               }
                
               // Only Mr., Mrs., Miss, are entertained as the title 

               if (req.body.title === "Mr" || req.body.title === "Miss" || req.body.title === "Mrs") {
                    if (!validator.isEmail(email)) {
                         return res.status(400).send({
                              status: false, message: "Please enter valid e-mail id"
                         })
                    }

                    // Password should be entered in strings only

                    if (typeof (password) != "string") {
                         return res.status(400).send({
                              status: false, message: "Give Password only in a String."
                         })
                    }

                    //Minimum length of password should be 8

                    if (password.length < 8) {
                         return res.send({
                              status: false, message: "Password length must be minimum 8 characters"
                         })
                    }

                    //Email should always be unique

                    let checkemail = await authorModel.findOne({ email: email })
                    if (checkemail) {
                         return res.status(409).send({
                              status: false, message: "this e-mail id is already registered"
                         })
                    }
 
                    // First Letter will always be in upperCase
                    let firstName = fname.charAt(0).toUpperCase() + fname.slice(1).toLowerCase();
                    let lastName = lname.charAt(0).toUpperCase() + lname.slice(1).toLowerCase();
                    authorData.fname = firstName
                    authorData.lname = lastName

                    //Here our Author will be created

                    let authorStored = await authorModel.create(authorData)
                    res.status(201).send({
                         status: true,
                         message: authorStored
                    })
               
          } else {
               return res.status(400).send({
                    status: false,
                    message: "Title can be  Mr,  Miss,  Mrs only."
               })
          }
     }
     catch (error) {
          res.status(500).send({status: false,message: error.message})
     }
}

// LOGIN AUTHOR

const loginAuthor = async function (req, res) {
     try {

          // Email is mandatory 

          let { email, password } = req.body
          if (!email) {
               return res.status(400).send({
                    status: false, message: "EmailId is mandatory"
               })
          }

          // Password is mandatory

          if (!password) {
               return res.status(400).send({
                    status: false, message: "Password is mandatory"
               })
          }

          //Check Whether the email and password you entered is correct or not

          let authorCheck = await authorModel.findOne({
               email: email,
               password: password
          });
          if (!authorCheck) return res.status(400).send({
               status: false, message: "EmailId or password is incorrect"
          })

          //Generating Token

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
          res.status(500).send({
               status: false, message: error.message
          })
     }
}


module.exports = {
     createAuthor,
     loginAuthor
};

