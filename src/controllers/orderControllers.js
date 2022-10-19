const orderModel=require("../models/orderModel")
const cartModel=require("../models/cartModel")
const userModel=require("../models/userModel")



const createOrder= async(req,res)=>{
    let cartId=req.params.cartId
   
  let findCart=await cartModel.findOne({_id:cartId})
    if(!findCart){
        return res.status(400).send({status:"false",msg:"plz provide valid id "})
    }
    if (!(req.userId=findCart.userId)){
        return res.status(400).send({status:"false",msg:"plz privide valid uderId"})
    }
    
    const cartcheck=findCart.items.length
    if(cartcheck==0){
        return res .status(400).send({status:"false",msg:})
      }
 
    let totalQuantity = 0;
    for (let i = 0; i < userCart.items.length; i++) {
      totalQuantity += userCart.items[i].quantity;
    }
    let {userId,items,totalPrice,totalItems}=myOrder
    let order=await orderModel.create(myOrder)
    return res.status(201).send({status:"true",msg:"success"})
}

module.exports={createOrder}


