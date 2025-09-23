// src/product/router.ts
import { Router, type Request, type Response, type NextFunction } from 'express';
import ProductService, { UpdateProductDto, CreateProductDto } from './service';

type AuthedReq = Request & { user?: { id: number } };

// (선택) 인증 미들웨어가 있다면 이렇게 받아서 쓰세요.
// import { auth } from '../auth/middleware';

export default function makeProductRouter(svc: ProductService) {
  const r = Router();

  // ----------------------------------------
  // 공개 API
  // ----------------------------------------

  // GET /products → 전체 목록
  r.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await svc.list();
      // public 테스트는 배열 여부와 length>0를 기대할 수 있으니,
      // 사전 시드가 없다면 별도 beforeAll에서 하나 만들어 주세요.
      res.status(200).json(items);
    } catch (e) { next(e); }
  });

  // GET /products/:id → 단건 조회
  r.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      const found = await svc.getById(id);
      if (!found) return res.status(404).json({ message: 'NOT_FOUND' });

      res.status(200).json(found);
    } catch (e) { next(e); }
  });

  // ----------------------------------------
  // 인증 필요 API
  // ----------------------------------------

  // POST /products → 상품 생성 (201)
  r.post('/', /* auth, */ async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const body = req.body as Omit<CreateProductDto, 'userId'> & Partial<Pick<CreateProductDto, 'userId'>>;
      const dto: CreateProductDto = {
        userId,
        name: body.name,
        description: body.description,
        price: body.price,
        tags: body.tags ?? [],
        images: body.images ?? [],
      };
      const created = await svc.create(dto);
      res.status(201).json(created);
    } catch (e) { next(e); }
  });

  // PATCH /products/:id → 상품 수정 (200)
  r.patch('/:id', /* auth, */ async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      const dto = req.body as UpdateProductDto;
      const result = await svc.update(id, dto);
      res.status(200).json(result);
    } catch (e) { next(e); }
  });

  // DELETE /products/:id → 상품 삭제 (204 기본)
  r.delete('/:id', /* auth, */ async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      await svc.remove(id);
      // 테스트는 [200, 204] 허용 → 204가 기본적으로 깔끔
      res.status(204).end();
    } catch (e) { next(e); }
  });

  // ✅ 상품 좋아요 (중복 방지) → 인증 필요 / 204
  r.post('/:id/_like', /* auth, */ async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      await svc.like(id, userId);
      res.status(204).end();
    } catch (e) { next(e); }
  });

  // ----------------------------------------
  // 테스트용 시드 (인증 필요)
  // ----------------------------------------
  r.post('/_seed', /* auth, */ async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) return res.status(401).json({ message: 'UNAUTHORIZED' });

      const dto: CreateProductDto = {
        userId,
        name: '테스트 상품',
        description: 'seed',
        price: 1000,
        tags: [],
        images: [],
      };
      const created = await svc.create(dto);
      res.status(201).json(created);
    } catch (e) { next(e); }
  });

  return r;
}
