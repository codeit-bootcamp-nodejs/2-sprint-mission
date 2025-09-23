import request from 'supertest';
import app from '../app';

describe("POST /auth/register - 회원가입", () => {
  it("유효한 정보로 회원가입을 성공적으로 할 수 있다", async () => {
    const userData = {
      email: "test@example.com",
      nickname: "테스트유저",
      password: "test123",
      image: "profile.jpg"
    };

    const res = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.userWithoutPassword).toEqual({
      id: expect.any(Number),
      email: userData.email,
      nickname: userData.nickname,
      image: userData.image,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });

  it("중복된 이메일로 회원가입 시 400 에러를 반환한다", async () => {
    const userData = {
      email: "test@example.com",
      nickname: "테스트유저",
      password: "test123"
    };

    // 첫 번째 회원가입
    await request(app)
      .post('/auth/register')
      .send(userData);

    // 중복 이메일로 두 번째 회원가입 시도
    const res = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("이미 존재하는 이메일입니다.");
  });

  it("필수 필드가 누락된 경우 400 에러를 반환한다", async () => {
    const userData = {
      email: "test@example.com"
      // nickname, password 누락
    };

    const res = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("유효하지 않은 입력 값입니다.");
  });
});

describe("POST /auth/login - 로그인", () => {
  beforeEach(async () => {
    // 테스트용 사용자를 회원가입 API를 통해 생성
    await request(app)
      .post('/auth/register')
      .send({
        email: "test@example.com",
        nickname: "테스트유저",
        password: "test123"
      });
  });

  it("유효한 정보로 로그인을 성공적으로 할 수 있다", async () => {
    const loginData = {
      email: "test@example.com",
      password: "test123"
    };

    const res = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("로그인이 완료 되었습니다.");
    expect(res.body.user).toEqual({
      id: expect.any(Number),
      email: loginData.email,
      nickname: "테스트유저",
      image: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it("존재하지 않는 이메일로 로그인 시 404 에러를 반환한다", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: "test123"
    };

    const res = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("존재하지 않는 사용자입니다.");
  });

  it("잘못된 비밀번호로 로그인 시 400 에러를 반환한다", async () => {
    const loginData = {
      email: "test@example.com",
      password: "wrongpassword"
    };

    const res = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("비밀번호가 일치하지 않습니다.");
  });
});

describe("POST /auth/logout - 로그아웃", () => {
  it("로그아웃을 성공적으로 할 수 있다", async () => {
    const res = await request(app)
      .post('/auth/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("로그아웃이 완료 되었습니다.");
  });
});