const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/USERMANAGMENTSYSTEM');


const express = require("express")
const app =  express()
const port = 3000


const userRoutes = require("./routes/userRoutes")
app.use("/",userRoutes)

const adminRoutes = require("./routes/adminRoutes")
app.use("/admin",adminRoutes)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


