import { commentRepository } from '../repository/comment-repository';

export const commentService = {
  async createProductComment(userId: number, product_id: number, content: string) {
    const product = await commentRepository.findProductById(product_id);
    if (!product) throw new Error('PRODUCT_NOT_FOUND');

    return commentRepository.createProductComment({ userId, product_id, content });
  },

  async createArticleComment(userId: number, article_id: number, content: string) {
    const article = await commentRepository.findArticleById(article_id);
    if (!article) throw new Error('ARTICLE_NOT_FOUND');

    return commentRepository.createArticleComment({ userId, article_id, content });
  },

  async changeComment(id: number, userId: number, content: string) {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) throw new Error('COMMENT_NOT_FOUND');
    if (comment.userId !== userId) throw new Error('UNAUTHORIZED');

    return commentRepository.updateComment(id, content);
  },

  async deleteComment(id: number, userId: number) {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) throw new Error('COMMENT_NOT_FOUND');
    if (comment.userId !== userId) throw new Error('UNAUTHORIZED');

    return commentRepository.deleteComment(id);
  },

  async getProductCommentList() {
    const comments = await commentRepository.getProductCommentList();
    if (comments.length === 0) throw new Error('NO_COMMENTS');
    return comments;
  },

  async getArticleCommentList() {
    const comments = await commentRepository.getArticleCommentList();
    if (comments.length === 0) throw new Error('NO_COMMENTS');
    return comments;
  },
};
