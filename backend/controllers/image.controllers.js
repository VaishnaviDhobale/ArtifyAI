const axios = require("axios");
const { userModel } = require("../model/user.model");
const FormData = require("form-data");

const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    // do not generate image when credit balance is 0
    if (parseInt(user.creditBalance) === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No Credit Balance",
          creditBalance: user.creditBalance,
        });
    }

    const formData = await new FormData();
    await formData.append("prompt", prompt);

    // Send request to Clipdrop API
    const formHeaders = formData.getHeaders();
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formHeaders,
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: 'arraybuffer'
      }
    );

    const base64Image = Buffer.from(data, 'binary').toString('base64');
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Update user's credit balance
    await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });
    const updatedUser = await userModel.findById(user._id); // Fetch updated user data

    res.status(200).json({
      success: true,
      message: 'Image generated',
      creditBalance: updatedUser.creditBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateImage
};
