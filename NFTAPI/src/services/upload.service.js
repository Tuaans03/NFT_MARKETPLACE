const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const config = require("../config/config");

cloudinary.config({
  cloud_name: config.cloudary.cloud_name,
  api_key: config.cloudary.api_key,
  api_secret: config.cloudary.api_secret,
});

const storage_img = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "medical-booking/image",
    resource_type: "image",
    transformation: [{ with: 800, height: 800, crop: "limit" }],
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const delete_image = (imagePath) => {
  const publicId =
    "medical-booking/image" +
    imagePath.substring(
      imagePath.lastIndexOf("/") + 1,
      imagePath.lastIndexOf(".")
    );
  cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      console.error("Lỗi xóa hình đại diện khỏi Cloudinary", error);
    }
    console.log("Đẫ xóa hình đại diện khỏi Cloudinary", result);
  });
};

const uploadImage = multer({
  storage: storage_img,
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/img",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép các định dang tệp .jpg, .jpeg, .png và .gif"));
    }
  },
});

module.exports = { uploadImage, delete_image };
