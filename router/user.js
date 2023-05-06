const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const {
  userSignUp,
  userSignIn,
  userDetails,
  userDetailsUpdate,
  getUserData,
  messageFromUser,
  userLogout,
  addAnswerToUser,
  getAnswers,
  verifyMail,
  forgetPassword,
  verifyPassword,
  resetPassword,
  sendVerificationLink
} = require("../controller/user");




// router.route("/").post(userSignUp);
router.route("/signup").post(userSignUp);
router.route("/signin").post(userSignIn);
router.route("/about").get(authenticate, userDetails);
router.route("/about").patch(authenticate, userDetailsUpdate);
router.route("/getUserData").get(authenticate, getUserData);
router.route("/contact").post(authenticate, messageFromUser);
router.route("/logout").get(authenticate, userLogout);
router.route("/answer").post(authenticate, addAnswerToUser);
router.route("/getAnswers").get(authenticate, getAnswers);
router.route('/verify').get(verifyMail);
router.route('/forget').post(forgetPassword);
router.route('/forget-password').patch(verifyPassword)
router.route('/forget-password').post(resetPassword);
// for verification send mail link
router.route('/verification').post(sendVerificationLink)


module.exports = router;
