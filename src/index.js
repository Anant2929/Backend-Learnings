// require('dotenv').config({path:'./env'}) it breaks the consistency of code because at some places we are 
//using import and here require thats why we will use import here in this case also
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("Mongo Db COnnection Failed !!!", err);

})


/*
import express from "express"

const app = express();

//Always remember Database is in another content opr at another place so it takes time in connecting with 
//the database , therefore we use async await here

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    
        app.on("error" , (error) =>{
            console.log("error: " , error);
            throw error
        })

        app.listen(process.env.PORT , () =>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
        
    } catch (error) {
        console.error("error: " , error)
        throw error
    }
})()
This was our first approach lets move on to othe better aproach in we make another file for this and 
write this stuff there so that we can maintain cleanliness of the code
*/