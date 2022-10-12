const mongoose = require("mongoose");

//validation 
const isValid=function(value){
  if (typeof value === "undefined" || value === null || value == " ")return false;
  if (typeof value === "string" && value.trim().length > 0)return true;
  return false
};

//Name Validation
const isValidName = function (name) {
  const nameRegex = /^[a-zA-Z ]+$/;
  return nameRegex.test(name);
};

//Email Validation
const isValidEmail = function (email) {
  const emailRegex =
    /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
  return emailRegex.test(email);
};

// Password Validation
const isValidPassword = function (password) {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;
  return passwordRegex.test(password);
};

//Phone Validation
const isValidPhone = function (phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// pincode Validation
const isValidpincode = function (pincode) {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

//Value Validation
const isEmpty = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

// ObjectId
const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidImage = function (profileImage) {
  let imageRegex = /^\\s]+(\\.(?i)(jpe?g|png|gif|bmp))$/;
  return imageRegex.test(profileImage);
};


const isValidStreet = function (street) {
  let streets = /^[#.0-9a-zA-Z\s,-]+$/;
  return streets.test(street);
};

//Price Validation
const isValidPrice = function(price){
  return /^[1-9]\d{0,7}(?:\.\d{1,2})?$/.test(price);
}

//Style Validation 
const isValidStyle = function (value) {
  return (/^[a-zA-Z _.-]+$/).test(value)        
}

module.exports = {
  isValid,
  isEmpty,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidpincode,
  isValidObjectId,
  isValidImage,
  isValidStreet,
  isValidPrice,
  isValidStyle,
};
