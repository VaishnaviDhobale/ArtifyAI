const { userModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const razorpay = require("razorpay");
const {transactionModel} = require("../model/transaction.model")

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details." });
    }

    // Check if a user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare the user data to be saved in the database
    const userData = { name, email, password: hashedPassword };

    // Save the new user to the database
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate a JWT token for the newly registered user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Respond with success and user details
    res.status(200).json({
      success: true,
      token,
      user: { name: user.name },
      message: "Signed Up",
    });
  } catch (error) {
    // Handle any server errors
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (isMatch) {
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json({
        success: true,
        token,
        user: { name: user.name },
        message: "Logged In",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    res.status(200).json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
    console.log({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.razorpay_api_key,
  key_secret: process.env.razorpay_api_secret,
});

// razorpay controller
const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const userData = await userModel.findById(userId);

    if (!userId || !planId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details." });
    }

    let credits, plan, amount, date;
    switch (planId) {
      case "Basic":
        (plan = "Basic"), (credits = 100), (amount = 10);
        break;
      case "Advanced":
        (plan = "Advanced"), (credits = 500), (amount = 50);
        break;
      case "Business":
        (plan = "Business"), (credits = 5000), (amount = 250);
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Plan not found." });
    }

    date= Date.now();
    const transactionData = {
      userId, plan, amount, credits, date
    }

    const newTransaction = await transactionModel.create(transactionData);
    
    const options={
      amount : amount*100,
      currency : process.env.CURRENCY,
      receipt: newTransaction._id,
    }
    await razorpayInstance.orders.create(options,(error,order)=>{
      if(error){
        console.log(error);
        return res.status(400).json({success : false, message:error.message})
      }

      res.status(200).json({success : true, order})
      
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async(req,res)=>{
   try{
    const {razorpay_order_id} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status==="paid"){
      const transactionData = await transactionModel.findById(orderInfo.receipt);
      if(transactionData.payment){
        return res.status(400).json({success : false, message:"Payment Failed."})
      }

      const userData = await userModel.findById(transactionData.userId);
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id,{creditBalance});
      await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true});
      res.status(200).json({success:true, message : "Credits Added."})
    }else{
      res.status(400).json({success:false, message : "Payment Failed."})
    }
   }catch(error){
    console.log(error);
    res.status(400).json({success:false, message:error.message});
   }
}
module.exports = {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay
};
