// ArticleService.js

const ARTICLE_API_URL = 'https://panda-market-api-crud.vercel.app/api/articles';

export const getArticleList = (page = 1, pageSize = 10, keyword = '') => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('pageSize', pageSize.toString());
  if (keyword) {
    queryParams.append('keyword', keyword);
  }

  return fetch(`${ARTICLE_API_URL}?${queryParams.toString()}`, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Error fetching article list: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error fetching article list:', error);
      throw error;
    });
};

export const getArticle = (articleId) => {
  return fetch(`${ARTICLE_API_URL}/${articleId}`, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Error fetching article ${articleId}: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Error fetching article ${articleId}:`, error);
      throw error;
    });
};

export const createArticle = (title, content, image) => {
  return fetch(ARTICLE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, image }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Error creating article: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error creating article:', error);
      throw error;
    });
};

export const patchArticle = (articleId, updatedData) => {
  return fetch(`${ARTICLE_API_URL}/${articleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Error patching article ${articleId}: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Error patching article ${articleId}:`, error);
      throw error;
    });
};

export const deleteArticle = (articleId) => {
  return fetch(`${ARTICLE_API_URL}/${articleId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Error deleting article ${articleId}: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.ok; // 성공 시 true 반환 (또는 응답 데이터에 따라 변경)
    })
    .catch((error) => {
      console.error(`Error deleting article ${articleId}:`, error);
      throw error;
    });
};