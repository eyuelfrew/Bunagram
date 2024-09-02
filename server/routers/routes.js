import express from "express";

import searchUser from "../controllers/SearchUsers.js";
import Logout from "../auth/Logout.js";
import Login from "../auth/Login.js";
import VerifiyToken from "../middleware/VerifyToken.js";
import CheckAuth from "../auth/CheckAuth.js";
import RegisterUser from "../controllers/RegisterUsers.js";
import VerifyAccount from "../auth/VerifyEmail.js";
import DeleteAccount from "../controllers/DeleteAccount.js";
import {
  CheckUserName,
  EditBio,
  EditUserName,
  UpdateName,
} from "../controllers/UpdateUser.js";
import ForgotPassword from "../auth/ForgotPassword.js";
import ResetPassword from "../auth/ResetPassword.js";
import BlockUser from "../controllers/BlockUser.js";
import UnblockUser from "../controllers/UnblockUser.js";
import UpdateProfilePicture from "../controllers/UpdateProfilePic.js";
import DeletProfilePic from "../controllers/Profile Picture/DeleteProfilePicture.js";
const router = express.Router();

// checking if user is verifyed
router.get("/check-auth", VerifiyToken, CheckAuth);

//create users api
router.post("/register", RegisterUser);

//login
router.post("/login", Login);

//logout
router.get("/logout", Logout);

//verify email
router.post("/verifiy-email", VerifyAccount);

// forgot password
router.post("/forgot-pass", ForgotPassword);

// reset password
router.post("/reset-password/:token", ResetPassword);

// block user
router.post("/block-user", VerifiyToken, BlockUser);

//unblock users
router.post("/unblock-user", VerifiyToken, UnblockUser);

/*
--- Update User Inforation End-Points
*/

router.put("/update-name", VerifiyToken, UpdateName);
router.post("/update-bio", VerifiyToken, EditBio);
router.post("/update-user-name", VerifiyToken, EditUserName);
router.post("/check-user-name", CheckUserName);
router.delete("/del-acc/:id", VerifiyToken, DeleteAccount);
router.post("/update-pp", VerifiyToken, UpdateProfilePicture);
router.delete("/delete-profile/:user_id", VerifiyToken, DeletProfilePic);

//searh users
router.post("/search", searchUser);
export default router;
