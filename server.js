import express from "express";
import "dotenv/config";
import cors from "cors"; //Cross-Origin Resource Sharing/ It is a browser security feature that blocks requests from different origins
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";

//Initialize express app
const app = express();

// connect Database
await connectDB()

//Middleware
app.use(cors());
app.use(express.json()); //Parse incoming JSON requests and put the parsed data in req.body

app.get("/", (req, res) =>res.send ("Server is running"))
app.use("/api/users", userRouter)
app.use("/api/owners", ownerRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));