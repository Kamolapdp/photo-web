const express = require('express');
const app = express();
const cors = require('cors');
const { signup, login } = require('./controllers/userController');
const { addImage, getImages, myImages, deleteImage,  allPhotos} = require('./controllers/imageController');
const addLike = require('./controllers/likeController');
const imageRouter = require('./routes/imageRoute');
const imageRoutes = require("./routes/imageRoute"); 

// ✅ To‘g‘ri yo‘l
app.use("/", imageRoutes);  // ✅ Routerni qo‘shish
app.use(cors())
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// User Controller
app.post("/signup", signup);
app.post("/login", login)

// Image Controller
app.post('/images', addImage)
// app.get("/images", getImages);
// app.post("/myimgs", myImages);

// app.get("/allimg", allPhotos);

app.get("/allPhotos", allPhotos);


// app.get("/allimages", allImasges);

app.delete("/dltimg/:id", deleteImage);

// Like Controller
app.post('/like', addLike);

app.use("/images",imageRouter)


const port = 5000;
app.listen(5000, () => {
  console.log('Serveringiz ishlamoqda');
})






