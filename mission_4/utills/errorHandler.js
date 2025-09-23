export const notFoundErrorHandeler = (req, res, next) => {
  res.status(404).send('요청하신 주소를 찾을 수 없습니다.');
};

export const errorHandler = (err, req, res, next) => {
  console.log('****************************에러발생!****************************');
  console.log(err);
  res.status(err.status || 500).send('ERROR: ' + err.message);
};


