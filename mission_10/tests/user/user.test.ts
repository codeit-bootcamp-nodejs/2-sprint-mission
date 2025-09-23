import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utills/prisma";

// 로그인 리미터 해제
jest.mock("../../src/utills/loginLimiter", () => ({
  loginLimiter: (req: any, res: any, next: any) => next(),
}));

describe("유저 정보 조회 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  test("유저 정보 조회", async () => {
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
    //유저 정보 조회
    const getUserResponse = await agent.get("/user");
    expect(getUserResponse.body).not.toBeNull();
    expect(getUserResponse.statusCode).toBe(200);
  });

	test("유저 정보 조회 실패(비 로그인)", async () => {
		const agent = request.agent(app);
		//유저 정보 조회
		const getUserResponse = await agent.get("/user");
		expect(getUserResponse.statusCode).toBe(401);
	});
});

describe("유저 정보 수정 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

	test("유저 정보 수정", async () => {
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
		//유저 정보 수정
		const updateUserResponse = await agent.patch("/user").send({
			email: "updated@example.com",
			nickname: "updated",
		});
		expect(updateUserResponse.body).not.toBeNull();
		expect(updateUserResponse.statusCode).toBe(200);
	});

	test("유저 정보 수정 실패(비 로그인)", async () => {
		const agent = request.agent(app);
		//유저 정보 수정
		const updateUserResponse = await agent.patch("/user").send({
			email: "updated@example.com",
			nickname: "updated",
		});
		expect(updateUserResponse.statusCode).toBe(401);
	});

	test("유저 정보 수정 실패(이메일 중복)", async () => {
		jest.spyOn(console, "log").mockImplementation(() => {
			return;
		});
		const agent = request.agent(app);
		//유저 생성s
		await agent.post("/user/register").send({
			email: "updated@example.com",
			nickname: "test",
			password: "test",
		});
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
		//유저 정보 수정
		const updateUserResponse = await agent.patch("/user").send({
			email: "updated@example.com",
			nickname: "updated",
		});
		expect(updateUserResponse.statusCode).toBe(500);
		jest.spyOn(console, "log").mockRestore();
	});
});

describe("유저 비밀번호 수정 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
	});

	test("유저 비밀번호 수정", async () => {
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
		//유저 비밀번호 수정
		const updatePasswordResponse = await agent.patch("/user/password").send({
			password: "test",
			newPassword: "updated",
		});
		expect(updatePasswordResponse.body).not.toBeNull();
		expect(updatePasswordResponse.statusCode).toBe(200);
	});

	test("유저 비밀번호 수정 실패(비 로그인)", async () => {
		const agent = request.agent(app);
		//유저 비밀번호 수정
		const updatePasswordResponse = await agent.patch("/user/password").send({
			password: "test",
			newPassword: "updated",
		});
		expect(updatePasswordResponse.statusCode).toBe(401);
	});

	test("유저 비밀번호 수정 실패(비밀번호 일치하지 않음)", async () => {
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
		//유저 비밀번호 수정
		const updatePasswordResponse = await agent.patch("/user/password").send({
			password: "test2",
			newPassword: "updated",
		});
		expect(updatePasswordResponse.statusCode).toBe(401);
		expect(updatePasswordResponse.text).toBe("{\"message\":\"현재 비밀번호가 일치하지 않습니다.\"}");
	});
});

describe("유저 게시글 조회 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  test("유저 게시글 조회", async () => {
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
    //유저 게시글 조회
    const getUserArticlesResponse = await agent.get("/user/articles");
    expect(getUserArticlesResponse.body).not.toBeNull();
    expect(getUserArticlesResponse.statusCode).toBe(200);
  });

  test("유저 게시글 조회 실패(비 로그인)", async () => {
    const agent = request.agent(app);
    //유저 게시글 조회
    const getUserArticlesResponse = await agent.get("/user/articles");
    expect(getUserArticlesResponse.statusCode).toBe(401);
  });
});

describe("유저 상품 조회 테스트", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  test("유저 상품 조회", async () => {
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
    //유저 상품 조회
    const getUserProductsResponse = await agent.get("/user/products");
    expect(getUserProductsResponse.body).not.toBeNull();
    expect(getUserProductsResponse.statusCode).toBe(200);
  });

  test("유저 상품 조회 실패(비 로그인)", async () => {
    const agent = request.agent(app);
    //유저 상품 조회
    const getUserProductsResponse = await agent.get("/user/products");
    expect(getUserProductsResponse.statusCode).toBe(401);
  });
});
    