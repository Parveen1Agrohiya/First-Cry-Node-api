const cartData = require('../models/cartModel');
const product = require('../models/productListingModel');

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log(req.user)
    
        const myCart = await cartData.findOne({ _id: userId});
    
        res.send(myCart);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
};

const addIntoCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const { productId } = req.params;
        
        const myProduct = await product.findOne({ _id: productId});
        // console.log(myProduct);

        const myCart = await cartData.findOne({ _id: userId});

        if(myCart) {
            myCart.cartProducts.push( {
                productId: myProduct._id,
                productName: myProduct.name,
                quantity: 1,
                price: myProduct.price,
                image: myProduct.image
            })
            await myCart.save();
        }
        else {
            const myNewCart = new cartData({
                _id: userId,
                cartProducts: [
                    {
                        productId: myProduct._id,
                        productName: myProduct.name,
                        quantity: 1,
                        price: myProduct.price,
                        image: myProduct.image
                    }
                ]
            });
            
            await myNewCart.save();
        }

        res.status(200).send('Product Added Successfully in Cart');
    }
    catch (err) {
        res.status(400).json({ error: err.message});
    } 
};

const udpateIntoCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const { productid, quantity } = req.body;
    
        const myCart = await cartData.findOne({ _id: userId});
    
        for(let i = 0; i < myCart.cartProducts.length; i++) {
            if(myCart.cartProducts[i].productId === productid) {
                myCart.cartProducts[i].quantity = quantity;
                await myCart.save();
            }
        }
    
        res.status(200).send(myCart);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }

}

const cartRemoveProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
    
        const myCart = await cartData.findOne({ _id: userId});
    
        for(let i = 0; i < myCart.cartProducts.length; i++) {
            if(myCart.cartProducts[i].productId === productId) {
                // console.log(i);
                myCart.cartProducts.splice(i, 1);
                // console.log(myCart);
                await myCart.save();
                break;
            }
        }
        res.status(200).send(myCart);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }

}

const emptyCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await cartData.deleteOne({ _id: userId});
    
        res.status(200).send('Cart cleared');
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
}

module.exports = {
    getCart,
    addIntoCart,
    udpateIntoCart,
    cartRemoveProduct,
    emptyCart
}