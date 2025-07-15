import { body, validationResult } from 'express-validator';
const validateEmail = body('email')
                        .isEmail()
                        .withMessage('Please enter a valid email address.')
                        // .normalizeEmail() // Optional: normalize the email address


export {
    validateEmail
};