import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, saltRounds);
}
