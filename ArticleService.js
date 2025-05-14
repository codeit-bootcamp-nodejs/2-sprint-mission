const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

export function getArticleList({ page, pageSize, keyword }) {
  const query = new URLSearchParams({ page, pageSize, keyword }).toString();
  return fetch(`${BASE_URL}?${query}`, { 
    method: 'GET' 
  })
    .then(res => {
      if (!res.ok) 
      throw new Error('API 에러');
      return res.json();
    })
    .catch(error => {
      console.error('getArticleList 에러:', error);
    });
}

export function getArticle(id) {
  return fetch(`${BASE_URL}/${id}`, { 
    method: 'GET' 
  })
    .then(res => {
      if (!res.ok) 
      throw new Error('API 에러');
      return res.json();
    })
    .catch(error => {
      console.error('getArticle 에러:', error);
    });
}

export function createArticle({ title, content, image }) {
  return fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, image }),
  })
    .then(res => {
      if (!res.ok) 
      throw new Error('API 에러');
      return res.json();
    })
    .catch(error => {
      console.error('createArticle 에러:', error);
    });
}

export function patchArticle(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => {
      if (!res.ok) 
      throw new Error('API 에러');
      return res.json();
    })
    .catch(error => {
      console.error('patchArticle 에러:', error);
    });
}

export function deleteArticle(id) {
  return fetch(`${BASE_URL}/${id}`, { 
    method: "DELETE" 
  })
    .then(res => {
      if (!res.ok) 
      throw new Error('API 에러');
      return res.json();
    })
    .catch(error => {
      console.error('deleteArticle 에러:', error);
    });
}
