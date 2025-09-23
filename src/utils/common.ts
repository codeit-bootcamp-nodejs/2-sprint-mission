// 유효한 ID 확인
export const getValidatedId = (validatedId: number) => {
  const validationId = Number(validatedId);

  if (!validationId || isNaN(validationId)) {
    throw new Error('유효하지 않은 ID 입니다.');
  }

  return validationId;
};
