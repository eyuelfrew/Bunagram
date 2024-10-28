const express = require("express");

const searchUser = require("../controllers/SearchUsers.js");
const Logout = require("../auth/Logout.js");
const Login = require("../auth/Login.js");
const VerifyToken = require("../middleware/VerifyToken.js");
const CheckAuth = require("../auth/CheckAuth.js");
const RegisterUser = require("../controllers/RegisterUsers.js");
const VerifyAccount = require("../auth/VerifyEmail.js");
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
const TwoStepVerification = require("../auth/TwoStepVerification.js");
const SendToStepVerificationEmail = require("../controllers/TwoStepVerificationEmail.js");
const VerifyCloud = require("../auth/VerifyCloud.js");
const DisableTwo = require("../auth/DisableTwoStep.js");
const GetAllMessages = require("../controllers/message-controllers/GetAllMessages.js");
const SendMessage = require("../controllers/message-controllers/SendMessage.js");
const SendImage = require("../controllers/message-controllers/SendImage.js");
const multer = require("multer");
const path = require("path");
const FetchConversations = require("../controllers/conversation-controllers/FetchConversations.js");
const DeleteMessage = require("../controllers/message-controllers/DeleteMessage.js");
const UpdateMessage = require("../controllers/message-controllers/UpdateMessage.js");
const UserDetails = require("../controllers/UserDetails.js");
const ChangeCloudPass = require("../auth/ChangeCloudPass.js");
const UploadProfilePic = require("../controllers/ProflePic");
const DeleteConversation = require("../controllers/conversation-controllers/DeleteConversation.js");
const DeleteAccount = require("../controllers/users/DeleteAccount.js");
const DeleteAllMessages = require("../controllers/message-controllers/DeleteAllMessages.js");
const DeleteSelectedMessages = require("../controllers/message-controllers/DeleteSelectedMessages.js");
const GetBlockedUsers = require("../controllers/users/GetBlockedUsers.js");
const MessageVolumeData = require("../admin/dashbord/MessageVolumeData.js");
const UserStatus = require("../admin/dashbord/UsersStatus.js");
const ConversationData = require("../admin/dashbord/ConversationData.js");
const AllStatics = require("../admin/dashbord/OverAllData.js");
const CreateAdminAccount = require("../admin/auth/CreateAdminAccount.js");
const AdminLogin = require("../admin/auth/Login.js");
const checkAdmin = require("../admin/auth/checkAdmin.js");
const AdminLogout = require("../admin/auth/Logout.js");
const CheckAdminAuth = require("../admin/auth/CheckAdminAuth.js");
const router = express.Router();
/*
-- configure route for upoading images if there is image sent form the clinet side
*/
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
}).single("image");

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

// get user infromation
router.post("/user-info", VerifyToken, UserDetails);

// Enable two-step veerification
router.post("/two-step-verification", VerifyToken, TwoStepVerification);

// send two-step email verificatin code
router.post("/verify-backup-email", VerifyToken, SendToStepVerificationEmail);

// verify cloud password
router.post("/verify-cloud-password", VerifyToken, VerifyCloud);

// change cloud password
router.post("/change-cloud-pass", VerifyToken, ChangeCloudPass);

// disable two step-password
router.post("/disable-two-step", VerifyToken, DisableTwo);

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
router.get("/blocked-users", VerifyToken, GetBlockedUsers);

// Search users
router.post("/search", searchUser);

/*
--- Messaging routes
*/
router.post("/all-messages", VerifyToken, GetAllMessages); //fetch all messages
router.post("/create-message", VerifyToken, SendMessage); //create or send messge
router.post("/create-caption", VerifyToken, upload, SendImage); //send image with text or with out text
router.post("/del-msg", VerifyToken, DeleteMessage); // Delete single message
router.post("/del-multi-msg", VerifyToken, DeleteSelectedMessages); //delete selected messages
router.post("/update-msg", VerifyToken, UpdateMessage); // update single message
router.post("/profile-pic", VerifyToken, upload, UploadProfilePic); //upload or update profile pic
router.post("/delete-all-msg", VerifyToken, DeleteAllMessages); //upload or update profile pic

/*  
--- Conversation Routes 
*/
router.get("/conversations", VerifyToken, FetchConversations);
router.post("/delete-conversation", VerifyToken, DeleteConversation);

/*
--- Dashbord routes
*/
router.get("/message-volume", checkAdmin, MessageVolumeData);
router.get("/user-status", checkAdmin, UserStatus);
router.get("/conversation-data", checkAdmin, ConversationData);
router.get("/all-stats", checkAdmin, AllStatics);
/*
-- admins autentication
*/
router.post("/admin", CreateAdminAccount);
router.post("/admin-login", AdminLogin);
router.get("/admin", AdminLogout);
router.get("/admin-auth", checkAdmin, CheckAdminAuth);
module.exports = router;
