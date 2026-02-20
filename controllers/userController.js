const User = require("../models/userModel")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const config = require("../config/secretconfig")


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
           sendVerifyMail(req.body.name, req.body.email, userData._id);
        }else{
            res.render("registration",{message:"registration failed"})
        }

    }catch(error){
        console.log(error.message)
    }
}


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

module.exports={
    loadRegister,
    insertUser,
    verifyMail
}