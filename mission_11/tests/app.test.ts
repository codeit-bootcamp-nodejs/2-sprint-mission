import app from '../src/app';
import request from 'supertest';

describe('app', () => {
	jest.spyOn(console, "log").mockImplementation(() => {
		return;
	});
  test('앱 실행 테스트', async () => {
    const response = await request(app).get("/");
    expect(response.status).toEqual(200);
  });
	jest.restoreAllMocks();
});