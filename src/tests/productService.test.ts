import { productService } from "../service/product-service";
import { productRepository } from "../repository/product-repository";

jest.mock("../repository/product-repository");

describe('getDetail 함수 테스트', () => {
  test('존재하는 상품 상세조회', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "양파",
      description: "신선한 양파",
      price: 800,
      tags: ["야채", "식재료"],
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
      userId: 10,
    });

    const product = await productService.getDetail(1);
    expect(product).toMatchObject({
      id: 1,
      name: "양파",
      price: 800,
    });
    expect(productRepository.findById).toHaveBeenCalledWith(1);
  });

  test('존재하지 않는 상품 상세조회', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(productService.getDetail(999))
      .rejects
      .toThrow("NOT_FOUND");
  })
});

describe("create 테스트", () => {
  test("필수 정보가 모두 있을 때", async () => {
    const userId = 1;
    const data = {
      id: 1,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    };

    // spy로 mock
    const spy = jest.spyOn(productService, "create").mockResolvedValue(data);

    const result = await productService.create(userId, data);

    // 반환값 검증
    expect(result).toEqual(data);

    // 호출 여부와 인자 검증
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userId, data);

    spy.mockRestore(); // 테스트 끝나면 원래 함수 복원
  });



  test("필수 정보가 없을 때", async () => {
    const userId = 1;

    // 일부 필수 필드가 빠진 데이터
    const incompleteData = {
      name: "닌텐도",
      description: "별로",
      tags: ["애들", "장난감"],
    };

    // spy로 실제 create 호출을 감시
    const spy = jest.spyOn(productService, "create");

    // 예외 발생 검증
    expect(productService.create(userId, incompleteData as any))
      .rejects
      .toThrow('유효성 검증 에러')


    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userId, incompleteData);

    spy.mockRestore();
  });
});


describe('update 테스트', () => {
  test('필수 정보가 모두 있을 때', async () => {
    const userId = 1;
    const productId = 1;
    const data = {
      id: 1,
      name: "수정닌텐도",
      description: "수정별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    };

    // spy로 mock
    const spy = jest.spyOn(productService, "update").mockResolvedValue(data);

    const result = await productService.update(userId, productId, data);

    // 반환값 검증
    expect(result).toEqual(data);

    // 호출 여부와 인자 검증
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userId, productId, data);

    spy.mockRestore(); // 테스트 끝나면 원래 함수 복원
  })

  test('필수 정보가 없을 때', async () => {
    // 일부 필수 필드가 빠진 데이터
    const userId = 1;
    const productId = 1;
    const incompleteData = {
      name: "닌텐도",
      description: "별로",
      tags: ["애들", "장난감"],
    };

    // spy로 실제 create 호출을 감시
    const spy = jest.spyOn(productService, "update");

    // 예외 발생 검증
    expect(productService.update(userId, productId, incompleteData as any))
      .rejects
      .toThrow('data are required')

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userId, productId, incompleteData);

    spy.mockRestore();

  })

  test("권한 없는 유저의 수정", async () => {
    const userId = 1;
    const ownerId = 2;
    const productId = 1;

    const spyFind = jest.spyOn(productRepository, 'findById').mockResolvedValue({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: ownerId,
    })

    const data = {
      id: 1,
      name: "수정닌텐도",
      description: "수정별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    };


    await expect(productService.update(userId, productId, data as any))
      .rejects
      .toThrow("FORBIDDEN");

    spyFind.mockRestore();


  })

});

describe('delete 함수 테스트', () => {
  test('삭제 성공', async () => {
    const userId = 1;
    const productId = 1;

    // spy로 실제 remove 호출 감시 및 mock 반환값 설정
    const spy = jest.spyOn(productService, "remove").mockResolvedValue({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    });

    const result = await productService.remove(userId, productId);

    // 서비스 반환값 검증
    expect(result).toEqual({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      userId,
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userId, productId);

    spy.mockRestore();
  });

  test('없는 id 삭제요청 NOT_FOUND', async () => {
    const spy = jest.spyOn(productRepository, 'findById').mockResolvedValue(null);

    await expect(productService.remove(1, 999))
      .rejects
      .toThrow('NOT_FOUND');

    spy.mockRestore();
  })

  test('다른 유저가 삭제 시 FORBIDDEN', async () => {
    const userId = 1;
    const ownerId = 2;
    const productId = 1;

    const spyFind = jest.spyOn(productRepository, 'findById').mockResolvedValue({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: ownerId, // 소유자
    });


    await expect(productService.remove(userId, productId))
      .rejects
      .toThrow('FORBIDDEN');

    spyFind.mockRestore();


  });
});

describe('제품 좋아요 함수 테스트', () => {
  test('좋아요 성공', async () => {
    const userId = 1;
    const productId = 1;

    const spyFind = jest.spyOn(productRepository, 'findById').mockResolvedValue({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    })

    const spyLike = jest.spyOn(productRepository, 'findProductLike').mockResolvedValue(null);
    const spyCreateLike = jest.spyOn(productRepository, 'createProductLike').mockResolvedValue({
      id: 1,
      userId,
      productId,
      createdAt: new Date()
    });

    const result = await productService.like(userId, productId);
    expect(result).toEqual({
      id: 1,
      userId,
      productId,
      createdAt: expect.any(Date),
    });


    expect(spyFind).toHaveBeenCalledWith(productId);
    expect(spyLike).toHaveBeenCalledWith(userId, productId)
    expect(spyCreateLike).toHaveBeenCalledWith(userId, productId);

    spyFind.mockRestore();
    spyLike.mockRestore();
    spyCreateLike.mockRestore();
  })


  test('제품이 없는 경우', async () => {
    const userId = 1;
    const productId = 1;

    const spyFind = jest.spyOn(productRepository, 'findById').mockResolvedValue(null);

    await expect(productService.like(userId, productId))
      .rejects.toThrow('NOT_FOUND');

    expect(spyFind).toHaveBeenCalledWith(productId);

    spyFind.mockRestore();

  });

  test('중복 좋아요를 누를 경우', async () => {
    const userId = 1;
    const productId = 1;

    jest.spyOn(productRepository, 'findById').mockResolvedValue({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    })

    jest.spyOn(productRepository, 'findProductLike').mockResolvedValue({
      id: 99,
      userId,
      productId,
      createdAt: new Date(),
    });

    const spyCreateLike = jest.spyOn(productRepository, 'createProductLike');


    await expect(productService.like(userId, productId))
      .rejects.toThrow('CONFLICT');

    expect(spyCreateLike).not.toHaveBeenCalled();
  })

});



describe('좋아요 취소 함수 테스트 ', () => {
  test('좋아요 취소 성공', async () => {
    const userId = 1;
    const productId = 1;

    const spyFind = jest.spyOn(productRepository, 'findById').mockResolvedValue({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    });


    const spyLike = jest.spyOn(productRepository, 'findProductLike').mockResolvedValue({
      id: 1,
      userId,
      productId,
      createdAt: new Date()
    });


    const spyCancelLike = jest.spyOn(productRepository, 'deleteProductLike').mockResolvedValue({
      id: 1,
      userId,
      productId,
      createdAt: new Date()
    });

    // 실제 서비스 호출
    const result = await productService.cancelLike(userId, productId);

    // 반환값 검증
    expect(result).toEqual({
      id: 1,
      userId,
      productId,
      createdAt: expect.any(Date),
    });

    // spy 호출 검증
    expect(spyFind).toHaveBeenCalledWith(productId);
    expect(spyLike).toHaveBeenCalledWith(userId, productId);
    expect(spyCancelLike).toHaveBeenCalledWith(userId, productId);

    // spy 복원
    spyFind.mockRestore();
    spyLike.mockRestore();
    spyCancelLike.mockRestore();
  });

  test('없는 제품 좋아요 취소', async () => {
    const userId = 1;
    const productId = 1;

    const spyFind = jest.spyOn(productRepository, 'findById').mockResolvedValue(null);

    await expect(productService.cancelLike(userId, productId))
      .rejects.toThrow('NOT_FOUND');

    expect(spyFind).toHaveBeenCalledWith(productId);

    spyFind.mockRestore();
  });

  test('좋아요 누르지 않은 제품 좋아요 취소', async () => {
    const userId = 1;
    const productId = 1;

    const spyFind = jest.spyOn(productRepository, 'findById').mockResolvedValue({
      id: productId,
      name: "닌텐도",
      description: "별로",
      price: 123123,
      tags: ["애들", "장난감"],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    });

    const spyLike = jest.spyOn(productRepository, 'findProductLike').mockResolvedValue(null);

   
    await expect(productService.cancelLike(userId, productId))
      .rejects.toThrow('NOT_LIKED');

    spyFind.mockRestore();
    spyLike.mockRestore();

  })


})


describe("likesList 함수 테스트", () => {
  test("정상적으로 좋아요한 상품 조회", async () => {
    const userId = 1;

    // 1. 좋아요한 상품 목록 mock
    const spyFindUserLikes = jest.spyOn(productRepository, "findUserLikes").mockResolvedValue([
      { productId: 101 },
      { productId: 102 },
    ]);

    // 2. 상품 정보 조회 mock
    const spyFindProductsByIds = jest.spyOn(productRepository, "findProductsByIds").mockResolvedValue([
      { id: 101, name: "상품1", price: 10000, createdAt: new Date() },
      { id: 102, name: "상품2", price: 110000, createdAt: new Date() },
    ]);

    const result = await productService.likesList(userId);

    expect(result).toEqual([
      { id: 101, name: "상품1", price: 10000, createdAt: new Date() },
      { id: 102, name: "상품2", price: 110000, createdAt: new Date() },
    ]);

    expect(spyFindUserLikes).toHaveBeenCalledWith(userId);
    expect(spyFindProductsByIds).toHaveBeenCalledWith([101, 102]);

    spyFindUserLikes.mockRestore();
    spyFindProductsByIds.mockRestore();
  });

  test("로그인 안 한 경우", async () => {
    await expect(productService.likesList(null as any))
      .rejects
      .toThrow("UNAUTHORIZED");
  });
});


describe("isLiked 함수 테스트", () => {
  test("정상적으로 모든 상품 조회 및 좋아요 표시", async () => {
    const userId = 1;

    const spyFindUserLikes = jest.spyOn(productRepository, "findUserLikes").mockResolvedValue([
      { productId: 1 },
      { productId: 2 },
    ]);

    const spyFindAllProducts = jest.spyOn(productRepository, "findAllProducts").mockResolvedValue([
      {
        id: 1,
        name: "닌텐도",
        description: "별로",
        price: 123123,
        tags: ["애들", "장난감"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "닌텐도",
        description: "별로",
        price: 123123,
        tags: ["애들", "장난감"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "닌텐도",
        description: "별로",
        price: 123123,
        tags: ["애들", "장난감"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await productService.isLiked(userId);

    expect(result).toMatchObject([
      { id: 1, name: "닌텐도", isLiked: true },
      { id: 2, name: "닌텐도", isLiked: true },
      { id: 3, name: "닌텐도", isLiked: false },
    ]);

    expect(spyFindUserLikes).toHaveBeenCalledWith(userId);
    expect(spyFindAllProducts).toHaveBeenCalled();

    spyFindUserLikes.mockRestore();
    spyFindAllProducts.mockRestore();
  });

  test("좋아요한 상품이 없는 경우", async () => {
    const userId = 1;
    jest.spyOn(productRepository, "findUserLikes").mockResolvedValue([]);

    await expect(productService.isLiked(userId))
      .rejects
      .toThrow("NOT_FOUND");
  });

  test("로그인 안 한 경우", async () => {
    await expect(productService.isLiked(null as any))
      .rejects
      .toThrow("UNAUTHORIZED");
  });
});