// not use, but do not delete this just in case

import { RequestHandler } from "express";

const stateValidator: RequestHandler = async function (req, res, next) {
    const { code, state } = req.query;
    const storedState = req.cookies.discord_oauth_state;
    if (!state || state !== storedState) {
        res.status(403).json({ message: 'Invalid state (CSRF suspected)' });
        return;
    }

    next();
};

export default stateValidator;