import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prisma';



export const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},

    async function (
        email: string,
        password: string,
        done,
    ) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user)
    });

