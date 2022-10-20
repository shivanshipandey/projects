const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validation");

const { isEmpty, isValidObjectId } = validation;




// =================================> CREATE CART <========================================//



const createCart = async (req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" });
        }

        let userId = req.params.userId;
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "Invalid userId Id" });

        let { productId, cartId, quantity } = data;

        if (!isEmpty(productId))
            return res.status(400).send({ status: false, message: "productId required" });

        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: "Invalid productId" });

        if (!quantity) { quantity = 1 }

        quantity = Number(quantity);
        if (typeof quantity !== "number")
            return res.status(400).send({ status: false, message: "quantity must be a number" });

        if (quantity < 1)
            return res.status(400).send({ status: false, message: "quantity cannot be less then 1" });

        if (cartId) {                                       // checking cartId
            if (!isValidObjectId(cartId))
                return res.status(400).send({ status: false, message: "Invalid cartId" });
        }

        let checkUser = await userModel.findOne({ _id: userId });
        if (!checkUser)
            return res.status(404).send({ status: false, message: "User does not exists" });

        if (cartId) {
            let findCart = await cartModel.findOne({ _id: cartId });
            if (!findCart)
                return res.status(404).send({ status: false, message: "Cart does not exists" });
        }

       
        let checkProduct = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!checkProduct)
            return res.status(404).send({ status: false, message: "No products found or product has been deleted" });

        let checkCart = await cartModel.findOne({ userId: userId });
        if (!checkCart && findCart) {
            return res.status(403).send({ status: false, message: "Cart does not belong to this user" });
        }

        if (checkCart) {
            // if (cartId) {
            //     if (checkCart._id.toString() != cartId)
            //         return res.status(403).send({ status: false, message: "Cart does not belong to this user" });
            // }

            let ProdIdInCart = checkCart.items;
            let uptotal = checkCart.totalPrice + checkProduct.price * Number(quantity);
            let productId = checkProduct._id//.toString();
            for (let i = 0; i < ProdIdInCart.length; i++) {
                let productfromitem = ProdIdInCart[i].productId.toString();

                //updates previous product i.e QUANTITY
                if (productId == productfromitem) {
                    let previousQuantity = ProdIdInCart[i].quantity;
                    let updatedQuantity = previousQuantity + quantity;
                    ProdIdInCart[i].quantity = updatedQuantity;
                    checkCart.totalPrice = uptotal;
                    await checkCart.save();
                    return res.status(201).send({ status: true, message: "Success", data: checkCart });
                }
            }
            //adds new product
            checkCart.items.push({ productId: productId, quantity: Number(quantity) });
            let total = checkCart.totalPrice + checkProduct.price * Number(quantity);
            checkCart.totalPrice = total;
            let count = checkCart.totalItems;
            checkCart.totalItems = count + 1;
            await checkCart.save();
            return res.status(201).send({ status: true, message: "Success", data: checkCart });
        }

        let calprice = checkProduct.price * Number(quantity);           // 1st time cart
        let obj = {
            userId: userId,
            items: [{ productId: productId, quantity: quantity }],
            totalPrice: calprice,
        };
        obj["totalItems"] = obj.items.length;
        let result = await cartModel.create(obj);
        return res.status(201).send({ status: true, message: "Success", data: result });
    } catch (err) {
        return res.status(500).send({ status: false, err: err.message });
    }
};



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
        let find = await cartModel.findOne({ userId: userId })

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