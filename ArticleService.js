export function getArticleList(params = {}) {
  //GET 메소드
  const url = new URL("https://panda-market-api-crud.vercel.app/articles");
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        //응답 코드가 2xx가 아닐 경우
        throw new Error("데이터를 불러오는데 실패했습니다.");
      }
      return res.json();
    })
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}

export function getArticle(id) {
  //GET 메소드
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("error"));
}

export function createArticle(title, content, image) {
  //POST 메소드
  return fetch("https://panda-market-api-crud.vercel.app/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, image }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("error"));
}

export function patchArticle(id, newtitle, content, image) {
  // PATCH 메소드
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newtitle, content, image }),
  })
    .then((res) => res.json())
    .then((data) => console.log(`게시글 ${id}제목이 수정되었습니다.`, data))
    .catch((err) => console.error("error"));
}

export function deleteArticle(id) {
  //DELETE 메소드
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("error"));
}
