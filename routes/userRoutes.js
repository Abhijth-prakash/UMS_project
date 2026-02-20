const express = require("express");
const userRoutes = express(); 
const bodyParser = require('body-parser');
const upload = require('../multer/multer');
const userController = require("../controllers/userController");
const session = require('express-session')
const auth = require('../middileware/auth')





userRoutes.use(session({secret: "mysessionsecret",resave: false,saveUninitialized: false}));
userRoutes.use(bodyParser.json());
userRoutes.use(bodyParser.urlencoded({ extended: true }));


userRoutes.set('view engine', 'ejs');
userRoutes.set('views', './views/user');



userRoutes.get("/register",auth.isLogout,userController.loadRegister);
userRoutes.post( '/register',upload.single('image'),userController.insertUser);
userRoutes.get("/verify",userController.verifyMail);
userRoutes.get("/",auth.isLogout,userController.userLogin)
userRoutes.get("/login",auth.isLogout,userController.userLogin)
userRoutes.post("/login",userController.verifyLogin)
    
userRoutes.get('/home',auth.isLogin,userController.Home)  


userRoutes.get('/forget',auth.isLogout,userController.forgetPage)
userRoutes.post('/forget',userController.forgetPassword)
userRoutes.get('/password_reset',auth.isLogout,userController.passwordReset)
userRoutes.post('/password_reset',auth.isLogout,userController.updatingPassword)

module.exports = userRoutes;
