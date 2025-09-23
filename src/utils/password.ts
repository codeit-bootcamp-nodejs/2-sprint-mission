import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './const';

/**
 * @description 비밀번호 해시화 함수
 *
 * @param {string} password - 입력 받은 비밀번호
 * @returns {Promise<string>} - 해시된 비밀번호
 * 
 * @example const hashedPassword = await hashPassword('mySecretPassword');
 */
const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('비밀번호 해시화 중 오류가 발생했습니다.')
  }
}

/**
 * @description 비밀번호 검증 함수
 *
 * @param {string} password - 입력 받은 비밀번호
 * @param {string} hashedPassword - DB에 저장된 비밀번호(해싱된 값)
 * @returns {Promise<boolean>} - 비밀번호가 일치하는지 여부
 *  
 * @example const isMatch = await comparePassword('mySecretPassword', hashedPassword);
 */
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('비밀번호 비교 중 오류가 발생했습니다.')
  }
}

export {
  hashPassword,
  comparePassword
}