const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    cartProducts: [{
        productId: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            // required: true
        }
    }]
})

module.exports = mongoose.model('cartData', cartSchema);