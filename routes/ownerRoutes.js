import express from "express";
import { addCar, getOwnerCars, toggleCarAvailability, deleteCar, getDashboardData } from "../controllers/ownerController.js";
import { updateUserImage } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
 

const ownerRouter = express.Router();

// Removed change-role endpoint - only predefined owner can access owner features
ownerRouter.post("/add-car", upload.single("image"), protect, addCar)  
ownerRouter.get("/cars", protect, getOwnerCars)
ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
ownerRouter.post("/delete-car", protect, deleteCar)
ownerRouter.get("/dashboard", protect, getDashboardData)
ownerRouter.post('/update-image', upload.single('image'), protect, updateUserImage)




 export default ownerRouter;