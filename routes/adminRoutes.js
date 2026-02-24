const express = require("express")
const adminRoutes = express()
const adminController = require("../controllers/adminController")
const session = require("express-session")
const config = require('../config/secretconfig')
const bodyParser = require("body-parser")
const auth = require('../middleware/adminAuth')


adminRoutes.use(session({secret: "mysessionsecret",resave: false,saveUninitialized: false}));
adminRoutes.use(bodyParser.json());
adminRoutes.use(bodyParser.urlencoded({ extended: true }));


adminRoutes.set('view engine','ejs'),
adminRoutes.set('views','./views/admin')



adminRoutes.get('/home',auth.isLogin,adminController.dashBoard)
adminRoutes.get('/dashboard',auth.isLogin,adminController.showUsers)
adminRoutes.get("/",auth.isLogout,adminController.adminLogin)
adminRoutes.post("/",adminController.verifyLogin)
adminRoutes.get('/logout',auth.isLogin,adminController.logout)

adminRoutes.get('/passforget',auth.isLogout,adminController.forgetPage)
adminRoutes.post('/passforget',adminController.forgetVerify)
adminRoutes.get('/forgetpassword',auth.isLogout,adminController.forgetLogic)
adminRoutes.post('/forgetpassword',adminController.updatePass)









module.exports = adminRoutes