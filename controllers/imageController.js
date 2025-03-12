const pool = require("../config/db");
const jwt = require('jsonwebtoken');

const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer sozlamalari
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Rasm yuklash route
router.post("/upload", upload.single("image"), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ message: "Fayl yuborilmadi" });
        }

        const imagePath = `http://localhost:5000/uploads/${req.file.filename}`;
        res.status(201).json({ imageUrl: imagePath });
        console.log("Rasm muvaffaqiyatli yuklandi:", imagePath);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
});

module.exports = router;



const addImage = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Fayl yuborilmadi" });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const result = await pool.query(
            "INSERT INTO images (imgurl, user_id) VALUES ($1, $2) RETURNING *",
            [imagePath, user_id]
        );

        res.status(201).json({ imageUrl: imagePath });
        console.log("Rasm muvaffaqiyatli qo'shildi:", result.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Serverda xatolik yuz berdi");
    }
};

// Barcha rasmlarni olish
const getImages = async (req, res) => {
    try {
        const resultUser = await pool.query("SELECT * FROM images");

        if (resultUser.rows.length === 0) {
            return res.status(404).json({ message: 'Rasm mavjud emas' });
        }

        res.status(200).json(resultUser.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Serverda xatolik yuz berdi");
    }
};

// Foydalanuvchining o'z rasmlari
const myImages = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: 'User topilmadi' });
        }

        const result = await pool.query("SELECT * FROM images WHERE user_id = $1", [id]);

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Serverda xatolik yuz berdi.");
    }
};

// Rasmni o‘chirish
const deleteImage = async (req, res) => {
    try {
        const token = req.header("Authorization").split(" ")[1];

        if (!token) {
            return res.status(404).json({ message: "Token berilmadi" });
        }

        const isvalidKey = jwt.verify(token, "Men Senga bir gap aytaman hech kim bilmasin");
        console.log(isvalidKey);

        const { id } = req.params;
        await pool.query('DELETE FROM images WHERE id = $1', [id]);

        res.status(200).json({ message: "Rasm o'chirildi" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Serverda xatolik yuz berdi");
    }
};

// Barcha rasmlar va ularning 'like' soni
const allPhotos = async (req, res) => {
    try {
        const { id } = req.query;
        const result = await pool.query(
            `SELECT users.firstname, users.lastname, images.id AS photoId, filepath, imgurl, 
             COUNT(likes.id) AS likesCount,
             EXISTS (SELECT * FROM likes WHERE user_id = $1 AND image_id = images.id) AS isLiked
             FROM users
             INNER JOIN images ON users.id = images.user_id
             LEFT JOIN likes ON images.id = likes.image_id
             GROUP BY images.id, users.id`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("Serverda xatolik yuz berdi");
    }
};

module.exports = {
    addImage: [upload.single("image"), addImage], // Multer yuklash bilan birga ishlaydi
    getImages,
    myImages,
    allPhotos,
    deleteImage
};
