const express = require("express");
const router = express.Router();
const multer = require("multer"); // ✅ Multer orqali fayl yuklash
const { addImage, getImages, myImages, allPhotos, deleteImage } = require("../controllers/imageController");

// Fayl saqlash joyini belgilash
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Fayllar "uploads/" papkasiga saqlanadi
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Foydalanuvchi yuklagan fayl nomi
    }
});
const upload = multer({ storage: storage }); // ✅ Middleware yaratildi

// ✅ Fayl yuklash marshruti (Upload)
router.post("/upload", upload.single("image"), addImage);  

// ✅ Rasm olish marshrutlari
router.get("/images", getImages);
router.get("/my-images/:id", myImages);
router.get("/all-photos", allPhotos);
router.delete("/delete-image/:id", deleteImage);

module.exports = router;
