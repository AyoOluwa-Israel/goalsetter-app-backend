const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware")

const { registerUser, loginUser, getUser } = require("../controllers/userController");

router.route("/").post(registerUser).get(protect, getUser)

// router.post("/", registerUser);
router.post("/login", loginUser);


module.exports = router;
