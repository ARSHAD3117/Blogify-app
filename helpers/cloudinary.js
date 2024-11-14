const cloudinay = require("cloudinary").v2;
const multer = require("multer");

cloudinay.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function ImageUploadUtil(file) {
  const result = await cloudinay.uploader.upload(file, {
    resource_type: "auto",
  });
  return result;
}

module.exports = { upload, ImageUploadUtil };
