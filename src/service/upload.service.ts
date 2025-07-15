import path from 'path';
import { STATIC_PATH } from '../lib/constants';

export const uploadService = {
  getFileUrl: (req: Express.Request, filename: string): string => {
    const host = req.get('host');
    if (!host || !filename) {
      throw new Error('파일 정보가 없습니다.');
    }

    return `http://${path.join(host, STATIC_PATH, filename)}`;
  },
};
