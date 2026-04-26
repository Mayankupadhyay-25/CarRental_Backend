import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: true},
    category: {type: String, default: ''},
    seating_capacity: {type: Number, default: 0},
    fuel_type: {type: String, default: ''},
    transmission: {type: String, default: ''},
    pricePerDay: {type: Number, default: 0},
    location: {type: String, default: ''},
    description: {type: String, default: ''},
    isAvailable: {type: Boolean, default: true},
},{
    timestamps: true
})

const Car = mongoose.model("Car", carSchema)

export default Car
