const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const randomstring = require('randomstring')
const config = require('../config/secretconfig')
const nodemailer = require('nodemailer')



//reset password mail

const passwordMail = async(name,email,token)=>{
    try{
        const transporter = nodemailer.createTransport({

            secure:false,
            host:'smtp.gmail.com',
            port:587,
            requireTLS:true,
            auth:{
                user: config.gMail,
                pass: config.gPass
            }

        });
        
        const mailOptions ={
            from: config.gMail,
            to:email,
            subject:'For Reset passwprd',
           html: '<p>Hi ' + name + ', please click here to <a href="http://localhost:3000/admin/forget?token=' + token + '">Reset</a> your password.</p>'}
    
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
            }else{
                console.log("email has been sent:-",info.response);
            }
        })
    }catch(error){
        console.log(error.message)
    }
}






//admin login
const adminLogin = async(req,res)=>{
    try{

        res.render('login')
    }catch(error){
        console.log(error.message)
    }
}


//verify login
const verifyLogin = async(req,res)=>{
    try{

        const email = req.body.email
        const password =  req.body.password
        const userData = await User.findOne({email:email})
        if(userData){
        const checkPass  = await bcrypt.compare(password,userData.password)
        if(checkPass){
            if(userData.is_Admin === 0){
                   
                    res.render('login',{message:"Email and password is incorrect"})
            }else{
                req.session.user_id = userData._id
                 res.redirect('/admin/home')
            }
                
        }else{
            res.render('login',{message:"Email and password is incorrect"})
        }
           
        }else{
        res.render('login',{message:"Email and password is incorrect"})
        }

    }catch(error){
        console.log(error.message)
    }
}


//logout

const logout = async(req,res)=>{
    try{

        req.session.destroy()
        res.redirect('/admin')
    }catch(error){
        console.log(error.message)
    }
}

//Admin Dashboard


const dashBoard = async(req,res)=>{
    try{
        res.render('home')
    }catch(error){
        console.log(error.message)
    }
    
}


//forget page


const forgetPage = async(req,res)=>{
    try{
        res.render('passforget')
    }
    catch(error){
        console.log(error.message)
    }
}


//forget verification





const forgetVerify = async(req,res)=>{
    try{
        const email = req.body.email
        const userData = await User.findOne({email:email})
        console.log(req.body.mail)
        if(userData){
            if(userData.is_Admin === 0){
            res.render('passforget',{message:"email is incorrect"})              
            }else{
                const randomString = randomstring.generate();
                const upUser =  await User.updateOne({email:email},{$set:{token:randomString}})
                passwordMail(userData.name,userData.email,randomString)
                res.render('passforget',{message:"please check your mail"})    

            }

        }else{
            res.render('passforget',{message:"email is incorrect"})
        }

    }catch(error){
        console.log(error.message)
    }
}

module.exports={
    adminLogin,
    verifyLogin,
    dashBoard,
    logout,
    forgetPage,
    forgetVerify
    
    
}