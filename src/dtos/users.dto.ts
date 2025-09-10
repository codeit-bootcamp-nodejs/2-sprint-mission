import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string = '';

    @IsNotEmpty()
    @IsString()
    @Length(1, 15)
    nickname: string = '';

    @IsNotEmpty()
    @IsString()
    @Length(6, 15)
    password: string = '';

    @IsOptional()
    @IsString()
    image?: string;
}

export class PatchUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(1, 15)
    nickname?: string;

    @IsOptional()
    @IsString()
    @Length(6, 15)
    password?: string;

    @IsOptional()
    @IsString()
    image?: string;
}

export interface UserOutputDto {
    id: number;
    email: string;
    nickname: string;
    createdAt: Date;
    updatedAt: Date;
}
