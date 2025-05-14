export async function getProductList(params = {}) {
  try {
    const url = new URL('https://panda-market-api-crud.vercel.app/products');
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`상품 목록을 불러오는데 실패했습니다.`);
    }
    return await res.json();
  } catch (error) {
    console.error('상품 목록 조회 중 오류가 발생했습니다.:', error);
    throw error;
  }
}

export async function getProduct(productId) {
  try {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`);
    if (!res.ok) {
      throw new Error(`상품을 불러오는데 실패했습니다.`);
    }
    return await res.json();
  } catch (error) {
    console.error(`상품 조회 중 오류가 발생했습니다.:`, error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const res = await fetch('https://panda-market-api-crud.vercel.app/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      throw new Error(`상품을 생성하는데 실패했습니다: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('상품 생성 중 오류가 발생했습니다.:', error);
    throw error;
  }
}

export async function patchProduct(productId, productData) {
  try {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      throw new Error(`상품을 수정하는데 실패했습니다.`);
    }
    return await res.json();
  } catch (error) {
    console.error(`상품 수정 중 오류가 발생했습니다.:`, error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${productId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`상품을 삭제하는데 실패했습니다.`);
    }
    return await res.json();
  } catch (error) {
    console.error(`상품 삭제 중 오류가 발생했습니다.:`, error);
    throw error;
  }
}