const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일 시스템 모듈 추가

// Multer 설정: 어디에 어떻게 파일을 저장할지 정의

// 업로드 폴더 설정 및 생성
const uploadDir = 'uploads/'; // 프로젝트 루트 디렉토리에 생성됨
if (!fs.existsSync(uploadDir)) { // 폴더가 없으면
    fs.mkdirSync(uploadDir, { recursive: true }); // 재귀적으로 생성
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // 파일을 'uploads/' 폴더에 저장
    },
    filename: (req, file, cb) => {
        // 파일명 중복 방지를 위해 고유한 이름 생성 (예: 타임스탬프-원본파일명)
        const extname = path.extname(file.originalname); // 파일 확장자 추출
        cb(null, Date.now() + '-' + file.originalname); // 고유한 파일명 설정
    },
});

// 파일 필터링 (선택 사항: 이미지 파일만 허용)

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // 허용할 이미지 확장자 정규식
    const mimetype = filetypes.test(file.mimetype); // 파일 MIME 타입 검사
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // 파일 확장자 검사

    if (mimetype && extname) { // MIME 타입과 확장자 모두 통과하면
        return cb(null, true); // 파일 허용
    } else {
        // 그렇지 않으면 에러 반환
        cb(new Error('이미지 파일(jpeg, jpg, png, gif)만 업로드할 수 있습니다!'));
    }
};

// Multer 업로드 인스턴스 생성

const upload = multer({
    storage: storage, // 위에서 정의한 저장 방식 사용
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
    fileFilter: fileFilter, // 파일 필터링 적용
});


// 이미지 업로드 API 컨트롤러 함수


// 단일 이미지 업로드 처리 함수
// 이 함수는 multer 미들웨어를 래핑하여 에러 처리를 용이하게 합니다.

exports.uploadImage = (req, res, next) => {
    // 'image'는 클라이언트(Postman 등)에서 form-data의 파일 필드 이름으로 보낼 키 값입니다.
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer에서 발생한 특정 에러 (예: 파일 크기 초과, 잘못된 파일 형식)
            console.error('Multer Error:', err.message);
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // 그 외 알 수 없는 에러 (예: fs 모듈 에러 등)
            console.error('Unknown Error during upload:', err);
            return next(err); // Express의 전역 에러 핸들러로 넘김
        }

        // 파일이 업로드되지 않았을 경우

        if (!req.file) {
            return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
        }

        // 업로드 성공 시 파일 정보 반환
        // filePath는 클라이언트가 웹에서 접근할 수 있는 URL 경로가 됩니다.
        // 예: https://your-service-name.onrender.com/uploads/123456789-myimage.jpg

        res.status(200).json({
            message: '이미지 업로드 성공!',
            fileName: req.file.filename,
            filePath: `/uploads/${req.file.filename}` // 서버에 저장된 정적 파일 경로
        });
    });
};