const express = require("express");
const userRoutes = express();

userRoutes.set('view engine','ejs');
userRoutes.set("views","./views/user");

const userController = require("../controllers/userController");
userRoutes.get("/register",userController.loadRegister);

module.exports=userRoutes;




