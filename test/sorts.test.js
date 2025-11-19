import request from "supertest";
import { Server } from "../src/server.js";

const app = new Server().server;

describe("Sorts API Integration", () => {
    test("GET /api/sorts - 정렬 알고리즘 목록 반환(성공)", async () => {
        const res = await request(app).get("/api/sorts");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.total).toBe(res.body.items.length);

        const names = res.body.items.map((i) => i.name);
        expect(names).toEqual(["선택 정렬", "삽입 정렬", "병합 정렬", "빠른 정렬"]);
    });

    const endpoints = ["selection", "insertion", "merge", "quick"];
    const inputArray = [5, 3, 8, 1, 2];

    for (const type of endpoints) {
        test(`POST /api/sorts/${type} - 정렬된 배열 반환(성공)`, async () => {
            const res = await request(app)
                .post(`/api/sorts/${type}`)
                .send({ array: inputArray });

            expect(res.statusCode).toBe(200);
            expect(res.body.type).toBe(type);
            expect(res.body.input).toEqual(inputArray);
            expect(res.body.result).toEqual([...inputArray].sort((a, b) => a - b));
            expect(typeof res.body.elapsedMs).toBe("string");
        });
    }

    test("POST /api/sorts/selection - body 없이 요청(실패)", async () => {
        const res = await request(app)
            .post("/api/sorts/selection")
            .send({});
        expect(res.statusCode).toBe(400);
    });

    test("POST /api/sorts/unknown - 지원하지 않는 정렬 요청(실패)", async () => {
        const res = await request(app)
            .post("/api/sorts/unknown")
            .send({ array: [3, 1, 2] });
        expect(res.statusCode).toBe(404);
    });
});
