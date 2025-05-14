import axios from "axios";

const instance = axios.create({
	baseURL: 'https://panda-market-api-crud.vercel.app',
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
})

/**
 * 게시물 목록을 조회
 *
 * @param queryParam {Object} - 쿼리 파라미터
 * @param queryParam.page {Number} - 페이지 번호
 * @param queryParam.pageSize {Number} - 페이지 사이즈
 * @param queryParam.keyword {String} - 검색 키워드
 */
export const getArticleList = (queryParam = {}) => {
	const { page, pageSize, keyword } = queryParam;
	const params = {
		page: page || 1,
		pageSize: pageSize || 10,
		keyword: keyword || '',
	};
	return instance.get("/article", { params: params })
		.then((response) => {			
			if(!response.ok) throw new Error(`Error: ${response.status}`);
			const data = response.data;
			return data;
		})
		.catch((error) => {
			const res = error.response;
			console.log(`에러 발생\n ** 코드 : ${res.status}\n ** Msg : ${res.data.message} `);
		});
}

/**
 * 특정 게시물 조회
 *
 * @param id {Number} - 게시물 ID
 */
export const getArticle = (id) => {
	return instance.get(`/articles/${id}`)
		.then((response) => {
			if(!response.ok) throw new Error(`Error: ${response.status}`);
			const data = response.data;
			return data;
		})
		.catch((error) => {
			const res = error.response;
			console.log(`에러 발생\n ** 코드 : ${res.status}\n ** Msg : ${res.data.message} `);
		});
}

/**
 * 게시물 생성
 *
 * @param queryParam {Object} - 쿼리 파라미터
 * @param queryParam.title {String} - 게시물 제목
 * @param queryParam.content {String} - 게시물 내용
 * @param queryParam.image {String} - 이미지 URL
 */
export const createArticle = (queryParam) => {
	return instance.post("/articles", queryParam)
		.then((response) => {			
			if(!response.ok) throw new Error(`Error: ${response.status}`);
			const data = response.data;
			return data;
		})
		.catch((error) => {
			const res = error.response;
			console.log(`에러 발생\n ** 코드 : ${res.status}\n ** Msg : ${res.data.message} `);
		});
}

/**
 * 특정 게시물 수정
 *
 * @param id {Number} - 게시물 ID
 * @param queryParam {Object} - 쿼리 파라미터
 * @param queryParam.title {String} - 게시물 제목
 * @param queryParam.content {String} - 게시물 내용
 * @param queryParam.image {String} - 이미지 URL
 */
export const patchArticle = (id, queryParam = {}) => {
	return instance.patch(`/articles/${id}`, queryParam)
		.then((response) => {			
			if(!response.ok) throw new Error(`Error: ${response.status}`);
			const data = response.data;
			return data;
		})
		.catch((error) => {
			const res = error.response;
			console.log(`에러 발생\n ** 코드 : ${res.status}\n ** Msg : ${res.data.message} `);
		});
}

/**
 * 특정 게시물 삭제
 *
 * @param id {Number} - 게시물 ID
 */
export const deleteArticle = (id) => {
	return instance.delete(`/articles/${id}`)
		.then((response) => {			
			if(!response.ok) throw new Error(`Error: ${response.status}`);
			const data = response.data;
			return data;
		})
		.catch((error) => {
			const res = error.response;
			console.log(`에러 발생\n ** 코드 : ${res.status}\n ** Msg : ${res.data.message} `);
		});
}

