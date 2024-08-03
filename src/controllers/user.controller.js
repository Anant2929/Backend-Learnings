import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - empty
    //check if user already exist - usernamer and email
    //check for images and avatar
    //upload them to clodinary
    //create user object and create entry in db
    //remove password and token field from response
    //check for user creation
    //return res


    //step-1)getting user details from frontend
    const { fullName, email, username, password } = req.body
    console.log(req.body);

    //step-2)Validatiing for emptyness of the fields
    if([ fullName, email, username, password].some((field)=>field?.trim() === "")){
        throw new ApiError(400 , "All fields are required");
    }

    //step-3)checking user allready existing
    const existedUser = await User.findOne({
        $or:[{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409 , "User with email or username already exist")
    }


    //step-4)Handling Images
    //Images ke liye humne route me hi ek middleware lagaya hai
    //wo middleware jo reqest aa rhi hai usi ko thoda modify karega aur usme ek file dal kar req bhejega
    // to un images ke liye hume wahi files chahiye

   const avatarLocalPath =  req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage[0]?.path

   //now multer ne jo req me upload kiya tha wo to humne le liya but fhir bhi
   //ek bar check kar lete hai ki wo actual me aaya bhi hai ya nahi

   if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar Image is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   //ek bar fhir se check kar lete hai database me dalne se pehle ki hume avatar and
   //coverImage ka url cloudinary se mil bhi gya hai ya nahi
   if(!avatar){
    throw new ApiError(400 , "Avatar Image is required")
   }

   //Step-5)Creating User in DB
   const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })


   //Step-6)
   //Now lets check ki user name ki entry bani bhi hai ya nahi bani DB me

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   //Mongodb har registered user ki ek unique id create karta hai jisko _id se represent kara jata hai

   //Step-7)Checking for user creation
   if(!createdUser){
    throw new ApiError(500 , "something went wrond while registering the user")
   }


   //step-8)
   return res.status(201).json(
    new ApiResponse(200 , createdUser,"User Registered Successfully")
   )


})

export { registerUser }