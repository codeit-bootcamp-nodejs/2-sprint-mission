import app from '../app';
import request from 'supertest';
import { db } from '../utils/db';

// 회원가입 api test

describe("POST /users/create", () => {
  const nickname = 'test';
  const email = 'test';


  beforeAll(async () => {
    await db.article.deleteMany({});
    await db.comment.deleteMany({});
    await db.product.deleteMany({});
    await db.user.deleteMany({});
  });
  afterAll(async () => {
    await db.$disconnect();
  });


  test("유저 회원가입 성공", async () => {
    const response = await request(app).post('/users/create').send({
      email,
      nickname,
      password: 'test'
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toEqual('test');
    expect(response.body.nickname).toEqual('test');


  });

  test("유저가 이메일 , 닉네임 , 비밀번호 입력 안한 경우 ", async () => {
    let response = await request(app).post('/users/create').send({
      nickname,
      password: 'test'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Username and password and email are required");

    response = await request(app).post('/users/create').send({
      email,
      password: 'test'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Username and password and email are required");

    response = await request(app).post('/users/create').send({
      email,
      nickname
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Username and password and email are required");

    response = await request(app).post('/users/create').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Username and password and email are required");

  });

  test("유저 이메일 중복될 경우", async () => {
    const response = await request(app).post('/users/create').send({
      nickname: 'test2',
      email,
      password: 'test'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("이미 존재하는 이메일입니다");

  });

  test("유저 닉네임 중복될 경우", async () => {
    const response = await request(app).post('/users/create').send({
      nickname: 'test',
      email: 'test2',
      password: 'test'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("이미 존재하는 닉네임입니다");


  });

});

// 로그인 api 테스트

describe("POST /users/login", () => {
  const email = 'test';
  const nickname = "test";
  const password = "test";

  beforeAll(async () => {
    await db.productLike.deleteMany({});
    await db.article.deleteMany({});
    await db.comment.deleteMany({});
    await db.product.deleteMany({});
    await db.user.deleteMany({});
    await request(app).post("/users/create").send({
      email,
      nickname,
      password,
    });
  });

  afterAll(async () => {
    await db.$disconnect();
  }); 

  test("nickname / password 를 잘 보내서 로그인 성공", async () => {
    const response = await request(app).post("/users/login").send({
      nickname,
      password,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.accessToken).toBeTruthy();
  });

  test("nickname / password 를 보냈지만, 비밀번호가 틀림", async () => {
    const response = await request(app).post("/users/login").send({
      nickname,
      password: password + "test",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('비밀번호가 틀렸습니다.');
  });

  test("nickname / password 를 보냈지만, 유저 닉네임 없음", async () => {
    const response = await request(app).post("/users/login").send({
      nickname: nickname + "test",
      password,
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toBe('유저 닉네임이 존재하지 않습니다.');
  });

  test("nickname / password 둘중에 하나 혹은 전부를 안보냄", async () => {
    let response = await request(app).post("/users/login").send({});
    expect(response.statusCode).toEqual(400);

    response = await request(app).post("/users/login").send({
      nickname,
    });
    expect(response.statusCode).toEqual(400);

    response = await request(app).post("/users/login").send({
      password,
    });
    expect(response.statusCode).toEqual(400);
  });
});