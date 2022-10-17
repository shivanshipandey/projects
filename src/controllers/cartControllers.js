const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const validator = require('../validator/validation')
const { isValidObjectId, isEmpty } = validator

const createCart = async function (req, res) {
    try {
        let userId = req.params.userId;

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "UserId is not valid" })
        }

        let userCheck = await userModel.findOne({ _id: userId })
        if (!userCheck) {
            return res.status(400).send({ status: false, message: "This user is not found" })
        }

        let data = req.body;

        let { cartId, productId, quantity } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: "false", message: "Please enter the data in request body" });
        }

        if (!isEmpty(productId)) {
            return res.status(400).send({ status: false, message: "Productid is mandatory" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "ProductId is not valid" })
        }


        if (quantity) {
            if (quantity > 1 || typeof quantity != "number") {
                return res.status(400).send({ status: false, message: "Quantity is not valid" })
            }
        }

        let productCheck = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productCheck) {
            return res.status(400).send({ status: false, message: "This product is not found" })
        }

        if (cartId) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "CartId is not valid" })
            }

            let cartCheck = await cartModel.findById({ cartId })
            if (!cartCheck) {
                return res.status(400).send({ status: false, message: "Cart does not exists" })
            }

            let itemsArr = cartCheck.items
            let totalPrice = cartCheck.totalPrice
            let totalItems = cartCheck.totalItems
            let flag = true

            for (let i = 0; i < itemsArr.length; i++) {
                if (itemsArr[i].productId._id == productId) { //if the product already exist in our cart
                    itemsArr[i].quantity += quantity
                    totalPrice += itemsArr[i].productId.price * quantity
                    flag = false
                }
            }

            if (flag == true) { //if product does not already exist in our cart then add it in the cart
                itemsArr.push({ productId: productId, quantity: quantity })
                totalPrice += productCheck.price * quantity
            }
            totalPrice = totalPrice
            totalItems = itemsArr.length
            const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, ({ items: itemsArr, totalPrice: totalPrice, totalItems: totalItems }), { new: true })

            if (!updatedCart) return res.status(404).send({ status: false, message: "cart not found" })

            return res.status(200).send({ status: true, message: "Success", data: updatedCart })



        } else {
            let obj = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity
                }],
                totalPrice: (productCheck.price * quantity),
                totalItem: quantity
            }

            let finalCart = await cartModel.create(obj)
            return res.status(400).send({ status: false, message: "data Created successfully", data: finalCart })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





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

const deleteCart = async (req, res) => { 
    try {
        let paramsId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({status: false, msg: "Invalid userId"});
             }
     let findUser=await userModel.findById({_id:userId})
        if(!findUser)return res.status(404).send({status:false,message:"User not found"})
        // Authentication
        let tokenId=req.userId
        // console.log(tokenID)
         if (tokenId !=userId)return res.status(401).send({status:false,message:"Unauthorise Access"})
        let items = [];
        let totalPrice = 0
        let totalItems = 0
        const cartGet = await cartModel.findOneAndUpdate({ userId: paramsId }, { items: items, totalPrice: totalPrice, totalItems: totalItems }, { new: true });
        return res.status(204).send({ status: true, message: 'Success', data: cartGet });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


module.exports={createCart, getCartData,deleteCart}