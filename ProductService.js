import axios from 'axios';

const PRODUCT_BASE_URL = 'https://panda-market-api-crud.vercel.app/products';


export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    const response = await axios.get(PRODUCT_BASE_URL, {
      params: { page, pageSize, keyword }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product list:', error.message);
    throw error;
  }
}

export async function getProduct(id) {
  try {
    const response = await axios.get(`${PRODUCT_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error.message);
    throw error;
  }
}

export async function createProduct({ name, description, price, tags, images }) {
  try {
    const response = await axios.post(PRODUCT_BASE_URL, { name, description, price, tags, images });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.message);
    throw error;
  }
}

export async function patchProduct(id, updates) {
  try {
    const response = await axios.patch(`${PRODUCT_BASE_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await axios.delete(`${PRODUCT_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.message);
    throw error;
  }
}

