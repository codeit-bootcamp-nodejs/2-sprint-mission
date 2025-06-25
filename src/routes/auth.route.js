const express = require('express');
const { registerUserController } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', registerUserController);

module.exports = router;
