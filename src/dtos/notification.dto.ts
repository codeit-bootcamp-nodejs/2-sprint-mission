import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class NotificationCreateDto {
  @IsNotEmpty()
  @IsString()
  message: string = "";

  @IsBoolean()
  isRead: boolean = false;

  @IsNotEmpty()
  @IsString()
  type: string = "";
}

export interface NotificationOutput {
  id: number;
  message: string;
  isRead: boolean;
  type: string;
}
