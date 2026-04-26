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
            folder: '/cars'
        })
        fs.unlinkSync(imageFile.path); // delete temp file after upload

        // optimization through imagekit URL transformation
        const optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { w: '1280', q: '80', f: 'webp' }
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

// API ti list Owner Cars 
export const getOwnerCars = async (req,res) =>{
    try{
        const {_id} = req.user;
        const cars = await Car.find({owner: _id})
        res.json({success: true, cars})
    }catch (error){
         console.log(error.message);
        res.json({success: false, message:error.message})
    }
}
// API to Toggle Car Availability 
export const toggleCarAvailability = async (req, res) =>{
    try{
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user 
        if (car.owner.toString() !== _id.toString() ){
            return res.json({success: false, message: "Unauthorized"});
        } 
        car.isAvailable = !car.isAvailable;
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    }catch (error){
         console.log(error.message);
        res.json({success: false, message:error.message})
    }

}

//Api to Delete Car

export const deleteCar = async (req, res) =>{
    try{
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user 
        if (car.owner.toString() !== _id.toString() ){
            return res.json({success: false, message: "Unauthorized"});
        } 
        car.owner = null;
        car.isAvailable = false;
        await car.save()

        res.json({success: true, message: "Car Removed"})
    }catch (error){
         console.log(error.message);
        res.json({success: false, message:error.message})
    }

}

//API to get Dashboard Data 
export const getDashboardData = async (req, res) => {
    try {
        const {_id, role} = req.user;
        
        if(role !== "owner"){
            return res.json({success: false, message: "Unauthorized"})
        }

        const cars = await Car.find({owner: _id});

        
    } catch (error){
        console.log(error.message);
        res.json({success: false, message:error.message})
    }

}