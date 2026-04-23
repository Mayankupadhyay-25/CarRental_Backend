import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    owner: {type: String, required: true},
    brand: {type: String, required: true},
    Model: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: true},
    Category: {type: String, default: true},
    seating_capacity: {type: Number, default: true},
    transmission: {type: String, default: true}, 
    pricePerDay: {type: Number, default: true},
    location: {type: String, default: true},
    discription: {type: String, default: true},
    isAvailable: {type: Boolean, default: true},
},{
    timestamps: true
    })
    const Car = mongoose.model("Car", carSchema)     

     export default Car