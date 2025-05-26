 var errorHandler = (err, req, res, next) => {

 console.error(err); 

  if (err.name === 'StructError') {
    return res.status(400).json({
      error: '입력값이 올바르지 않습니다.',
      message: err.message
    });
  }

  res.status(500).json({
    error: '서버 오류',
    message: err.message || '알 수 없는 오류'
  });
 };

 module.exports = errorHandler;