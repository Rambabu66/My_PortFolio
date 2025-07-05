const express = require('express')
const { register, login } = require('../controller/authController')


const router = express.Router()

router.post("/register",register)
router.post('/login', login); // Add the login route



module.exports = router