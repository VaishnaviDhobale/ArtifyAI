const express = require("express");
const {generateImage} = require("../controllers/image.controllers");
const {userAuth} = require("../middlewares/auth.middlewares.js")

const imageRouter = express.Router();
imageRouter.post("/generateImage",userAuth,generateImage);

module.exports = {
    imageRouter
}