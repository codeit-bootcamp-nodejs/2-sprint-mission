import productService from "../src/services/product.service";
import productRepository from "../src/repositories/product.repository";

// 레포지토리 모듈 전체를 자동 mock
jest.mock("../src/repositories/product.repository");

// 타입 안전한 mocked 객체
type MockedRepo = jest.Mocked<typeof productRepository>;
const mockedRepo = productRepository as MockedRepo;

describe("productService (unit)", () => {
  const userId = 10;
  const productId = 99;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("상품 등록", async () => {
    const dto = { name: "Keyboard", price: 12345 } as any;
    const fake = { id: productId, ...dto, userId };
    mockedRepo.createProduct.mockResolvedValue(fake);

    const result = await productService.createProduct(userId, dto);

    expect(mockedRepo.createProduct).toHaveBeenCalledTimes(1);
    expect(mockedRepo.createProduct).toHaveBeenCalledWith(userId, dto);
    expect(result).toEqual(fake);
  });

  it("상품 전체 목록 조회", async () => {
    const query = { page: 2, size: 10 };
    const list = [{ id: 1 }, { id: 2 }] as any;
    mockedRepo.getAllProducts.mockResolvedValue(list);

    const result = await productService.getAllProducts(query);

    expect(mockedRepo.getAllProducts).toHaveBeenCalledWith(query);
    expect(result).toBe(list);
  });

  it("개별 상품 조회", async () => {
    const item = { id: productId, name: "Mouse" } as any;
    mockedRepo.getProductById.mockResolvedValue(item);

    const result = await productService.getProductById(productId);

    expect(mockedRepo.getProductById).toHaveBeenCalledWith(productId);
    expect(result).toBe(item);
  });

  it("상품 수정", async () => {
    const dto = { price: 9999 } as any;
    const updated = { id: productId, ...dto } as any;
    mockedRepo.updateProduct.mockResolvedValue(updated);

    const result = await productService.updateProduct(userId, productId, dto);

    expect(mockedRepo.updateProduct).toHaveBeenCalledWith(
      userId,
      productId,
      dto
    );
    expect(result).toEqual(updated);
  });

  it("상품 삭제", async () => {
    mockedRepo.deleteProduct.mockResolvedValue(undefined);

    await productService.deleteProduct(userId, productId);

    expect(mockedRepo.deleteProduct).toHaveBeenCalledWith(userId, productId);
  });

  describe("Product like/unlike", () => {
    it("이미 좋아요 했으면 예외를 던진다", async () => {
      const likedEntity = {
        id: 1,
        userId,
        productId,
        createdAt: new Date(),
      };
      mockedRepo.hasLikedProduct.mockResolvedValue(likedEntity);

      await expect(
        productService.likeProduct(userId, productId)
      ).rejects.toThrow("이미 좋아요 했음");

      expect(mockedRepo.hasLikedProduct).toHaveBeenCalledWith(
        userId,
        productId
      );
      // 이미 좋아요인 경우 likeProduct는 호출되면 안 됨
      expect(mockedRepo.likeProduct).not.toHaveBeenCalled();
    });

    it("좋아요하지 않았다면 likeProduct를 호출하고 결과를 반환", async () => {
      mockedRepo.hasLikedProduct.mockResolvedValue(null);
      const liked = { userId, productId, liked: true } as any;
      mockedRepo.likeProduct.mockResolvedValue(liked);

      const result = await productService.likeProduct(userId, productId);

      expect(mockedRepo.hasLikedProduct).toHaveBeenCalledWith(
        userId,
        productId
      );
      expect(mockedRepo.likeProduct).toHaveBeenCalledWith(userId, productId);
      expect(result).toBe(liked);
    });
  });
});
