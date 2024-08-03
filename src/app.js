import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(cors())
//cors is an middleware -> cross origin resource sharing , whenever we want to configure any middleware we do app.use
//but also we can give option in the cors , lets see that

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Importing Routes -> yaha par import kar rhe hai niche because industries me ese hi hota hai ab iska reason jan na khud kyu hota hai esa
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users" , userRouter)


export default app