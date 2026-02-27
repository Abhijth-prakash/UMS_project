const db = require('./db/mongodb')
const express = require("express")


const app =  express()
const port = 3000

//mongodb connection
db.connection()


//user Routes
const userRoutes = require("./routes/userRoutes")
app.use("/",userRoutes)


//admin Routes
const adminRoutes = require("./routes/adminRoutes")
app.use("/admin",adminRoutes)



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


