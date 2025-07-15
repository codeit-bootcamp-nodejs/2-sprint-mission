//Prisma 쿼리 전용 모듈로 분리
//회원가입 레퍼지토리
export const findByEmail = async (email: string) => {
  return prismaClient.user.findUnique({ where: { email } });
};

export const findByNickname = async (nickname: string) => {
  return prismaClient.user.findFirst({ where: { nickname } });
};

export const createUser = async (data: { email: string, nickname: string, password: string }) => {
  return prismaClient.user.create({ data });
};

//내 정보 조회 레퍼지토리
export const findById = (id: number) => {
  return prismaClient.user.findUnique({ where: { id } });
};

//내 정보 수정 레퍼지토리
export const updateById = (id: number, updates: any) => {
  return prismaClient.user.update({
    where: { id },
    data: updates,
  });
};

//회원 탈퇴 레퍼지토리
export const deleteById = (id: number) => {
  return prismaClient.user.delete({ where: { id } });
};
