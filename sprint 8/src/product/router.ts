// src/product/router.ts
import { Router, type Request, type Response, type NextFunction } from 'express';
import ProductService, { UpdateProductDto, CreateProductDto } from './service';

type AuthedReq = Request & { user?: { id: number } };

export default function makeProductRouter(svc: ProductService) {
  const r = Router();

  // ✅ 테스트용 상품 시드
  r.post('/_seed', async (req: AuthedReq, res: Response, next: NextFunction) => {
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
  // ✅ 상품 좋아요 (중복 방지)
r.post('/:id/_like', async (req: AuthedReq, res, next) => {
  try {
    const userId = Number(req.user?.id);
    const id = Number(req.params.id);
    await svc.like(id, userId);
    res.status(204).end();
  } catch (e) { next(e); }
});
  // ✅ 가격 변경 트리거 지점
  r.patch('/:id', async (req: AuthedReq, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'INVALID_ID' });

      const dto = req.body as UpdateProductDto;
      const result = await svc.update(id, dto);
      res.json(result);
    } catch (e) { next(e); }
  });

  return r;
}
