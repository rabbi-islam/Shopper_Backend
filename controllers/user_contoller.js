const bcryptjs = require('bcrypt');
const { throwError } = require("../utils/throw_error")
const UserModel = require("../models/user_model");
const generateNewTokens = require("../utils/generate_new_token");





const registerUser = async (req, res, next) => {
    const { fullName, email, password } = req.body;

       
        let exits_user = await UserModel.findOne({ email: email }).select('-password');
        
        if (exits_user) throwError("User Already Exists!", 409)
        
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        
        const newUser = await UserModel.create({
            fullName, 
            email, 
            password: hashedPassword
        });
      

        
        const userResponse = newUser.toObject();
        delete userResponse.password

        return res.status(201).json({
            statusCode:201,
            success: true,
            message: "Registration successful",
            user: userResponse
        });

    
}



const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    
        const user = await UserModel.findOne({ email: email }).select('+password'); 
        
        if (!user) throwError("User not found",409)

        
        const isMatch = await bcryptjs.compare(password, user.password);
        
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Wrong Credential."
            });
        }
        
        // Convert the user to an object and remove the password field
        const userResponse = user.toObject();
        delete userResponse.password;

        // Generate tokens
        const tokens = generateNewTokens(user);
        
        return res.json({
            success: true,
            user: userResponse,
            accessToken:tokens.accessToken,
            refreshToken:tokens.refreshToken

        });

    }
// const refreshToken = async (req, res) => {
//     const { refreshToken } = req.body; 


//     if (!refreshToken) throwError("Refresh token is required.", 401)

//     try {
//         // Verify the refresh token
//         const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

//         const user = await UserModel.findById(decoded._id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found." });
//         }

//         // Generate new access and refresh tokens
//         const tokens = generateNewTokens(user);

//         return res.json({
//             success: true,
//             accessToken: tokens.accessToken,
//             refreshToken: tokens.refreshToken
//         });

//     } catch (error) {
//         console.error("Error in refreshing token:", error);
//         if (error.name === 'TokenExpiredError') {
//             return res.status(403).json({ success: false, message: "Refresh token expired." });
//         }
//         return res.status(403).json({ success: false, message: "Invalid refresh token." });
//     }
// };

// const updateUser = async (req, res, next) => {


//     if (handleValidationErrors(req, res)) return;

//     const { fullName, email } = req.body;
//     const userId = req.user._id; 

        
//         const user = await UserModel.findById(userId);

//         if (!user) throwError("User not found", 400)

//         if (fullName) user.fullName = fullName;
//         if (email) user.email = email;

//         await user.save();

//         const updatedUser = user.toObject();
//         delete updatedUser.password;

//         return res.status(200).json({
//             success: true,
//             message: "User updated successfully",
//             user: updatedUser
//         });

    
// };
// const profile = async (req, res, next) => {

//     const history = await orderModel.find({ orderBy: req.user._id }).populate('bookId')
//     if (!history) throwError("User history found",409)

//     return res.status(200).json({
//         success: true,
//         user: req.user,
//         history: history
//     });

// }


module.exports = { registerUser, loginUser};