import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver-v2';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, PORT, BASE_URL } from '../../staticConsts';
import db from '../../../model/prisma';

export const naverStrategy = new NaverStrategy(
    {
        clientID: NAVER_CLIENT_ID,
        clientSecret: NAVER_CLIENT_SECRET,
        callbackURL: `/auth/naver/callback`,
        scope: ["profile"]
    },
    async function (
        accessToken: string,
        refreshToken: string,
        profile: NaverProfile,
        done: any
    ) {
        try{
            const user = await db.user.findUnique({
                where: {
                    provider: 'naver',
                    providerId: profile.id
                },
            });
            if (user) {
                return done(null, user);
            }

            const email = profile.email;
            const nickname = profile.nickname;
            const imageUrl = profile.profileImage;

            if (email != null && nickname != null && imageUrl != null) {

                const newUser = await db.user.create({
                    data: {
                        id: crypto.randomUUID(),
                        provider: 'naver',
                        providerId: profile.id,
                        email,
                        nickname,
                        imageUrl
                    },
                });

                return done(null, newUser);

            } else {
                return done(null, false, { message: "email, nickname, imageUrl is necessary" });
            }
        }catch(err) {
            return done(err, false, {message: "server error"});
        }
    }
);

export default naverStrategy;