import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    car:{type: isObjectId, ref: "Car", required: true},
    user:{type: isObjectId, ref: "User", required: true},
    Owner:{type: isObjectId, ref: "Car", required: true},
    pickupDate : {type: Date, required: true},
    returnDate : {type: Date, required: true},
    status: {type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'},
    price : {type: Number, required: true},
    
   
   
    timestamps: true
})

const Booking = mongoose.model("Booking", bookingSchema)

export default Car
