import { Prisma } from "@prisma/client";
import { ArrayNotEmpty, IsArray, IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string = '';

    @IsNotEmpty()
    @IsString()
    @Length(1, 1000)
    description: string = '';
    
    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    price!: number;
    
    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    tags: string[] = [];
}

export class PatchProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @Length(1, 1000)
    description?: string;
    
    @IsOptional()
    @IsInt()
    price?: number;
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

export interface ProductOutput {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
    likeCount: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductOutputWithLiked extends ProductOutput {
    isLiked: boolean;
}

export type ProductFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput
};

export type LikedProductFindManyOptions = {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductLikeOrderByWithRelationInput
};

export interface ProductListOptions {
    offset?: number;
    limit?: number;
    order?: 'newest' | 'oldest';
}