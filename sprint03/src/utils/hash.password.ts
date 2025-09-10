import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, saltRounds);
}
