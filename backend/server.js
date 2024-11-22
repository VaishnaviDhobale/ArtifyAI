const express =  require("express");
const cors=  require ("cors");
require("dotenv").config();
const {connectDB} =  require("./config/mongodb.js");
const { userRouter }= require("./routes/user.routes.js");
const { imageRouter } = require("./routes/image.routes.js");

const PORT = process.env.PORT || 4000;
const app = express();

// predefine middlewares
app.use(express.json());
app.use(cors());

//routers
app.use("/api/user", userRouter);
app.use("/api/image",imageRouter); 

// Start express app
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log(`Database connection error ${error}`);
  }
});
