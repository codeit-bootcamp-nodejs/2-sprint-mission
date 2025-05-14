import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://panda-market-api-crud.vercel.app',
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
})

/**
 * 게시물 조회
 *
 * @param queryParam {Object} - 쿼리 파라미터
 * @param queryParam.page {Number} - 게시물 제목
 * @param queryParam.pageSize {Number} - 게시물 내용
 * @param queryParam.keyword {String} - 이미지 URL
 */
export const getProductList = async (queryParam = {}) => {
	try {
		const { page, pageSize, keyword } = queryParam;
		const params = {
			page: page || 1,
			pageSize: pageSize || 10,
			keyword: keyword || '',
		};
		const response = await instance.get(`/products`, { params });
		const data = response.data;
		const list = data.list;
		return list;
	} catch (error) {
		console.error(`Error fetching product list:`, error);
	}
}

/** 
 * 특정 게시물 조회
 * 
 * @param id {Number} - 게시물 ID
 */
export const getProduct = async (productId) => {
	try {
		const response = await instance.get(`/products/${productId}`);
		const data = response.data;
		return data;
	} catch (error) {
		console.error(`Error fetching product list:`, error);
	}
}
/** 
 * 게시물 생성
 * 
 * @param queryParam {Object} - 쿼리 파라미터
 * @param queryParam.name {String} - 상품명
 * @param queryParam.price {Number} - 상품 가격
 * @param queryParam.description {String} - 상품 설명
 * @param queryParam.images {Array} - 상품 이미지	
 * @param queryParam.tags {Array} - 상품 태그
 */
export const createProduct = async (queryParam) => {
	try {
		const { name, price, description, images, tags } = queryParam;
		const params = {
			name: name || '',
			price: price || 0,
			description: description || '',
			images: images || [],
			tags: tags || [],
		};
		const response = await instance.post(`/products`, params);
		const data = response.data;
		return data;
	} catch (error) {
		console.error(`Error fetching product list:`, error);
	}
}

/** 
 * 특정 게시물 수정
 * 
 * @param productId {Number} - 게시물 ID
 * @param queryParam {Object} - 쿼리 파라미터
 * @param queryParam.name {String} - 상품명
 * @param queryParam.price {Number} - 상품 가격
 * @param queryParam.description {String} - 상품 설명
 * @param queryParam.images {Array} - 상품 이미지
 * @param queryParam.tags {Array} - 상품 태그
 */
export const patchProduct = async (productId, queryParam) => {
	try {
		const response = await instance.patch(`/products/${productId}`, queryParam);
		const data = response.data;
		return data;
	} catch (error) {
		console.error(`Error fetching product list:`, error);
	}
}

/** 
 * 특정 게시물 삭제
 * 
 * @param id {Number} - 게시물 ID
 */
export const deleteProduct = async (productId) => {
	try {
		const response = await instance.delete(`/products/${productId}`);
		const data = response.data;
		return data;
	} catch (error) {
		console.error(`Error fetching product list:`, error);
	}
}