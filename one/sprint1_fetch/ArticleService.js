
function getArticleList(params = {}){
    const url = new URL('https://panda-market-api-crud.vercel.app/articles');
    Object.keys(params).forEach((v) => url.searchParams.append(v, params[v]));
    return fetch(url)
                .then((res) => {
                    if(!res.ok){
                        console.log(res.status + '응답이 발생했습니다.');
                    }

                    return res.json();
                })

                .then((data) => console.log(data))
                .catch((err) => console.log(err))
                .finally(() => console.log('getArticleList End'));
}

function getArticle(id){
    return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
                .then((res) => {
                    if(!res.ok){
                        console.log(res.status + '응답이 발생했습니다.');
                    }

                    return res.json();
                })

                .then((data) => console.log(data))
                .catch((err) => console.log(err))
                .finally(() => console.log('getArticle End'));
}

function createArticle(payload){
    return fetch(`https://panda-market-api-crud.vercel.app/articles`, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body:JSON.stringify(payload)
    })
                .then((res) => {
                    if(!res.ok){
                        console.log(res.status + '응답이 발생했습니다.');
                    }

                    return res.json();
                })

                .then((data) => {console.log(data);return data.id})
                .catch((err) => console.log(err))
                .finally((id) => (console.log('createArticle End'),id));
}

function patchArticle(id, data){
    return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
        method: 'PATCH',
        headers: {'content-type':'application/json'},
        body:JSON.stringify(data)
    })
                .then((res) => {
                    if(!res.ok){
                        console.log(res.status + '응답이 발생했습니다.');
                    }

                    return res.json();
                })

                .then((data) => console.log(data))
                .catch((err) => console.log(err))
                .finally(() => console.log('patchArticle End'));
}

function deleteArticle(id){
    return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
        method:'DELETE'
    })
                .then((res) => {
                    if(!res.ok){
                        console.log(res.status + '응답이 발생했습니다.');
                    }

                    return res.json();
                })

                .then((data) => console.log(data))
                .catch((err) => console.log(err))
                .finally(() => console.log('deleteArticle End'));
}

export {getArticle, getArticleList, createArticle, patchArticle, deleteArticle};