const User = require("../models/userModel")
const bcrypt = require('bcrypt')

const securePassword = async(password)=>{

    try{

        const hashpassword = await bcrypt.hash(password,10)
        return hashpassword


    }catch(error){
        console.log(error.message)
    }
}

const loadRegister = async(req,res)=>{
    try{

        res.render("registration")

    }
    catch(error){   

        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try{
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            password: spassword,
            image:req.file.filename,
            is_Admin:0,
            is_verified:0
        });
        const userData = await user.save();
        if(userData){
            res.render('registration',{message:"registartion successfull"})
        }else{
            res.render("registration",{message:"registration failed"})
        }

    }catch(error){
        console.log(error.message)
    }
}


module.exports={
    loadRegister,insertUser
}