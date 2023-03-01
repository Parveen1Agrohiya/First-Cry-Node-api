const category = require('../models/categoryModel');
const product = require('../models/productListingModel');
var path = require('path');
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./upload");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname + " " + Date.now() + ".jpg")
//   },
// });

// const uploadFile = multer({
//   storage: storage,
//   limits: {
//     fileSize: 4 * 1024 * 1024
//   }
// }).single("image");

const storage = multer.diskStorage({
  destination: './public/images',
  filename: function (req, file, cb) {
    // cb(null,"IMAGE-" + Date.now() +"-"+file.originalname);
    cb(null,file.originalname);
  },
});

const uploadCategoryImage = async (req, res) => {
  const uploadImageInCategory = multer({
    storage: storage,
    limits: { fileSize: 4 * 1024 * 1024 }
  }).single("image");

  uploadImageInCategory(req, res, function(err){
    if(err){
      console.log(err);
    }
    else {
      // console.log(req.file);
      uploadName = req.file.filename;
      console.log("Uploaded image: "+uploadName);
    }
  });
  return res.status(200).json({ message: 'image uploaded' });
}

const addCategory = async (req, res) => {
    try {
      // const { category } = req.body;
      // const findCategory = await category.find();
      // let check = false;
      // const type = (req.body.type).toLowerCase();
      // console.log(type);
      // const age = (req.body.type).toLowerCase();

      const isCategoryPresent = await category.find({ type : req.body.type, age:req.body.age })
      // console.log(isCategoryPresent);
      if(isCategoryPresent) {
        for (let i = 0; i < isCategoryPresent.length; i ++) {
          if (isCategoryPresent[i].gender.toLowerCase() === req.body.gender.toLowerCase()) {
            return res.status(200).json({ message: 'category already present' });
          }
        }
      }
      
      // if (findCategory.length > 0) {
        // for (let i = 0; i < findCategory.length; i ++) {
        //   if (findCategory[i].type.toLowerCase() === req.body.type.toLowerCase()) {
        //     check = true;
        //     break;
        //   }
        // }
        // if (check === false) {
        const createCategory = new category({
          gender: req.body.gender,
          age: req.body.age,
          type: req.body.type,
          image: req.body.image
          // image: path.join(__dirname, '../public/images/babyimageclothes.jpg')
        });

          await createCategory.save();
          res.status(200).json({ message: 'category added' });
        // }
        // else {
        //   res.status(400).json(`category ${req.body.type} already present`);
        // }
      // }
    }
    catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  const getAllCategory = async (req, res) => {
    try {
      res.status(200).send(await category.find());
    }
    catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  // const getOneCategory = async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const catProducts = await category.findOne( { _id : id }).populate("products");
  //     res.status(200).send(catProducts.products);
  //   }
  //   catch (err) {
  //     res.status(400).json({ error: err.message });
  //   }
  // };

  const getOneCategory = async (req, res) => {
    try {
      const id = req.params.id;
      let { page, size } = req.query;
      if (!page) {
        page = 1;
      }
      if (!size) {
        size = 6;
      }
      const skip = (page - 1)* size;
      const catProducts = await category.findOne( { _id : id }).populate("products");
      // console.log(catProducts.products);
      let shortProduct = [];
      for (let i = catProducts.products.length-1; i >= 0; i--) {
        shortProduct.push(catProducts.products[i]);
      }
      const result = shortProduct.slice(skip, size * page);
      res.status(200).send(result);
    }
    catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  const getCategoryImage = async (req, res) => {
    try {
      const { filename } = req.params;
    // console.log(filename);
    return res.sendFile(path.join(__dirname, '../public/images', filename));
    }
    catch (err) {
      res.status(400).send({ error: err });
    }
  };

  module.exports = {
    addCategory,
    getAllCategory,
    getOneCategory,
    uploadCategoryImage,
    getCategoryImage
  }