import multer from "multer";
import path from "path";
import fs from 'fs';

const imgUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, done) => {

            const user = req.user;
            if (!user || !user.id) {
                return done(new Error("user is not initialized"), '');
            }

            const userId = user.id;
            const imgDir = path.join(__dirname, `../../../uploads/${userId}/images`);

            try {
                fs.accessSync(imgDir, fs.constants.F_OK);
            } catch {
                fs.mkdirSync(imgDir, { recursive: true });
            }

            done(null, imgDir);
        },
        filename: (req, file, done) => {
            const extension = path.extname(file.originalname);
            done(null, path.basename(file.originalname, extension) + Date.now() + extension);
        }
    }),
    limits: {
        fieldNameSize: 50,
        fieldSize: 1024 * 1024 / 2,
        fields: 10,
        fileSize: 10 * 1024 * 1024,
        files: 10,
        parts: 20,
        headerPairs: 1000
    },

    fileFilter(req, file, done) {
        if (file.mimetype.startsWith('image/')) {
            done(null, true);
        } else {
            done(new Error("only images acceptable"));
        }
    }
});

export default imgUpload;