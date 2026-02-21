const User = require("../models/userModel")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const config = require("../config/secretconfig")
const randomString = require('randomstring')

//verification mail

const sendVerifyMail = async(name,email,user_id)=>{
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
            subject:'For verify mail',
            html: '<p>Hi ' + name + ', please click here to <a href="http://localhost:3000/verify?id=' + user_id + '">Verify</a> your mail.</p>'
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


    
//hashing password
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

//registering user
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
           sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render("registration",{message:"registration succesully, please verify email"})
        }else{
            res.render("registration",{message:"registration failed"})
        }

    }catch(error){
        console.log(error.message)
    }
}

//updating verification    
const verifyMail = async(req,res)=>{
    try{
    const updateInfo = await User.updateOne(
      { _id: req.query.id }, { $set: { is_verified: 1 } }   
    );

    console.log(updateInfo);

    res.render("email_verified");

    }catch(error){
        console.log(error.message)
    }
}


//user login

const userLogin = async(req,res)=>{
    try{

        res.render('login')

    }catch(error){
        console.log(error.message)
    }
}


//verify login

const verifyLogin = async(req,res)=>{
    try{    
        const email = req.body.email.trim();
        const password = req.body.password.trim();
       const userData =  await User.findOne({email:email});
       if(userData){
           const passMatch = await bcrypt.compare(password,userData.password)
           if(passMatch){
                if(userData.is_verified ===0){
                    res.render('login',{message:"please verify your mail"})
                }else{
                    req.session.user_id = userData._id;
                    res.redirect('/home')
                }

           }else{
             res.render('login',{message:"Email and password is incorrect"});
           }

       }else{
          res.render('login',{message:"Email and password is incorrect"});
       }

    }catch(error){
        console.log(error.message)
    }
}

//home page

const Home = async(req,res)=>{
    try{
     const userData = await   User.findById({_id:req.session.user_id})

        res.render('home',{user:userData})
    }catch(error){
        console.log(error.message)
    }
}





//forget page

const forgetPage = async(req,res)=>{
    try{
        res.render('forget')
    }catch(error){
        console.log(error.message)
    }
}

//forget password logic
const forgetPassword = async(req,res)=>{
    try{
       const email = req.body.email.trim()
       const userData =  await User.findOne({email:email})
       if(userData){

          if(userData.is_verified ===0){
            res.render('forget',{message:"please verify email"})

          }else{

                const randomstring = randomString.generate();
                const updatedData = await User.updateOne({email:email},{$set:{token:randomstring}})
                passwordResetMail(userData.name,userData.email,randomstring)
                res.render('forget',{message:"please check your mail"})
          }


       }else{
        res.render('forget',{message:"user email is incorrect"})
       }
    }catch(error){
        console.log(error.message)
    }
}



// password reseting email

const passwordResetMail = async(name,email,token)=>{
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
           html: '<p>Hi ' + name + ', please click here to <a href="http://localhost:3000/password_reset?token=' + token + '">Reset</a> your password.</p>'}
    
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



// reset password page

const passwordReset = async (req, res) => {
  try {
    const token = req.query.token;

    const tokenData = await User.findOne({ token: token });

    if (tokenData) {
      return res.render('password_reset', {
        user_id: tokenData._id,
        token: token
      });
    } else {
      return res.render('password_reset', {
        message: "Token is invalid",
        user_id: null,
        token: null
      });
    }

  } catch (error) {
    console.log(error.message);
  }
};



// updating password

const updatingPassword = async(req,res)=>{
    try{
        console.log(req.body)
        const password = req.body.password
        const user_id = req.body.user_id
        

        const secure_Password =  await securePassword(password)

       const updatedData = await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_Password,token:''}})
        res.redirect("/")

    }catch(error){
        console.log(error.message)
    }
}


//if the user failed to verify fist time 
const  verification = async(req,res)=>{
    try{
        res.render('verification')

    }catch(error){

    }
}

//reverfication logic

const verificationLogic = async(req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password
        const checkUser = await User.findOne({email:email})
        if(checkUser){ 
            const passVerify = await bcrypt.compare(password,checkUser.password)
            if(passVerify){
            sendVerifyMail(checkUser.name,email,checkUser._id)
            res.render('verification',{message:"please check your inbox and verify your mail"})                
            }else{
            res.render('verification',{message:"email and password is incorrect"})     
            }
                       
        }else{
            res.render('verification',{message:"email and password is incorrect"})
        }
        
    }catch(error){
        console.log(error.message)
    }
}


 

module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    userLogin,
    verifyLogin,
    Home,
    forgetPassword,
    forgetPage,
    passwordResetMail,
    passwordReset,
    updatingPassword,
    verification,
    verificationLogic,
}