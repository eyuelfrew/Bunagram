import express from "express";
import registerUser from "../controllers/RegisterUsers.js";
import checkEmail from "../controllers/CheckEmail.js";
import checkPassword from "../controllers/CheckPassowrd.js";
import useDetails from "../controllers/userDetails.js";
import UpdateUser from "../controllers/userUpdate.js";
import searchUser from "../controllers/SearchUsers.js";
import Logout from "../auth/Logout.js";
import Login from "../auth/Login.js";
const router = express.Router();

//create users api
router.post("/register", registerUser);

//login
router.post("/login", Login);

//logout
router.get("/logout", Logout);

//check email
router.post("/check-email", checkEmail);

//check passord
router.post("/check-password", checkPassword);

//login in user details
router.get("/user-detail", useDetails);

//edit user information
router.put("/edit-info", UpdateUser);

//searh users
router.post("/search", searchUser);
export default router;
