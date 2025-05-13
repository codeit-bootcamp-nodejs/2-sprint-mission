export async function getProductList(params = {}) {
  //GET/ 상품 목록 조회 (쿼리 파라미터)
  const url = new URL("https://panda-market-api-crud.vercel.app/products");
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  try {
    const res = await fetch(url);
    if (!res.ok) {
      //응답 코드가 2xx가 아닐 경우
      throw new Error("데이터를 불러오는데 실패했습니다.");
    }
    const data = await res.json();
    console.log("받은 데이터", data);
    return data;
  } catch (error) {
    console.error(error);
    return null; // 에러 발생 시 null 반환
  }
}

export async function getProduct(id) {
  //상품 조회
  try {
    const res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`
    );
    if (!res.ok) {
      throw new Error(`${id} 조회 실패`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null; // 에러 발생 시 null 반환
  }
}

export async function createProduct(name, description, price, tags, images) {
  //POST/ 상품 생성
  try {
    const res = await fetch(
      "https://panda-market-api-crud.vercel.app/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, price, tags, images }),
      }
    );
    if (!res.ok) {
      throw new Error("상품 생성 실패");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null; // 에러 발생 시 null 반환
  }
}

export async function patchProduct(id, name, description, price, tags, images) {
  // PATCH 상품 수정
  try {
    const res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, price, tags, images }),
      }
    );
    if (!res.ok) {
      throw new Error(`ID:${id} 수정 실패`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteProduct(id) {
  //DELETE 상품삭제
  try {
    const res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "delete",
      }
    );
    if (!res.ok) {
      throw new Error(`ID:${id} 삭제 실패`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null; // 에러 발생 시 null 반환
  }
}
