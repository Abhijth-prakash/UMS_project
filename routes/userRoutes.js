const express = require("express");
const userRoutes = express(); 

const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const userController = require("../controllers/userController");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage });


userRoutes.use(bodyParser.json());
userRoutes.use(bodyParser.urlencoded({ extended: true }));


userRoutes.set('view engine', 'ejs');
userRoutes.set('views', './views/user');



userRoutes.get("/register", userController.loadRegister);
userRoutes.post( '/register',upload.single('image'),userController.insertUser);
userRoutes.get("/verify",userController.verifyMail);
userRoutes.get("/",userController.userLogin)
userRoutes.get("/login",userController.userLogin)
userRoutes.post("/login",userController.verifyLogin)
    
userRoutes.get('/home',userController.Home)    




module.exports = userRoutes;
