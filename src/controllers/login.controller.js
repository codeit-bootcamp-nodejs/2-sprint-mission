const { loginService } = require('../services/login.service');

exports.loginController = async (req, res, next) => {
    try {
        const result = await loginService(req.body);
        return res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};
