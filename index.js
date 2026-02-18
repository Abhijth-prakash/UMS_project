const mongoose = require("mongoose");
mongoose.connect(" mongodb://127.0.0.1:27017/USER MANAGMENT SYSTEM");


const express = require("express")
const app =  express()
const port = 3000

app.listen(port,()=>{
    console.log("server is running....")
})
