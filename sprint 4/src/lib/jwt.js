import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1시간 만료
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}