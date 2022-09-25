const userModel = require("../models/userModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");



//======================================================  CREATE USER  ================================================================================//



const createUser = async function (req, res) {
  try {
    let data = req.body;

    let dataBody = Object.keys(data)
    if (dataBody.length == 0) {
      return res.status(400).send({ status: false, message: "DataBody can not be empty" })
    }

    let { title, name, phone, email, password, address } = data;

    const nameRegex = /^[a-zA-Z , ]*$/;
    const phoneRegex = /^[6-9][0-9]+$/

    if (data.length > 6) {
      return res.status(400).send({ status: false, message: "Length of the body can not be more than 6", });
    }

    if (!title) {
      return res.status(400).send({ status: false, message: "title is mandatory" });
    }

    if (!(title == "Mr" || title == "Mrs" || title == "Miss")) {
      return res.status(400).send({status: false, message: "Tittle can not be other then Mr, Mrs, Miss"});
    }

    if (!name) {
      return res.status(400).send({ status: false, message: "Name is mandatory" });
    }

    if (!nameRegex.test(name)) {
      return res.status(400).send({ status: false, message: "Plz do not enter any special character in name", });
    }

    if (!phone) {
      return res.status(400).send({ status: false, message: "Phone number is mandatory" });
    }

    if(!phoneRegex.test(phone)){
      return res.status(400).send({ status : false, message : "Phone number is not valid"})
    }

    if (phone.length < 10 || phone.length > 10) {
      return res.status(400).send({ status: false, message: "Length of phone is not valid" });
    }

    let phoneExist = await userModel.findOne({ phone });
    if (phoneExist) {
      return res.status(400).send({ status: false, message: "Phone number already exists" });
    }

    if (!email) {
      return res.status(400).send({ status: false, message: "Email is madatory" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({ status: false, message: "Email is not valid" });
    }

    let emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return res.status(400).send({ status: false, message: "Email Id already exists" });
    }

    if (!password) {
      return res.status(400).send({ status: false, message: "Password is mandatory" });
    }

    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({ status: false, message: "Password's length is not correct" });
    }

    if (password.includes(" ")) {
      return res.status(400).send({ status: false, message: "Space is not allowed in password" });
    }

    let addWithPin = address.pincode;

    if (addWithPin.length < 6 || addWithPin.length > 6) {
      return res.status(400).send({ status: false, message: "length of pincode is not correct" });
    }

    let userData = await userModel.create(data);
    return res.status(201).send({ status: true, data: userData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



//====================================================LOGIN USER===================================================================



const loginUser = async function (req, res) {
  try {

    let data = req.body;
    const { email, password } = data;

    let dataBody = Object.keys(data)
    if (dataBody.length == 0) {
      return res.status(400).send({ status: false, message: "DataBody can not be empty" })
    }

    if (!email) {
      return res.status(400).send({ status: false, message: "please provide email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: false, message: "Email not found" });
    }

    if (!password) {
      return res.status(400).send({ status: false, message: "please provide password" });
    }

    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({ status: false, message: "Password's length is not correct" });
    }

    if (user.password != password) {
      return res.status(400).send({ status: false, message: "please provide vaild password" });
    }

    const token = jwt.sign(
      {
        userId: user["_id"].toString(),
        iat: Math.floor(Date.now() / 1000), ///to get time in second
        exp: Math.floor(Date.now() / 1000) + 60 * 60, ///expire in 1hour
      },

      "project-3//bookmanagemnt-35"
    );

    return res.status(200).send({ status: true, message: "Success", data: { token } });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



module.exports = { createUser, loginUser };