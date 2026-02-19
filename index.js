const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/USER MANAGMENT SYSTEM");


const express = require("express")
const app =  express()
const port = 3000


const userRoutes = require("./routes/userRoutes")
app.use("/",userRoutes)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


