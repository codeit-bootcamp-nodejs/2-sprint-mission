//컨트롤러가 호출할 비즈니스 로직 분리
//회원가입 서비스 
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/token';
import * as userRepository from '../repositories/user.repository';
import { BadRequest } from '../errors/customError';
import { SignupInput } from '../types/users'; // 타입 선언이 되어 있다면


export const signup = async ({ email, nickname, password }: SignupInput) => {
  const existsByEmail = await userRepository.findByEmail(email);
  if (existsByEmail) {
    throw new BadRequest('이미 사용 중인 이메일입니다.');
  }

  const existsByNickname = await userRepository.findByNickname(nickname);
  if (existsByNickname) {
    throw new BadRequest('이미 사용 중인 닉네임입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    email,
    nickname,
    password: hashedPassword,
  });

  const tokens = generateTokens(user.id);

  const { password: _, ...safeUser } = user;

  return {
    message: '회원가입 완료',
    user: safeUser,
    tokens,
  };
};

// 로그인 서비스
export const login = async ({ email, password }: LoginInput) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new BadRequest('존재하지 않는 사용자입니다.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new BadRequest('비밀번호가 일치하지 않습니다.');
  }

  const tokens = generateTokens(user.id);
  const { password: _, ...safeUser } = user;

  return {
    message: '로그인 성공',
    user: safeUser,
    tokens,
  };
};

// 내 정보 조회 서비스
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prismaClient.user.create({
    data: { email, nickname, password: hashedPassword }
  });

  const tokens = generateTokens(user.id);
  const { password: _, ...safeUser } = user;


  //로그인 서비스
  export const login = async ({ email, password }) => {
  const user = await prismaClient.user.findUnique({ 
    where: { email } 
  });
  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
  }

const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
  return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
}
 
    const { accessToken, refreshToken } = generateTokens(user.id);
    const { password: _, ...safeUser } = user;

 return{
    message: '로그인 성공',
    user: safeUser,
    tokens: { accessToken, refreshToken }
 };
}

// 내 정보 조회 서비스
import  { findById } from '../repositories/user.repository';

export const getMyProfile = async (userId: number) => {
  const user = await findById(userId);  
  if (!user) throw new Error('사용자를 찾을 수 없습니다.');

  const { password, ...safeUser } = user;
 return safeUser;
};

// 내 정보 수정 서비스
 if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(updates.password, salt);
  }
  const updated = await updateById(userId, updates); 
  const { password, ...safeUser } = updated;
return safeUser;

// 회원 탈퇴 서비스
import { deleteById } from '../repositories/user.repository';

export const deleteUser = async (userId: number) => {
  await deleteById(userId);
};

