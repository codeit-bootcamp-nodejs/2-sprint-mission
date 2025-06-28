const errorMessages = {
  400: "잘못된 요청입니다.",
  401: "비밀번호가 틀렸습니다.",
  403: "권한이 없습니다.",
  404: "찾을 수 없습니다.",
  500: "서버 내부 오류가 발생했습니다.",
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "StructError") {
    return res.status(400).json({
      error: "타입이 올바르지 않습니다.",
      message: err.message,
    });
  }

  const statusCode = err.status || 500;

  let message;

  if (err.message && err.status) {
    message = err.message;
  } else if (errorMessages[statusCode]) {
    message = errorMessages[statusCode];
  } else {
    message = "알 수 없는 오류가 발생했습니다.";
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
};

export default errorHandler;
