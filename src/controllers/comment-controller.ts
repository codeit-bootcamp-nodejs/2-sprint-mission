import { Request, Response } from 'express';
import { commentService } from '../service/comment-service';
import { articleService } from '../service/article-service';
import { notificationService } from '../service/notification-service';

class CommentController {
  async createProductComment(req: Request, res: Response) {
    try {
      const { content, product_id } = req.body as {
        content: string;
        product_id: number;
      };
      const user = req.user;

      if (!user) {
        res.status(401).json({ message: '권한이 없습니다.' });
      }

      const productComments = await commentService.createProductComment(user.id, Number(product_id), content);
      res.json(productComments);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'PRODUCT_NOT_FOUND') {
          res.status(404).json({ message: '없는 제품입니다.' });
        }
        res.status(500).json({ message: '서버에러' });
      }
    }
  }

  // 게시글에 댓글 달면 알림
  async createArticleComment(req: Request, res: Response) {
    try {
      const { article_id, content } = req.body as {
        article_id: number;
        content: string;
      };
      const user = req.user;

      if (!user) {
        res.status(401).json({ message: '권한이 없습니다.' });
      }

      const articleComments = await commentService.createArticleComment(user.id, Number(article_id), content);
      const article = await articleService.getDetail(article_id);
      if (article.userId && article.userId !== user.id) {
        const message = `"${user.nickname}"님이 당신의 게시글에 댓글을 남겼습니다.`;
        await notificationService.sendNotification(article.userId, 'COMMENT', message);
      }


      res.json(articleComments);

    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'ARTICLE_NOT_FOUND') {
          res.status(404).json({ message: '없는 게시판입니다.' });
        }
        res.status(500).json({ message: '서버에러' });
      }
    }
  }

  async changeComment(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { content } = req.body as {
        content: string;
      };
      const user = req.user;

      if (!user) {
        res.status(401).json({ message: '권한이 없습니다.' });
      }

      const updatedComment = await commentService.changeComment(id, user.id, content);
      res.json(updatedComment);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'COMMENT_NOT_FOUND') {
          res.status(404).json({ message: '없는 댓글입니다.' });
        }
        if (err.message === 'UNAUTHORIZED') {
          res.status(401).json({ message: '없는 권한입니다.' });
        }
        res.status(500).json({ message: '서버에러' });
      }
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = req.user;

      if (!user) {
        res.status(401).json({ message: '권한이 없습니다.' });
      }

      const deletedComment = await commentService.deleteComment(id, user.id);
      res.json(deletedComment);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'COMMENT_NOT_FOUND') {
          res.status(404).json({ message: '없는 댓글입니다.' });
        }
        if (err.message === 'UNAUTHORIZED') {
          res.status(401).json({ message: '권한이 없습니다.' });
        }
        res.status(500).json({ message: '서버에러' });
      }
    }
  }

  async getProductCommentList(req: Request, res: Response) {
    try {
      const pdCommentList = await commentService.getProductCommentList();
      res.json(pdCommentList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'NO_COMMENTS') {
          res.status(404).json({ message: '댓글을 찾지 못했습니다.' });
        }
        res.status(500).json({ message: '서버에러' });
      }
    }
  }

  async getArticleCommentList(req: Request, res: Response) {
    try {
      const artCommentList = await commentService.getArticleCommentList();
      res.json(artCommentList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === 'NO_COMMENTS') {
          res.status(404).json({ message: '댓글을 찾지 못했습니다.' });
        }
        res.status(500).json({ message: '서버에러' });
      }
    }
  }
}

export default new CommentController();
