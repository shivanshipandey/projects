const cartModel=require("../models/cartModel")
const ObjectId = require('mongoose').Types.ObjectId;



const getCartData=async function(req,res){
    try {
        let userId=req.params.userId
        if (!isValidObjectId(userId)) {
        return res.status(400).send({status: false, msg: "Invalid userId"});
         }
        let findUser=await userModel.findById({_id:userId})
        if(!findUser)return res.status(404).send({status:false,message:"User not found"})
        // Authentication
        let tokenId=req.userId
        // console.log(tokenID)
         if (tokenId !=userId)return res.status(401).send({status:false,message:"Unauthorise Access"})
          let findCart=await cartModel.findOne({userId:userId})
        if(!findCart)return res.status(404).send({status:false,message:"cart is not found"})
        return res.status(200).send({status:true,message:"Cart data fetched successfully",data:findCart})       
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}


module.exports={getCartData}