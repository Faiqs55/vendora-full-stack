const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const { productRouter } = require("./routes/productRoutes");
const { orderRouter } = require("./routes/orderRoutes");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


// MIDDLEWARE 
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true,
  }));

// DATABASE CONNECTION 
connectDB();

// ROUTES 
app.use("/api/auth", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter)


app.listen(port, () => console.log(`Server is running on PORT: ${port}`));