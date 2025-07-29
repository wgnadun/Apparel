const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dxzsfmpzu",
  api_key: "934666276573583",
  api_secret: "Sk5p2zYLLBklOiYYv6FDpEkcSWE",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  try {
    console.log('Uploading to Cloudinary:', file.substring(0, 100) + '...');
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    console.log('Cloudinary upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };