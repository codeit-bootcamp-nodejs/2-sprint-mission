// ArticleService.js
import axios from 'axios'; // axios 라이브러리를 사용하기 위해 import

const API_BASE_URL = 'https://panda-market-api-crud.vercel.app/docs'; // 기본 URL을 상수로 설정

// 게시글 목록 가져오기 (페이지네이션 및 검색 기능 포함)
function getArticleList(page = 1, pageSize = 10, keyword = '') {
  const url = `${API_BASE_URL}/articles?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
  return axios.get(url)
    .then(response => {
      console.log('Article List:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Error ${error.response?.status || ''}: Failed to fetch articles`, error.response?.data || error.message);
      // throw error; // 에러를 다시 던져서 호출한 쪽에서 처리하도록 할 수도 있습니다.
      return null;
    });
}

// 특정 게시글 가져오기
function getArticle(id) {
  const url = `${API_BASE_URL}/articles/${id}`;
  return axios.get(url)
    .then(response => {
      console.log('Article:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Error ${error.response?.status || ''}: Failed to fetch article`, error.response?.data || error.message);
      return null;
    });
}

// 새로운 게시글 생성하기
function createArticle(title, content, image) {
  const url = `${API_BASE_URL}/articles`;
  const body = { title, content, image };
  return axios.post(url, body)
    .then(response => {
      console.log('Created Article:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Error ${error.response?.status || ''}: Failed to create article`, error.response?.data || error.message);
      return null;
    });
}

// 게시글 삭제하기
function deleteArticle(id) {
  const url = `${API_BASE_URL}/articles/${id}`;
  return axios.delete(url)
    .then(() => {
      console.log(`Article ${id} deleted successfully`);
      return true; // 성공 여부 반환
    })
    .catch(error => {
      console.error(`Error ${error.response?.status || ''}: Failed to delete article`, error.response?.data || error.message);
      return false; // 실패 여부 반환
    });
}

// 다른 파일에서 이 함수들을 사용하려면 export 해주어야 합니다.
export { getArticleList, getArticle, createArticle, deleteArticle };