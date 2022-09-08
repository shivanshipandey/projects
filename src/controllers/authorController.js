const authorModel = require("../models/authorModel")
const validator = require('validator')
const jwt = require('jsonwebtoken')
//create Author

const createAuthor = async function (req, res) {
     try {




          let authorData = req.body
           let compare = [ 'fname', 'lname', 'title', 'email', 'password' ]
           let  arr = Object.keys(req.body)
           for( let i = 0 ; i <compare.length; i ++ ){
                  if(compare[i] != arr[i])
                  { return res.status(400).send({ status : false ,msg :" use only fname lname title email password in this sequence"}) }
           }

          let { fname, lname, email ,password } = req.body
          let check1 = /^[a-zA-Z ]+$/.test(fname)
          let check2 = /^[a-zA-Z ]+$/.test(lname)
          
          if(req.body.title === "Mr" || req.body.title === "Miss" ||  req.body.title ==="Mrs")
          {         
          if (check1 == false || check2 == false) {
               return res.status(400).send({ status: false, message: "Please enter letters only, don't enter special character or digit" })
          }

          if(fname.includes(" ") || lname.includes(" ")){return res.send({status: false, message:"Space is not allowed"})}


          const result1 = fname.charAt(0).toUpperCase() + fname.slice(1).toLowerCase();
          const result2 = lname.charAt(0).toUpperCase() + lname.slice(1).toLowerCase();
          authorData.fname =result1
          authorData.lname = result2
         
          if (!validator.isEmail(email)) {
               return res.status(400).send({ status: false, message: "please enter valid e-mail id" })
          }
          let checkemail = await authorModel.findOne({ email: email })
          if (checkemail) {
               return res.status(409).send({ status: false, message: "this e-mail id is already registered" })
          }
         let  pass=typeof(password)
            console.log(pass)
         if(pass === "number" ){ return res.send("string dal de ")}
          if(password.length <8){
               console.log(password)
               return res.send({status: false, message:"Password length must be minimum 8 characters"})}
          let authorStored = await authorModel.create(authorData)
          res.status(201).send({ status: true, message: authorStored })
          // if user is entered incorrect title 
          } else{
               return res.status(400).send({ status : false , msg : "title is only Mr Miss Mrs "})
          }
     }
     catch (error) {
          res.status(500).send({ status: false, message: error.message })
     }
}



//log in user 

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
 


module.exports = { createAuthor ,loginAuthor};



