const express = require("express");
const userRoutes = express(); 
const bodyParser = require('body-parser');
const upload = require('../multer/multer');
const userController = require("../controllers/userController");
const session = require('express-session')
const auth = require('../middleware/auth')



//middilewares
userRoutes.use(express.static('public'))
userRoutes.use(session({secret: "mysessionsecret",resave: false,saveUninitialized: false}));
userRoutes.use(bodyParser.json());
userRoutes.use(bodyParser.urlencoded({ extended: true }));

//set up view enigne
userRoutes.set('view engine', 'ejs');
userRoutes.set('views', './views/user');


//user register
userRoutes.get("/register",auth.isLogout,userController.loadRegister);
userRoutes.post( '/register',upload.single('image'),userController.insertUser);
userRoutes.get("/verify",userController.verifyMail);

//user login
userRoutes.get("/",auth.isLogout,userController.userLogin)
userRoutes.get("/login",auth.isLogout,userController.userLogin)
userRoutes.post("/login",userController.verifyLogin)


//home page, logout
userRoutes.get('/home',auth.isLogin,userController.Home)  
userRoutes.get('/logout',auth.isLogin,userController.logoutUser)


//forget password
userRoutes.get('/forget',auth.isLogout,userController.forgetPage)
userRoutes.post('/forget',userController.forgetPassword)
userRoutes.get('/password_reset',auth.isLogout,userController.passwordReset)
userRoutes.post('/password_reset',auth.isLogout,userController.updatingPassword)


//reverification
userRoutes.get('/verification',userController.verification)
userRoutes.post('/verification',userController.verificationLogic)


//edit user
userRoutes.get('/edit',auth.isLogin,userController.updatePage)
userRoutes.post('/edit',upload.single('image'),userController.updateLogic)




module.exports = userRoutes;
