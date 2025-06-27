const { body, validationResult } = require('express-validator');

exports.validateProduct = [
  body('name').notEmpty().withMessage('이름은 필수입니다'),
  body('description').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

exports.validateArticle = (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 모두 입력해주세요.' });
  }
  next();
};

exports.validateComment = (req, res, next) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }
  next();
};