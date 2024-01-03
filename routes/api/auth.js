const express = require('express');
const router = express.Router();
const validation = require('../../middlewares/contactValidation');
const { registerScheme, loginScheme } = require('../../scheme/users');
const authenticate = require('../../helpers/authenthicate');
const { register, logIn, logOut, current } = require('../../controllers/auth');

router.post('/register', validation(registerScheme), register)

router.post('/login', validation(loginScheme), logIn)

router.post('/logout', authenticate, logOut)

router.get('/current', authenticate, current)

module.exports = router;