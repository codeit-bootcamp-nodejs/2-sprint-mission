module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma: 리소스 없음

  if (err.code === 'P2025') {
    return res.status(404).json({ message: '해당 리소스를 찾을 수 없습니다.' });
  }

  // 사용자 입력 에러
  
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  // 서버 오류
  
  res.status(500).json({
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};