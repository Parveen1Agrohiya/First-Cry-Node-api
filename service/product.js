const category = require('../models/categoryModel');
const product = require('../models/productListingModel');
const path = require('path');

const productList = async (req, res) => {
    try {
      const { categoryId, image, name, price, discount, brand, description } = req.body;
        const productListing = new product({
          categoryId: categoryId,
          image: image,
          name: name,
          price: price,
          discount: discount,
          brand: brand,
          description: description
        })
        await productListing.save();
    
        const cat = await category.findOne({ _id: categoryId});
        cat.products.push(productListing);
        await cat.save();
    
        res.status(200).send('product added');
      }
    catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  const getAllProduct = async (req, res) => {
    try {
      let { page, size } = req.query;
      if (!page) {
        page = 1;
      }
      if (!size) {
        size = 6;
      }
      const skip = (page - 1) * size;
      const catProducts = await product.find();
      let shortProduct = [];
      for ( let i = catProducts.length-1; i >= 0; i-- ) {
        shortProduct.push(catProducts[i]);
      }
      const result = shortProduct.slice(skip, size * page);
      res.status(200).send(result);
      // res.status(200).send(await product.find());
    }
    catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  const getOneProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const oneproduct = await product.findOne( { _id : id })//.populate("categoryId");
      res.status(200).send(oneproduct);
    }
    catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  const getProductImage = async (req, res) => {
    try {
      const { filename } = req.params;
      return res.sendFile(path.join(__dirname, '../public/images', filename));
    }
    catch (err) {
      res.status(400).send({ error: err });
    }
  };

  module.exports = {
    productList,
    getAllProduct,
    getOneProduct,
    getProductImage
  }