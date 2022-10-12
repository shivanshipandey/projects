const express=require("express")
const router=express.Router()
const userController=require("../controllers/userControllers")
const middleWare = require("../middleware/auth");

let {createUser, userLogin, getUser, updateUsersProfile} = userController;
let {authentication, authorization} = middleWare;

// ==========> Create User Api <============ 
router.post("/register", createUser);

// =========> User Login Api <============
router.post("/login", userLogin);

// =========> Get User Api <============
router.get("/user/:userId/profile", authentication, authorization, getUser);

// =========> Update User Profile Api <============
router.put("/user/:userId/profile", authentication, authorization, updateUsersProfile);

module.exports=router