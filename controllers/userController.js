import User from "../configs/models/User.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import imagekit from "../configs/imageKit.js"
import fs from "fs"

// Generate JWT Token 
const generateToken = (userId) => {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET);
}


//Register User
export const registerUser = async (req, res)=>{
    try{
        const {name, email, password} = req.body

        if(!name || !email || password.length < 8) {
            return res.json({sucess:false, message: "Please fill all the fields"})
        }

        const userExists = await User.findOne({email}) 
        if(userExists){
            return res.json({sucess:false, message: "user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
//Login User

export const loginUser = async (req, res)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({sucess:false, message: "Invalid credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({sucess:false, message: "Invalid credentials"})
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) => {
    try{
        const {user} = req;
        res.json({success: true, user}) 

    }catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    } 
    
}

// Update User Profile Image
export const updateUserImage = async (req, res) => {
    try {
        const {_id} = req.user;
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })
        fs.unlinkSync(imageFile.path);

        const image = imagekit.url({
            path: response.filePath,
            transformation: [{ w: '400', q: '80', f: 'webp' }]
        })

        await User.findByIdAndUpdate(_id, {image})
        res.json({success: true, message: "Image Updated", image})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
