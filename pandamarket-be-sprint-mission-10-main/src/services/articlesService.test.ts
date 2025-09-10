import * as articlesRepository from '../repositories/articlesRepository';
import * as articlesService from './articlesService';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';

jest.mock('../repositories/articlesRepository');

describe('게시글 서비스', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article',
    content: 'Test Content',
    image: 'test.jpg',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    likeCount: 0,
    isLiked: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    test('게시글을 생성할 수 있다', async () => {
      jest.mocked(articlesRepository.createArticle).mockResolvedValue(mockArticle);

      const result = await articlesService.createArticle({
        title: mockArticle.title,
        content: mockArticle.content,
        image: mockArticle.image,
        userId: mockArticle.userId,
      });

      expect(articlesRepository.createArticle).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockArticle,
        likeCount: 0,
        isLiked: false,
      });
    });
  });

  describe('getArticle', () => {
    test('게시글이 존재할 때 게시글 정보를 반환해야 한다', async () => {
      jest.mocked(articlesRepository.getArticleWithLkes).mockResolvedValue({
        ...mockArticle,
        likes: undefined,
        likeCount: 0,
        isLiked: false,
      });

      const result = await articlesService.getArticle(1);

      expect(articlesRepository.getArticleWithLkes).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({
        ...mockArticle,
        likeCount: 0,
        isLiked: false,
      });
    });

    test('게시글이 존재하지 않을 때 NotFoundError를 반환해야 한다', async () => {
      jest.mocked(articlesRepository.getArticleWithLkes).mockResolvedValue(null);

      await expect(articlesService.getArticle(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getArticleList', () => {
    test('게시글 목록을 조회할 수 있다', async () => {
      const mockList = { list: [mockArticle], totalCount: 1 };
      jest.mocked(articlesRepository.getArticleListWithLikes).mockResolvedValue({
        ...mockList,
        list: mockList.list.map((article, i) => ({
          ...article,
          likes: undefined,
          likeCount: i,
          isLiked: false,
        })),
      });

      const result = await articlesService.getArticleList({ page: 1, pageSize: 10 });

      expect(articlesRepository.getArticleListWithLikes).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockList,
        list: mockList.list.map((article, i) => ({
          ...article,
          likes: undefined,
          likeCount: i,
          isLiked: false,
        })),
      });
    });
  });

  describe('updateArticle', () => {
    test('게시글을 수정할 수 있다', async () => {
      const updatedArticle = { ...mockArticle, title: 'Updated Title' };
      jest.mocked(articlesRepository.getArticle).mockResolvedValue(mockArticle);
      jest.mocked(articlesRepository.updateArticleWithLikes).mockResolvedValue({
        ...updatedArticle,
        likes: undefined,
        likeCount: 0,
        isLiked: false,
      });

      const result = await articlesService.updateArticle(1, { userId: 1, title: 'Updated Title' });

      expect(articlesRepository.getArticle).toHaveBeenCalledWith(1);
      expect(articlesRepository.updateArticleWithLikes).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...updatedArticle,
        likes: undefined,
        likeCount: 0,
        isLiked: false,
      });
    });

    test('게시글이 존재하지 않을 때 NotFoundError를 반환해야 한다', async () => {
      jest.mocked(articlesRepository.getArticle).mockResolvedValue(null);

      await expect(articlesService.updateArticle(1, { userId: 1 })).rejects.toThrow(NotFoundError);
    });

    test('게시글 소유자가 아닐 때 ForbiddenError를 반환해야 한다', async () => {
      jest.mocked(articlesRepository.getArticle).mockResolvedValue({ ...mockArticle, userId: 2 });

      await expect(articlesService.updateArticle(1, { userId: 1 })).rejects.toThrow(ForbiddenError);
    });
  });

  describe('deleteArticle', () => {
    test('게시글 소유자가 게시글을 삭제할 수 있다', async () => {
      jest.mocked(articlesRepository.getArticle).mockResolvedValue(mockArticle);
      jest.mocked(articlesRepository.deleteArticle).mockResolvedValue(mockArticle);

      await articlesService.deleteArticle(1, 1);

      expect(articlesRepository.getArticle).toHaveBeenCalledWith(1);
      expect(articlesRepository.deleteArticle).toHaveBeenCalledWith(1);
    });

    test('게시글이 존재하지 않을 때 NotFoundError를 반환해야 한다', async () => {
      jest.mocked(articlesRepository.getArticle).mockResolvedValue(null);

      await expect(articlesService.deleteArticle(1, 1)).rejects.toThrow(NotFoundError);
    });

    test('게시글 소유자가 아닐 때 ForbiddenError를 반환해야 한다', async () => {
      jest.mocked(articlesRepository.getArticle).mockResolvedValue({ ...mockArticle, userId: 2 });

      await expect(articlesService.deleteArticle(1, 1)).rejects.toThrow(ForbiddenError);
    });
  });
});
