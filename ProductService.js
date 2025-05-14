const BASE_URL = "https://panda-market-api-crud.vercel.app/products";

export async function getProductList({ page = 1, pageSize = 20, keyword = '' }) {
  const query = new URLSearchParams({ page, pageSize, keyword }).toString();
  try {
    const res = await fetch(`${BASE_URL}?${query}`, { method: 'GET' });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API 에러: ${errorText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('getProductList 에러:', error);
  }
}

export async function getProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { 
      method: 'GET' 
    });
    if (!res.ok) {
      throw new Error('API 에러');
    }
    return await res.json();
  } catch (error) {
    console.error('getProduct 에러:', error);
  }
}

export async function createProduct({ name, description, price, tags, images }) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, price, tags, images }),
    });
    if (!res.ok) {
      throw new Error('API 에러');
    }
    return await res.json();
  } catch (error) {
    console.error('createProduct 에러:', error);
  }
}

export async function patchProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error('API 에러');
    }
    return await res.json();
  } catch (error) {
    console.error('patchProduct 에러:', error);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { 
      method: "DELETE" 
    });
    if (!res.ok) {
      throw new Error('API 에러');
    }
    return await res.json();
  } catch (error) {
    console.error('deleteProduct 에러:', error);
  }
}
