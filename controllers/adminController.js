const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const randomstring = require('randomstring')
const config = require('../config/secretconfig')
const nodemailer = require('nodemailer')
const session = require("express-session")




//verification mail

const verificaionMail = async(name,email,user_id)=>{
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
            subject:'Admin added you please verify your mail',
           html: `
    <p>Hi ${name},</p>

    <p>Please click below to verify your email:</p>

    <a href="http://localhost:3000/verify?id=${user_id}">
        Verify Email
    </a>

    <br><br>

    <p>Your username: <b>${name}</b></p>

    <p>If you did not create this account, ignore this email.</p>
`
        }

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
           html: '<p>Hi ' + name + ', please click here to <a href="http://localhost:3000/admin/forgetpassword?token=' + token + '">Reset</a> your password.</p>'}
    
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


//hashing password
const securingPassword = async(password)=>{

    try{

        const hashpassword = await bcrypt.hash(password,10)
        return hashpassword


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

        const userData = await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData})
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


//forget logic

const forgetLogic = async(req,res)=>{
    try{
        const token = req.query.token
        const userData  = await User.findOne({token:token})
        if(userData){
            res.render('newpassword',{user_id:userData._id})
        }else{
            res.status(404).send("Something went wrong")
        }
    }catch(error){
        console.log(error.message)
    }
}

//update password


const updatePass = async(req,res)=>{
    try{

        const id = req.body.user_id
        const password = req.body.password
        const userData = await User.findOne({_id:id})
        if(userData){
            const spassword = await securingPassword(password)
            const updatedData = await User.findByIdAndUpdate({_id:userData._id},{$set:{password:spassword,token:""}})
            res.redirect('/admin')

        }else{
           res.status(404).send("Something went wrong")
        }

    }catch(error){
        console.log(error.message)
    }
}



//dashboard show users

const showUsers = async(req,res)=>{
    try{
        const userData = await User.find({is_Admin:0})

        res.render('dashboard',{users:userData})
    }catch(error){
        console.log(error.message)
    }
}

//add new user via admin dashboard

const addNewUserPage = async(req,res)=>{
    try{
        res.render('newuser')

    }catch(error){
        console.log(error.message)
    }
}

//adding new user via admin dashbaord

const addNewUserlogic = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const checkmail = await User.findOne({ email })

        if (checkmail) {
            return res.render('newuser', {
                message: 'Email already exists'
            })
        }

        const spassword = await securingPassword(password)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword,
            image: req.file ? req.file.filename : null,
            is_Admin: 0,
            is_verified: 0
        })

        const userData = await user.save()

        if (userData) {
            verificaionMail(userData.name, userData.email, userData._id)

            return res.render('newuser', {
                message: 'Mail is sent — please verify'
            })
        }

        return res.status(404).send("Something went wrong")

    } catch (error) {
        console.log(error.message)
    }
}



//edit user

const editUser = async(req,res)=>{
    try{

        console.log(id)
        const userData = await User.findById({_id:id})
        if(userData){
            res.render('edituser',{user:userData})
        }else{
        return res.status(404).send("Something went wrong")
        }

    }catch(error){
        console.log(error.message)
    }
}


//update edited user 

const updatingUser = async(req,res)=>{
    try{
        const id = req.body.id
        if(id){
            const updateUser = await User.findOneAndUpdate({_id:id},{$set:{
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile,
                is_verified:req.body.verify
            }})
            res.redirect('/admin/dashboard')
        }else{
        return res.status(404).send("Something went wrong")
        }

    }catch(error){
        console.log(error.message)
    }
}


//deleting user

const deleteUser = async(req,res)=>{
    try{

        const id = req.query.id
        if(id){
            const deleteUser = await User.deleteOne({_id:id})
                  res.redirect('/admin/dashboard')
        }else{
            return res.status(404).send("Something went wrong")
        }


    }catch(error){
        console.log(error)
    }
}

module.exports={
    adminLogin,
    verifyLogin,
    dashBoard,
    logout,
    forgetPage,
    forgetVerify,
    forgetLogic,
    updatePass,
    showUsers,
    addNewUserPage,
    addNewUserlogic,
    editUser,
    updatingUser,
    deleteUser   
}