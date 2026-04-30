import Booking from "../configs/models/Booking.js"
import Car from "../configs/models/Car.js"

// function to check availability of car for giving date
const checkCarAvailability = async (carId, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car: carId,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate }
    })
    return bookings.length === 0;
}

//API to check Availability of car for the given Date and location 
export const checkCarAvailabilityAPI = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;
        
        // fetch all cars available for the given location 
        const cars = await Car.find({ location, isAvailable: true });  

        // check car availability for the given date range using promise 
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkCarAvailability(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable }
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true) 
        res.json({ success: true, availableCars });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//API to create booking 
export const createBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const { car, pickupDate, returnDate, location } = req.body;
      
        // check if car is available for the given date
        const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Car is not available for the given date" })
        }
        const carData = await Car.findById(car)

        // calculate price based on the pickupDate and returnDate
        const pickup = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((Math.abs(returned - pickup) / (1000 * 60 * 60 * 24)))
        const price = noOfDays * carData.pricePerDay;

        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})
        res.json({ success: true, message: "Booking Created Successfully" })
       
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//API to List User Bookings 
export const getUserBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user: _id}).populate("car").populate("owner").sort({createdAt: -1})
        res.json({ success: true, bookings })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to get owner bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if(req.user.role !== "owner"){
            return res.json({success: false, message: "Unauthorized"})
        }
        const bookings = await Booking.find({owner: req.user._id}).populate("car user").select("-user.password")
        .sort({createdAt: -1})
        res.json({ success: true, bookings })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to change booking status 
export const changeBookingStatus = async (req, res) => {
    try {
       const {_id} = req.user;
       const {bookingId, status} = req.body

       const bookingDoc = await Booking.findById(bookingId)

       if(bookingDoc.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }

        bookingDoc.status = status;
        await bookingDoc.save();

        res.json({ success: true, message: "Booking Status Updated" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
