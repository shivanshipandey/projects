const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validation");

const { isEmpty, isValidObjectId } = validation;




// =================================> CREATE CART <========================================//



const createCart = async function (req, res) {
    try {
        let requestparams = req.params.userId
        let requestBody = req.body
        const { cartId, productId } = requestBody

        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: "false", message: "Please enter the data in request body" });
        }

        if (!(cartId || productId)) {
            return res.status(400).send({ status: false, message: "Please enter valid keys to create cart" })
        }

        if (cartId) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "invalid cartId format" })
            }
            let cartExist = await cartModel.findById(cartId)
            if (!cartExist) {
                return res.status(404).send({ status: false, message: "cart does not exist" })
            }
        }
        
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "invalid productId format" })
        }
        let productExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productExist) {
            return res.status(404).send({ status: false, message: "product does not exist" })
        }
    
        //================ check if cart belong to the same user ===================

        let validCart = await cartModel.findOne({ userId: requestparams })
        if (validCart) {
            if (cartId) {
                if (validCart._id.toString() != cartId) {
                    return res.status(403).send({ status: false, message: `Cart does not belong to this user` })
                }
            }
           
            let productInCart = validCart.items
            let proId = productExist._id.toString()
            for (let i = 0; i < productInCart.length; i++) {
                let productFromItem = productInCart[i].productId.toString()


                //==================== if product is already present in cart ==========================================
                
                if (proId == productFromItem) {
                    let oldCount = productInCart[i].quantity
                    let newCount = oldCount + 1
                    let uptotal = (validCart.totalPrice + (productExist.price)).toFixed(2)
                    productInCart[i].quantity = newCount
                    validCart.totalPrice = uptotal
                    await validCart.save();
                    await validCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
                    return res.status(201).send({ status: true, message: 'Success', data: validCart })
                }
            }

            //================================== if new product wants to be added ====================================
          
            validCart.items.push({ productId: productId, quantity: 1 })
            let total = (validCart.totalPrice + (productExist.price * 1)).toFixed(2)
            validCart.totalPrice = total
            let count = validCart.totalItems
            validCart.totalItems = count + 1
            await validCart.save()
            await validCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
            return res.status(201).send({ status: true, message: 'Success', data: validCart })



        }
        //==================================== if user does not have cart =====================================================
     
        let calprice = (productExist.price * 1).toFixed(2)
        let obj = {
            userId: requestparams,
            items: [{
                productId: productId,
                quantity: 1
            }],
            totalPrice: calprice,
        }
        obj['totalItems'] = obj.items.length
        let result = await cartModel.create(obj)
        await result.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })

        return res.status(201).send({ status: true, message: 'Success', data: result })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



// =================================> GET CART <==================================//




const getCartData = async function (req, res) {
    try {
        let userId = req.params.userId

        if (!isEmpty(userId)) {
            return res.status(400).send({ status: false, message: "UserId is missing" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid userId" });
        }

        let findUser = await userModel.findById({ _id: userId })
        if (!findUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }
        let findCart = await cartModel.findOne({ userId: userId })
        if (!findCart) {
            return res.status(404).send({ status: false, message: "cart is not found" })
        }

        return res.status(200).send({ status: true, message: "Success", data: findCart })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}




// =====================================> UPDATE CART <=================================//



const updateCart = async function (req, res) {
    try {
        let data = req.body
        let userId = req.params.userId

        if (!userId)
            return res.status(400).send({ status: false, message: "Please Provide userId in the path Params" })

        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, msg: "userId is not valid" })

        let checkUser = await userModel.findById(userId)
        if (!checkUser)
            return res.status(404).send({ status: false, msg: "user is not found" })

            if (Object.keys(data).length == 0) {
                return res.status(400).send({ status: false, message: "Body cannot be empty" });
            }
    

        let { productId, cartId, removeProduct } = data

        if (!cartId)
            return res.status(400).send({ status: false, msg: "plz provide cartId" })

        if (!isValidObjectId(cartId))
            return res.status(400).send({ status: false, message: " enter a valid cartId " })

        let findCart = await cartModel.findOne({ _id: cartId, isDeleted: false })   
         
        if (!findCart)
            return res.status(404).send({ status: false, message: " cart not found" })

        if (userId != findCart.userId)
            return res.status(403).send({ status: false, message: "Access denied, this is not your cart" })

        if (!productId)
            return res.status(400).send({ status: false, msg: "plz provide productId" })

        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: " enter a valid productId " });

        let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })

        if (typeof removeProduct != "number")
            return res.status(400).send({ status: false, message: " removeProduct Value Should be Number " })

        if ((removeProduct !== 0 && removeProduct !== 1)) {
            return res.status(400).send({ status: false, message: "removeProduct value should be 0 or 1 only " })
        }

        let productPrice = findProduct.price
        let item = findCart.items

        if (item.length == 0)
            return res.status(404).send({ status: false, message: "cart is empty" })

        let productIndex = item.findIndex(loopVariable => loopVariable.productId.toString() == productId)

        if (productIndex > -1) {

            if (removeProduct == 1) {
                item[productIndex].quantity--
                findCart.totalPrice -= productPrice;

            } else if (removeProduct == 0) {
                let changePrice = item[productIndex].quantity * productPrice
                findCart.totalPrice -= changePrice
                item[productIndex].quantity = 0
            }
            if (item[productIndex].quantity == 0) {
                item.splice(productIndex, 1)
            }
        }
        if (productIndex == -1) {

            return res.status(404).send({ status: false, message: "productId not found in cart" })
        }
 
        findCart.totalItems = item.length
        await findCart.save()
        let find = await cartModel.findOne({ userId: userId }).populate('items.productId')

        return res.status(200).send({ status: true, message: "Success", data: find })
    }

    catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }
}



//=================================> DELETE CART <==========================================//



const deleteCart = async (req, res) => {
    try {
        let userId = req.params.userId

        if (!isEmpty(userId)) {
            return res.status(400).send({ status: false, message: "UserId is missing in params" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid userId" });
        }

        let findUser = await userModel.findById({ _id: userId })
        if (!findUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        let items = [];
        let totalPrice = 0
        let totalItems = 0
        const cartGet = await cartModel.findOneAndUpdate({ userId: userId }, { items: items, totalPrice: totalPrice, totalItems: totalItems }, { new: true });
        return res.status(204).send({ status: true, message: 'Success', data: cartGet });
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCart, getCartData, updateCart, deleteCart }