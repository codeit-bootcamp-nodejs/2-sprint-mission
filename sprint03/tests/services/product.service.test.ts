import { ProductService } from "../../src/services/product.service";
import { ProductRepository } from "../../src/repositories/product.repository";
import HttpError from "../../src/types/httpError";

jest.mock("../../src/repositories/product.repository");

describe("ProductService Unit Tests", () => {
  const mockProduct = { id: 1, name: "test", description: "desc", price: 1000, tags: [] };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("상품 목록 조회", async () => {
    (ProductRepository.findMany as jest.Mock).mockResolvedValue([mockProduct]);

    const result = await ProductService.getProducts({ page: 1, pageSize: 10 });
    expect(result.products).toEqual([mockProduct]);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  test("상품 생성", async () => {
    (ProductRepository.create as jest.Mock).mockResolvedValue(mockProduct);

    const result = await ProductService.createProduct(mockProduct, 1);
    expect(result).toEqual(mockProduct);
  });

  test("상품 단일 조회 - 존재하는 경우", async () => {
    (ProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
    (ProductRepository.findLike as jest.Mock).mockResolvedValue(null);

    const result = await ProductService.getProductById(1, 1);
    expect(result.product).toEqual(mockProduct);
    expect(result.isLiked).toBeFalsy();
  });

  test("상품 단일 조회 - 존재하지 않는 경우", async () => {
    (ProductRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(ProductService.getProductById(999, 1)).rejects.toThrow(HttpError);
  });

  test("상품 업데이트 - 존재하는 경우", async () => {
    (ProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
    (ProductRepository.update as jest.Mock).mockResolvedValue({ ...mockProduct, name: "updated" });

    const result = await ProductService.updateProduct(1, { name: "updated" });
    expect(result.name).toEqual("updated");
  });

  test("상품 업데이트 - 존재하지 않는 경우", async () => {
    (ProductRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(ProductService.updateProduct(999, { name: "updated" })).rejects.toThrow(HttpError);
  });

  test("상품 삭제 - 존재하는 경우", async () => {
    (ProductRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
    (ProductRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await ProductService.deleteProduct(1);
    expect(ProductRepository.delete).toHaveBeenCalledWith(1);
  });

  test("상품 삭제 - 존재하지 않는 경우", async () => {
    (ProductRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(ProductService.deleteProduct(999)).rejects.toThrow(HttpError);
  });

  test("상품 좋아요 토글 - 좋아요 없는 경우", async () => {
    (ProductRepository.findLike as jest.Mock).mockResolvedValue(null);
    (ProductRepository.createLike as jest.Mock).mockResolvedValue({});

    const result = await ProductService.toggleProductLike(1, 1);
    expect(result.liked).toBeTruthy();
  });

  test("상품 좋아요 토글 - 이미 좋아요 한 경우", async () => {
    (ProductRepository.findLike as jest.Mock).mockResolvedValue({});
    (ProductRepository.deleteLike as jest.Mock).mockResolvedValue({});

    const result = await ProductService.toggleProductLike(1, 1);
    expect(result.liked).toBeFalsy();
  });
});
