export type LikeTargetType = 'article' | 'product';

export interface LikeInput {
  userId: number;
  targetId: number;
  targetType: LikeTargetType;
}

export interface IsLikedInput {
  userId: number;
  targetId: number;
  targetType: TargetType;
}