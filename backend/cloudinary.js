const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_key",
  api_secret: "your_secret",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "finance_bills",
  },
});

module.exports = { cloudinary, storage };
