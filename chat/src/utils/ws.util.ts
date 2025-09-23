import { IncomingMessage } from 'http';
import { verifyAccessToken } from './jwt.util';
import { Payload } from '../types/auth.type';

export const verifyWebSocketAuthorization = async (req: IncomingMessage): Promise<Payload> => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid token');
  }

  const token = authHeader.split(' ')[1];
  try {
    return verifyAccessToken(token);
  } catch {
    throw new Error('Unauthorized: Invalid token');
  }
};
