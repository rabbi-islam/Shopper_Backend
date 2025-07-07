const express = require("express")
const router = express.Router() 
const { registerUser,loginUser }  =  require("../controllers/user_contoller.js")
const catchAsync = require("../utils/catch_error.js")
const {validateUserReg, validateUserLogin } = require("../validator/auth_validator.js")
const handleValidationErrors = require("../utils/validation_error_handler.js")



router.post("/registration",validateUserReg,handleValidationErrors,catchAsync(registerUser))
router.post("/login",validateUserLogin,handleValidationErrors, catchAsync(loginUser))


module.exports = router