const ARTICLE_BASE_URL = 'https://panda-market-api-crud.vercel.app/articles';


export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  return fetch(
    `${ARTICLE_BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`
  )
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error fetching article list:', error.message);
      throw error;
    });
}

export function getArticle(id) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error fetching article:', error.message);
      throw error;
    });
}

export function createArticle({ title, content, image }) {
  return fetch(ARTICLE_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, image }),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error creating article:', error.message);
      throw error;
    });
}

export function patchArticle(id, updates) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error updating article:', error.message);
      throw error;
    });
}

export function deleteArticle(id) {
  return fetch(`${ARTICLE_BASE_URL}/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch(error => {
      console.error('Error deleting article:', error.message);
      throw error;
    });
}
