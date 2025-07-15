import { likeRepository } from '../repositories/like.repository';
import NotFoundError from '../lib/errors/NotFoundError';

type ToggleLikeInput = {
  userId: number;
  targetType: 'product' | 'article';
  targetId: number;
};

export const toggleLike = async ({ userId, targetType, targetId }: ToggleLikeInput) => {
  const existingLike = await likeRepository.find({ userId, targetType, targetId });

  if (existingLike) {
    await likeRepository.remove(existingLike.id);
    return { liked: false };
  }

  await likeRepository.create({ userId, targetType, targetId });
  return { liked: true };
};

export const getLikedItems = async (userId: number, targetType: 'product' | 'article') => {
  if (targetType === 'product') {
    return await likeRepository.findLikedProducts(userId);
  } else if (targetType === 'article') {
    return await likeRepository.findLikedArticles(userId);
  } else {
    throw new NotFoundError('지원하지 않는 targetType입니다.');
  }
};
