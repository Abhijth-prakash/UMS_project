const User = require("../models/userModel")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const config = require("../config/secretconfig")

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
             res.render('login',{message:"Email and passoword is incorrect"});
           }

       }else{
          res.render('login',{message:"Email and passoword is incorrect"});
       }

    }catch(error){
        console.log(error.message)
    }
}

//home page

const Home = async(req,res)=>{
    try{
        res.render('home')
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
    Home

}