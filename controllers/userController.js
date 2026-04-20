import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

// Generate JWT Token 
const generatoken = userID;
const payload = userId;
return jwt.sign(payload, process.env.JWT_SECRET)


//Register User
export const registerUser = async (req, res)=>{
    try{
        const {name, email, password} = req.body

        if(!name || !email || !password.length < 8) {
            return res.json({sucess:false, message: "Please fill all the fields"})
        }

        const userExists = await User.findOne({email}) 
        if(userExists){
            return res.json({sucess:false, message: "user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.creat({name, email, password: hashedPassword})
        const toaken = generatoken(user._id.toString())
        res.json({sucess: true,token})



    } catch (error) {
        console.log(error.message);
        res.json({sucess:false, message})
        
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
        const token = generatoken(user._id.toString())
        res.json({sucess:true, token})

    } catch (error) {
        console.log(error.message);
        res.json({sucess:false, message: error.message})
        
    }
}
