import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import type { IStrategyOptions, VerifyFunction } from 'passport-local';
import db from '../../../model/prisma';
import { devDebug } from '../../debugs';


const options: IStrategyOptions = {
  usernameField: 'email'
}
const verify: VerifyFunction = async function (
  email, 
  password, 
  done
) {
  try {
    const user = await db.user.findUnique({
      where: {
        emailProvider: {
          email,
          provider: "local"
        }
      }
    });

    // user가 없거나, user가 있고 password가 있는데 비교하니까 다르다면,
    devDebug("user", user);
    if (user == null || (user.password != null &&
      await bcrypt.compare(password, user.password) === false)
    ) {
      return done(null, false, { message: "user not found" });
    }

    return done(null, user);
  } catch (err) {
    return done(null, false, { message: "error from prisma/db" });
  }
};
const localStrategy = new LocalStrategy(options, verify);

export default localStrategy;