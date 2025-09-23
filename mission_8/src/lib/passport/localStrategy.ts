import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../../utills/prisma';

export const localStrategy = new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return done(null, false);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return done(null, false);
  }

  done(null, user);
});

