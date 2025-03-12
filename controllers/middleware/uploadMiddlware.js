const malter = require('malter');

const storage = malter.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, 'middleware/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage});

const uploadMiddleware = upload.single("photo");

module.exports = uploadMiddleware;