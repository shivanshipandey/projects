const userModel = require("../models/userModel");
const {uploadFile} = require("../aws/awsUpload");
const validation = require("../validator/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let {isEmpty,isValidName,isValidPhone,isValidpincode,isValidObjectId,
  isValidStreet} = validation;

// ========> Create User Api <=================
const createUser = async function (req, res) {
  try {
    let data = req.body;
    let files = req.files;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: "false", message: "All fields are mandatory" });
    }

    let { fname, lname, email, phone, password, address, profileImage } = data;
    if (!isEmpty(fname)) {
      return res.status(400).send({status: "false", message: "fname must be present"});
    }
    if (!isEmpty(lname)) {
      return res.status(400).send({status: "false", message: "lname must be present"});
    }
    if (!isEmpty(email)) {
      return res.status(400).send({status: "false", message: "email must be present"});
    }
    if (!isEmpty(phone)) {
      return res.status(400).send({status: "false", message: "phone number must be present"});
    }
    if (!isEmpty(password)) {
      return res.status(400).send({status: "false", message: "password must be present"});
    }
    if (!isEmpty(address)) {
      return res.status(400).send({status: "false", message: "Address must be present"});
    }
    if (!isValidName(lname)) {
      return res.status(400).send({status: "false", message: "last name must be in alphabetical order"});
    }
    if (!isValidPhone(phone)) {
      return res.status(400).send({ status: "false", message: "Provide a valid phone number" });
    }
    if( password.length < 8 || password.length > 15){
      return res.status(400).send({ status: false, message: "passwword no" })
  }
    if (!isValidName(fname)) {
      return res.status(400).send({status: "false",message: "first name must be in alphabetical order"});
    }
  

    // ------- Address Validation  --------
    if (address) {
      data.address = JSON.parse(data.address);
      if (address.shipping) {
        if (!isEmpty(address.shipping.street)) {
          return res.status(400).send({status: "false", message: "street must be present"});
        }
        if (!isEmpty(address.shipping.city)) {
          return res.status(400).send({ status: "false", message: "city must be present" });
        }
        if (!isEmpty(address.shipping.pincode)) {
          return res.status(400).send({ status: "false", message: "pincode must be present" });
        }
        if (!isValidStreet(address.shipping.street)) {
          return res.status(400).send({status: "false",message: "street should include no. & alphabets only"});
        }
        if (!isValidName(address.shipping.city)) {
          return res.status(400).send({status: "false",message: "city should include alphabets only"});
        }
        if (!isValidpincode(address.shipping.pincode)) {
          return res.status(400).send({status: "false",message: "pincode should be digits only"});
        }
      }
      if (address.billing) {
        if (!isEmpty(address.billing.street)) {
          return res.status(400).send({status: "false", message: "street must be present"});
        }
        if (!isEmpty(address.billing.city)) {
          return res.status(400).send({status: "false", message: "city must be present"});
        }
        if (!isEmpty(address.billing.pincode)) {
          return res.status(400).send({status: "false", message: "pincode must be present"});
        }
        if (!isValidStreet(address.billing.street)) {
          return res.status(400).send({status: "false",message: "street should include no. and alphabets only"});
        }
        if (!isValidName(address.billing.city)) {
          return res.status(400).send({status: "false",message: "city should be in alphabetical order"});
        }
        if (!isValidpincode(address.billing.pincode)) {
          return res.status(400).send({status: "false",message: "pincode should be digits only"});
        }
      }
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    data.password = hash;

    let checkEmail = await userModel.findOne({ email});
    if (checkEmail) {
      return res.status(400).send({status: "false", message: "Email is already in use"});
    }
    let checkPhone = await userModel.findOne({ phone: phone });
    if (checkPhone) {
      return res.status(400).send({status: "false", message: "Phone number is already in use"});
    }

    // if(!profileImage){
    //   return res.status(400).send({ status : false, message : "Profile Image is mandatory"})
    // }

     
    let profileImgUrl = await uploadFile(files[0]);
        data.profileImage = profileImgUrl

    let savedUser = await userModel.create(data);
    return res.status(201).send({
      status: true,message: "user has been created successfully",data: savedUser});
    } catch (err) {
    return res.status(500).send({ status: "false", msg: err.message });
  }
};

// ==========> User Login Api <================
const userLogin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({status: false, message: "Please provide email and password"});
    }
    if (!email) {
      return res.status(400).send({ status: false, message: "Email must be present" });
    }
    if (!password) {
      return res.status(400).send({ status: false, message: "Password must be present" });
    }

    let checkEmail = await userModel.findOne({ email: email });
    if (!checkEmail) {
      return res.status(401).send({status: false,message: "Please provide a correct Email"});
    }
    let checkPassword = await bcrypt.compare(password, checkEmail.password);
    if (!checkPassword) {
      return res.status(401).send({status: false,message: "please provide a correct password"});
    }
    let token = jwt.sign({
        userId: checkEmail._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, //expires in 24 hr
      },"group42Project5");
    res.setHeader("x-api-key", token);
    return res.status(200).send({status: true,message: "User Login Successful",data: {userId: checkEmail._id, token: token},});
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// ==========> Get Users Data <================
const getUser = async function (req, res) {
  try {
    let userId = req.params.userId;
    let userLoggedIn = req.tokenData.userId;

    if (!isValidObjectId(userId)) {
      return res.status(400).send({status: false, msg: "Invalid userId"});
    }

    if (userId != userLoggedIn) {
      return res.status(403).send({status: false, msg: "Error, authorization failed"});
    }

    let checkData = await userModel.findOne({ _id: userId });
    if (!checkData) {
      return res.status(404).send({status: false, message: "No data found"});
    }
    return res.status(200).send({
      status: true,message: "Users Profile Details",data: checkData}); 
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// ===========> Update Users Data <=============
const updateUsersProfile = async function (req, res) {
  try {
    let userId = req.params.userId;
    let userLoggedIn = req.tokenData.userId;

    if (!isValidObjectId(userId)) {    //check if userid is valid
      return res.status(400).send({status: false, message: `${userId} is invalid`});
    }
    const checkUser = await userModel.findOne({ _id: userId });
    if (!checkUser) { return res.status(404).send({status: false, message: "User does not exist"});
    }
    if (userId != userLoggedIn) {
      return res.status(403).send({status: false, msg: "Error, authorization failed"});
    }
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({status: false,message: "Insert Data : BAD REQUEST"});
    }
    let { fname, lname, email, phone, password } = data;
    if (fname || fname == "") {                     //validation for fname
      if(!isEmpty(fname)) {
        return res.status(400).send({ status: false, message: "Please Provide first name"});
      }
      if (!isValidName(fname)) {
        return res.status(400).send({ status: false, msg: "Invalid fname" });
      }
    }
    if (lname || lname == "") {                   //validation for lname
      if(!isEmpty(lname)) {
        return res.status(400).send({status: false, msg: "Please Provide last name"});
      }
      if (!isValidName(lname)) {
        return res.status(400).send({ status: false, msg: "Invalid lname" });
      }
    }
    if (email || email == "") {                 //validation for mail
      if(!isEmpty(email)) {
        return res.status(400).send({status: false, msg: "Please Provide email address"});
      }

      if (!isValidEmail(email)) {
        return res
          .status(400).send({ status: false, message: "Provide a valid email id" });
      }
      const checkEmail = await userModel.findOne({ email: email });
      if (checkEmail) {
        return res.status(400).send({ status: false, message: "email id already exist" });
      }
    }
    if (phone || phone == "") {           //validation for phone no.        
      if(!isEmpty(phone)) {
        return res.status(400).send({status: false, msg: "Please Provide email address"});
      }                             
      if (!isValidPhone(phone)) {
        return res.status(400).send({status: false, message: "Invalid phone number"});
      }

      const checkPhone = await userModel.findOne({ phone: phone });
      if (checkPhone) {
        return res.status(400).send({status: false, message: "phone number already exist"});
      }
    }
    if (password || password == "") {                 // validation for password
      if (!isEmpty(password)) {
        return res.status(400).send({status: false,message: "password is required"});
      }
      if (!isValidPassword(password)) {
        return res.status(400).send({status: false,message: "Password should be Valid min 8 character and max 15 "});
      }
      const encrypt = await bcrypt.hash(password, 10);
      data.password = encrypt;
    }

    if (data.address || data.address == "") {            // Validate address
      data.address = JSON.parse(data.address);
      if (!isEmpty(data.address)) {
        return res.status(400).send({status: false,message: "Please provide address details!"});
      }
      if (!isEmpty(data.address.shipping)) {
        return res.status(400).send({ status: false, message: "Please enter shipping address!" });
      }
      if (!isEmpty(data.address.shipping.city) || !isValidName(data.address.shipping.city)) {
        return res.status(400).send({status: false,message: "Please provide a valid city in shiping address!"});
      }
      if (!isEmpty(data.address.shipping.street) || !isValidStreet(data.address.shipping.street)) {
        return res.status(400).send({status: false,message: "Please provide a valid street in shiping address!"});
      }
      if (!isEmpty(data.address.shipping.pincode) || !isValidpincode(data.address.shipping.pincode)) {
        return res.status(400).send({status: false,message: "Please provide a valid pincode in shiping address!"});
      }

      if (!isEmpty(data.address.billing)) {
        return res.status(400).send({status: false, message: "Please enter billing address!"});
      }
      if (!isEmpty(data.address.billing.city) || !isValidName(data.address.billing.city)) {
        return res.status(400).send({status: false,message: "Please provide a valid city in billing address!"});
      }
      if (!isEmpty(data.address.billing.street) || !isValidStreet(data.address.billing.street)) {
        return res.status(400).send({status: false,message: "Please provide a valid street in billing address!"});
      }
      if (!isEmpty(data.address.billing.pincode) || !isValidpincode(data.address.billing.pincode)) {
        return res.status(400).send({status: false,message: "Please provide a valid pincode in billing address!"});
      }
    }
    // let profileImage = req.files;
    // if (profileImage && profileImage.length > 0) {
    //   let uploadFileURL = await uploadFile(profileImage[0]);
    //   data.profileImage = uploadFileURL;
    //  } else {
    //   return res.status(400).send({ status: false, msg: "No Image found" });
    // }

    let updateData = await userModel.findOneAndUpdate({ _id: userId }, data, {new: true});
    res.status(200).send({status: true,message: "User profile Updated",data: updateData});
  } catch (err) {
    res.status(500).send({status: false, message: err.message});
  }
};

module.exports = {createUser, userLogin, getUser, updateUsersProfile};