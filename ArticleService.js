const BASE_URL = 'https://panda-market-api-crud.vercel.app/articles'; //####게시글 API 기본 URL

//####[GET] 게시글 목록 조회 함수
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error('getArticleList error:', err));
}
//####[GET] 단일 게시글 조회
export function getArticle(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error('getArticle error:', err));
}

//####[POST] 새 게시글 작성
export function createArticle({ title, content, image }) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, image }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error('createArticle error:', err));
}

//####[PATCH] 게시글 수정
export function patchArticle(id, data) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error('patchArticle error:', err));
}

//####[DELETE] 게시글 삭제
export function deleteArticle(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error('deleteArticle error:', err));
}

getArticleList(1, 5, '자바스크립트').then(data => {
  console.log('게시글 목록:', data);
});

//####게시글 하나 가져오기
getArticle('유효한_게시글_ID').then(article => {
  console.log('단일 게시글:', article);
});

//####새 게시글 작성
createArticle({
  title: '테스트 글입니다',
  content: '이것은 테스트용 본문입니다.',
  image: 'https://via.placeholder.com/150'
}).then(newArticle => {
  console.log('새 게시글 생성 완료:', newArticle);

//####생성된 글 수정하기
patchArticle(newArticle.id, {
  title: '수정된 테스트 글 제목',
  content: '내용도 수정되었습니다.'
}).then(updated => {
  console.log('게시글 수정 완료:', updated);

//####게시글 삭제하기
deleteArticle(newArticle.id).then(result => {
  console.log('게시글 삭제 완료:', result);
  });
  });
});