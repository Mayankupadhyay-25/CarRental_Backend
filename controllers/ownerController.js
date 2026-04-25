import Car from "../configs/models/Car.js";
import imagekit from "../configs/imageKit.js";
import User from "../configs/models/User.js"
import fs from "fs"

export const changeRoleToOwner = async (req, res) =>{
    try{
        const {_id} =req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"}) 
        res.json({success: true, message: "now you can list cars"})
    }catch (error){
        console.log(error.message);
        res.json({success: false, message:error.message})

    }

}
// API to list car

export const addCar = async (req, res) =>{
    try{
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        //upload Image through to ImageKit 
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder:'/cars'
        })

// optimization through imagekit URL transformation
const optimizedImageURL = imagekit.url({
    path: response.filePath,
   
    transformation : [
        {width : '1280'},
        {quality: 'auto'},// auto compression 
        {format: 'webp'}// convert to modern format
        ]  
});
    const image = optimizedImageURL;
    await Car.create({...car, owner: _id, image})
    res.json({success: true, message: "Car Added", image})

    }catch(error){
        console.log(error.message);
        res.json({success: false, message:error.message})
    }
}