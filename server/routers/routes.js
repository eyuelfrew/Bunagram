import express from "express";
import registerUser from "../controllers/RegisterUsers.js";
import checkEmail from "../controllers/CheckEmail.js";
import checkPassword from "../controllers/CheckPassowrd.js";
import useDetails from "../controllers/userDetails.js";
import logout from "../controllers/Logout.js";
import UpdateUser from "../controllers/userUpdate.js";
import searchUser from "../controllers/SearchUsers.js";
import login from "../controllers/login.js";
const router = express.Router();

//create users api
router.post("/register", registerUser);

//login
router.post("/login", login);

//check email
router.post("/check-email", checkEmail);

//check passord
router.post("/check-password", checkPassword);

//login in user details
router.get("/user-detail", useDetails);

//logout
router.get("/logout", logout);

//edit user information
router.put("/edit-info", UpdateUser);

//searh users
router.post("/search", searchUser);
export default router;
