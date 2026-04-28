import booking from "../models/booking.js"
import Car from "../models/car.js"
// function to check availability of car for giving date
const checkCarAvailability = async (Car, pickupDate,  returnDate) => {
    const bookings = await booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate }
    })
    return bookings.length === 0;
}

//API to check Availability of car for the given Data and location 
export const aheckCarAvailability = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;
        
        // fetch all cars available for the given location 
        const cars = await Car.find({ location, isAvailable: true });  

        // ceck car availability for the given data range using promise 
        const availableCarsPromises =
            cars.map(async (car) => {
                const isAvailable = await checkCarAvailability(car._id, pickupDate, returnDate);
                return {
                    ...car._doc, isAvailable : isAvailable
                }
            })

            let availableCars = await Promise.all(availableCarsPromises);
            
            availableCars = availableCars.filter(car => car.isAvailable === true)

            res.json({ success: true, availableCars });

        const available = await checkCarAvailability(car, pickupDate, returnDate);
        res.json({ available });
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
      

        //check if car is available for the given date
        const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Car is not available for the given date" })
        }
        const carData = await Car.findById(car)

        // calculate price based on the pickupDate and returnData
        const pickup = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((Math.abs(returned - pickup) / (1000 * 60 * 60 * 24)))
        const totalPrice = noOfDays * carData.pricePerDay;

        await booking.create({car, owner : carData.owner, user: _id, pickupDate, returnDate, price  })
       
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}