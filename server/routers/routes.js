const express = require("express");

const searchUser = require("../controllers/SearchUsers.js");
const Logout = require("../auth/Logout.js");
const Login = require("../auth/Login.js");
const VerifyToken = require("../middleware/VerifyToken.js");
const CheckAuth = require("../auth/CheckAuth.js");
const RegisterUser = require("../controllers/RegisterUsers.js");
const VerifyAccount = require("../auth/VerifyEmail.js");
const DeleteAccount = require("../controllers/DeleteAccount.js");
const {
  CheckUserName,
  EditBio,
  EditUserName,
  UpdateName,
} = require("../controllers/UpdateUser.js");
const ForgotPassword = require("../auth/ForgotPassword.js");
const ResetPassword = require("../auth/ResetPassword.js");
const BlockUser = require("../controllers/BlockUser.js");
const UnblockUser = require("../controllers/UnblockUser.js");
const UpdateProfilePicture = require("../controllers/UpdateProfilePic.js");
const DeleteProfilePic = require("../controllers/Profile Picture/DeleteProfilePicture.js");

const router = express.Router();

// Checking if user is verified
router.get("/check-auth", VerifyToken, CheckAuth);

// Create users API
router.post("/register", RegisterUser);

// Login
router.post("/login", Login);

// Logout
router.get("/logout", Logout);

// Verify email
router.post("/verify-email", VerifyAccount);

// Forgot password
router.post("/forgot-pass", ForgotPassword);

// Reset password
router.post("/reset-password/:token", ResetPassword);

// Block user
router.post("/block-user", VerifyToken, BlockUser);

// Unblock user
router.post("/unblock-user", VerifyToken, UnblockUser);

/*
--- Update User Information End-Points
*/

router.put("/update-name", VerifyToken, UpdateName);
router.post("/update-bio", VerifyToken, EditBio);
router.post("/update-user-name", VerifyToken, EditUserName);
router.post("/check-user-name", CheckUserName);
router.delete("/del-acc/:id", VerifyToken, DeleteAccount);
router.post("/update-pp", VerifyToken, UpdateProfilePicture);
router.delete("/delete-profile/:user_id", VerifyToken, DeleteProfilePic);

// Search users
router.post("/search", searchUser);

module.exports = router;
