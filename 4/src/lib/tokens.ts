import jwt from 'jsonwebtoken';
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
} from './staticConsts';

function generateToken(
    userId: string, 
    tokenType: "accessToken" | "refreshToken"
){
    if(tokenType === "accessToken") return jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '5h',
    });
    else return jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
}

export {
    generateToken
};