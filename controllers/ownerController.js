import Car from "../configs/models/Car.js";
import imagekit from "../configs/imageKit.js";
import Booking from "../configs/models/Booking.js";
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

        // map frontend field names to model field names
        const carData = {
            brand: car.brand,
            model: car.model,
            year: car.year,
            pricePerDay: car.priceperday,
            category: car.category,
            transmission: car.transmission,
            fuel_type: car.fuel_type || car.fuelType,
            seating_capacity: car.seating_capacity,
            location: car.location,
            description: car.description,
        }

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
        await Car.create({...carData, owner: _id, image})
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

        if(!carId) return res.json({success: false, message: "Car ID is required"})

        const car = await Car.findById(carId)

        // Checking is car belongs to the user 
        if (car.owner.toString() !== _id.toString()) {
            return res.json({success: false, message: "Unauthorized"});
        } 
        await Car.findByIdAndDelete(carId)
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
        const bookings = await Booking.find({owner: _id}).populate("car").sort({createdAt: -1});

        const pendingBooking = await Booking.find({owner: _id, status: "pending"})
         const completedBooking = await Booking.find({owner: _id, status: "pending"})

         // calculate the monthly revenue from bookings where ststus is confirmed 
         const monthlyRevenue = bookings.slice().filter (booking => booking.status === "confirmed" ).reduce(
            (acc, booking ) =>acc + booking.price, 0)
             
                const dashboardData = {
                    totalCars: cars.length,
                    totalBookings: bookings.length,
                    pendingBookings: pendingBooking.length,
                    completedBookings: completedBooking.length,
                    recentBookings: bookings.slice(0, 3),
                    monthlyRevenue: monthlyRevenue
                }
                
                res.json({success: true, dashboardData})
           
    } catch (error){
        console.log(error.message);
        res.json({success: false, message:error.message})
    }

}

// api to update user image 
export const updateUserImage = async (req, res) => {
    try{
         const {_id } = req.user;

         const imageFile = req.file;

        //upload Image through to ImageKit 
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })
        fs.unlinkSync(imageFile.path); // delete temp file after upload

        // optimization through imagekit URL transformation
        const optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { w: '400', q: '80', f: 'webp' }
            ]
        });
        const image = optimizedImageURL;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated"})

    }catch(error) {
        console.log(error.message);
        res.json({success: false, message:error.message})
    }
}