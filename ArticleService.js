export async function getArticleList(params = {}) {
  const url = new URL('https://panda-market-api-crud.vercel.app/articles');
  Object.keys(params).forEach((key) =>{
    url.searchParams.append(key, params[key])
});

  const res = await fetch(url);

  if (!res.ok){
    throw new Error('데이터를 불러오는데 실패했습니다.')
  }
    const data = await res.json(); 
  return data;
}



export async function getArticle(articleId) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`);
  if (!res.ok) {
    throw new Error(`게시글을 불러오는데 실패했습니다.`);
  }
  const data = await res.json();
  return data;
}


export async function createArticle(articleData) {

  const postResponse = await fetch('https://panda-market-api-crud.vercel.app/articles', {
    method: 'POST',
    body: JSON.stringify(articleData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!postResponse.ok) {
    throw new Error(`게시글을 생성하는데 실패했습니다.`);
  }

  const data = await postResponse.json();
  return data;
}

export async function patchArticle(articleId, articleData) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, {
    method: 'PATCH',
    body: JSON.stringify(articleData),
    headers: {
        'Content-Type': 'application/json',
     },
   });
   
  if (!res.ok) {
    throw new Error(`게시글을 수정하는데 실패했습니다.`);
  }

  const data = await res.json();
   return data;
}
  
export async function deleteArticle(articleId) {
  const res = await fetch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, {
     method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`게시글을 삭제하는데 실패했습니다.`);
  }


  const data = await res.json();
  return data;
}




