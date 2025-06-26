const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "StructError") {
    return res.status(400).json({
      error: "입력값이 올바르지 않습니다.",
      message: err.message,
    });
  }

  if (err.status === 404) {
    return res.status(404).json({
      error: "Not Found",
      message: err.message || "요청한 리소스를 찾을 수 없습니다.",
    });
  }

  // 해당 없을 시 최종 에러 코드
  return res.status(500).json({
    error: "서버 오류",
    message: err.message || "알 수 없는 오류",
  });
};

export default errorHandler;
