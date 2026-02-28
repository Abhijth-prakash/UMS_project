const express = require("express")
const adminRoutes = express()
const adminController = require("../controllers/adminController")
const session = require("express-session")
const config = require('../config/secretconfig')
const bodyParser = require("body-parser")
const auth = require('../middleware/adminAuth')
const upload = require('../multer/multer')


//middilewares
adminRoutes.use(express.static('public'))
adminRoutes.use(session({secret: "mysessionsecret",resave: false,saveUninitialized: false}));
adminRoutes.use(bodyParser.json());
adminRoutes.use(bodyParser.urlencoded({ extended: true }));


//set up view engine
adminRoutes.set('view engine','ejs'),
adminRoutes.set('views','./views/admin')

//admin login
adminRoutes.get("/",adminController.adminLogin)
adminRoutes.post("/",adminController.verifyLogin)


//home,dashboard
adminRoutes.get('/home',auth.isLogin,adminController.dashBoard)
adminRoutes.get('/dashboard',auth.isLogin,adminController.showUsers)


//admin logout
adminRoutes.get('/logout',auth.isLogin,adminController.logout)


//forget password
adminRoutes.get('/passforget',auth.isLogout,adminController.forgetPage)
adminRoutes.post('/passforget',adminController.forgetVerify)
adminRoutes.get('/forgetpassword',auth.isLogout,adminController.forgetLogic)
adminRoutes.post('/forgetpassword',adminController.updatePass)

//adding new user
adminRoutes.get('/newuser',auth.isLogin,adminController.addNewUserPage)
adminRoutes.post('/newuser',upload.single('image'),adminController.addNewUserlogic)


//editing user
adminRoutes.get('/edituser',auth.isLogin,adminController.editUser)
adminRoutes.post('/edituser',auth.isLogin,adminController.updatingUser)


//deleting user
adminRoutes.get('/deleteuser',auth.isLogin,adminController.deleteUser)




module.exports = adminRoutes