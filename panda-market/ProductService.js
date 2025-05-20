import fetch from 'node-fetch';

const BASE_URL = 'https://panda-market-api-crud.vercel.app/products';

export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const response = await fetch(`${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`);
    if (!response.ok) throw new Error('Failed to fetch product list');
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

export async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

export async function createProduct(data) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

export async function patchProduct(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}