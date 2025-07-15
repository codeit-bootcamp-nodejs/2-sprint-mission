const express = require('express');
const router = express.Router();

// cannot use json causing error!!
// router.get('/', (req, res) => {
//     res.json({ status: 'OK' });
// });

// https://hyperping.com/blog/how-to-add-a-nodejs-health-check-endpoint-using-express
router.get('/', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    };

    res.status(200).send(data);
});

module.exports = router;