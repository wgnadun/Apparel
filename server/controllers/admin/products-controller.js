const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    console.log('Image upload request received');
    console.log('File details:', {
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size
    });
    
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    
    console.log('Calling Cloudinary upload...');
    const result = await imageUploadUtil(url);

    console.log('Upload successful, returning result');
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.json({
      success: false,
      message: "Error occurred during image upload",
      error: error.message
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    console.log('Adding new product with data:', {
      title,
      category,
      brand,
      price,
      image: image ? 'Image URL provided' : 'No image URL'
    });

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    console.log('Product saved successfully:', newlyCreatedProduct._id);
    
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.error('Error adding product:', e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    console.log('Fetching all products...');
    const listOfProducts = await Product.find({});
    console.log(`Found ${listOfProducts.length} products`);
    
    // Log first few products for debugging
    if (listOfProducts.length > 0) {
      console.log('Sample products:', listOfProducts.slice(0, 3).map(p => ({
        id: p._id,
        title: p.title,
        image: p.image ? 'Has image' : 'No image'
      })));
    }
    
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.error('Error fetching products:', e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};