import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utills/prisma";

// 로그인 리미터 해제
jest.mock("../../src/utills/loginLimiter", () => ({
  loginLimiter: (req: any, res: any, next: any) => next(),
}));
jest.spyOn(console, "log").mockImplementation(() => {
	return;
});
describe("유저 생성 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("유저 생성 성공", async () => {
    const response = await request(app).post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
      password: "test",
    });
    expect(response.body.message).toBe("회원가입 성공");
    expect(response.statusCode).toBe(201);
  });

  test("유저 생성 실패(이메일 없음)", async () => {
    const response = await request(app).post("/user/register").send({
      nickname: "test",
      password: "test",
    });
    expect(response.text).toBe("이메일이 필요합니다.");
    expect(response.statusCode).toBe(400);
  });
  test("유저 생성 실패(이메일 형식 오류)", async () => {
    const response = await request(app).post("/user/register").send({
      email: "testemail",
      nickname: "test",
      password: "test",
    });
    expect(response.text).toBe("이메일 형식이 올바르지 않습니다.");
    expect(response.statusCode).toBe(400);
  });

  test("유저 생성 실패(이메일 중복)", async () => {
    await prisma.user.create({
      data: {
        email: "test@example.com",
        nickname: "test",
        password: "test",
      },
    });
    const response = await request(app).post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
      password: "test",
    });
    expect(response.text).toBe("이메일이 중복됩니다.");
    expect(response.statusCode).toBe(400);
  });

  test("유저 생성 실패(비밀번호 없음)", async () => {
    const response = await request(app).post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
    });
    expect(response.text).toBe("비밀번호가 필요합니다.");
    expect(response.statusCode).toBe(400);
  });

  test("유저 생성 실패(닉네임 없음)", async () => {
    const response = await request(app).post("/user/register").send({
      email: "test@example.com",
      password: "test",
    });
    expect(response.text).toBe("닉네임이 필요합니다.");
    expect(response.statusCode).toBe(400);
  });

  test("유저 생성 실패(이메일 없음)", async () => {
    const response = await request(app).post("/user/register").send({
      nickname: "test",
      password: "test",
    });
    expect(response.text).toBe("이메일이 필요합니다.");
    expect(response.statusCode).toBe(400);
  });
});

describe("유저 삭제 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  const agent = request.agent(app);

  test("유저 삭제 성공", async () => {
    //유저 생성
    await agent.post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
      password: "test",
    });
    //로그인
    await agent.post("/user/login").send({
      email: "test@example.com",
      password: "test",
    });
    //유저 삭제
    const deleteResponse = await agent.delete("/user/unRegister").send({
      email: "test@example.com",
      password: "test",
    });
    expect(deleteResponse.body.message).toBe("user가 삭제되었습니다.");
    expect(deleteResponse.statusCode).toBe(200);
  });

  test("유저 삭제 실패(유저 없음)", async () => {
    //유저 삭제
    const deleteResponse = await agent.delete("/user/unRegister").send({
      email: "test@example.com",
      password: "test",
    });
    //패스포트 미인증
    expect(deleteResponse.statusCode).toBe(401);
  });

  test("유저 삭제 실패(비밀번호 일치하지 않음)", async () => {
    //유저 생성
    await agent.post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
      password: "test",
    });
    //로그인
    await agent.post("/user/login").send({
      email: "test@example.com",
      password: "test",
    });
    //유저 삭제
    const deleteResponse = await agent.delete("/user/unRegister").send({
      email: "test@example.com",
      password: "test2",
    });
    expect(deleteResponse.text).toBe("비밀번호가 일치하지 않습니다.");
    expect(deleteResponse.statusCode).toBe(401);
  });
});

describe("유저 로그인 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  test("유저 로그인 성공", async () => {
    const agent = request.agent(app);
    //유저 생성
    await agent.post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
      password: "test",
    });
    //로그인
    const loginResponse = await agent.post("/user/login").send({
      email: "test@example.com",
      password: "test",
    });
    expect(loginResponse.header["set-cookie"][0]).toContain("access-token");
    expect(loginResponse.header["set-cookie"][1]).toContain("refresh-token");
    expect(loginResponse.body.message).toBe("로그인 성공");
    expect(loginResponse.statusCode).toBe(200);
  });

  test("유저 로그인 실패(유저 없음)", async () => {
    const agent = request.agent(app);
    //로그인
    const loginResponse = await agent.post("/user/login").send({
      email: "test@example.com",
      password: "test",
    });
		expect(loginResponse.text).toBe("user를 찾을 수 없습니다.");
    expect(loginResponse.statusCode).toBe(404);
  });

  test("유저 로그인 실패(비밀번호 일치하지 않음)", async () => {
    const agent = request.agent(app);
    //유저 생성
    await agent.post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
      password: "test",
    });
    //로그인
    const loginResponse = await agent.post("/user/login").send({
      email: "test@example.com",
      password: "test2",
    });
    expect(loginResponse.text).toBe("비밀번호가 일치하지 않습니다.");
    expect(loginResponse.statusCode).toBe(401);
  });

  test("유저 로그아웃 성공", async () => {
    const agent = request.agent(app);
    //유저 생성
    await agent.post("/user/register").send({
      email: "test@example.com",
      nickname: "test",
      password: "test",
    });
    //로그인
    await agent.post("/user/login").send({
      email: "test@example.com",
      password: "test",
    });
    //로그아웃
    const logoutResponse = await agent.post("/user/logout");
    expect(logoutResponse.body.message).toBe("로그아웃 성공");
    expect(logoutResponse.statusCode).toBe(200);
  });
});

describe("유저 리프레쉬 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

	test("유저 리프레쉬 성공", async () => {
		const agent = request.agent(app);
		//유저 생성
		await agent.post("/user/register").send({
			email: "test@example.com",
			nickname: "test",
			password: "test",
		});
		//로그인
		const loginResponse = await agent.post("/user/login").send({
			email: "test@example.com",
			password: "test",
		});
		//리프레쉬
		const refreshResponse = await agent.post("/user/refresh");
		expect(refreshResponse.header["set-cookie"][0]).toContain("access-token");
		expect(refreshResponse.header["set-cookie"][1]).toContain("refresh-token");
		expect(refreshResponse.body.message).toBe("refresh token 성공");
		expect(refreshResponse.statusCode).toBe(200);
	});

	test("유저 리프레쉬 실패(리프레쉬 토큰 없음)", async () => {
		const agent = request.agent(app);
		//리프레쉬
		const refreshResponse = await agent.post("/user/refresh");
		expect(refreshResponse.statusCode).toBe(401);
	});
});
