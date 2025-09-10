import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { object, string, partial, size } from "superstruct";

export const CreateArticle = object({
    title: size(string(), 1, 30),
    content: size(string(), 1, 1000),
});

export const PatchArticle = partial(CreateArticle);


export class CreateArticlesDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 30)
    title: string = '';

    @IsNotEmpty()
    @IsString()
    @Length(1, 1000)
    content: string = '';
}

export class PatchArticleDto {
    @IsOptional()
    @IsString()
    @Length(1, 30)
    title?: string;

    @IsOptional()
    @IsString()
    @Length(1, 1000)
    content?: string;
}

export interface ArticleOutput {
    id: number;
    title: string;
    content: string;
    userId: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArticleOutputWithLiked extends ArticleOutput {
    isLiked: boolean;
}

export type ArticleFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ArticleOrderByWithRelationInput
};

export type LikedArticleFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ArticleLikeOrderByWithRelationInput
};

export interface ArticleListOptions {
    offset?: number;
    limit?: number;
    order?: 'newest' | 'oldest';
}