interface UserUpdateDto {
  nickname?: string;
  image?: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export { UserUpdateDto, ChangePasswordDto };
