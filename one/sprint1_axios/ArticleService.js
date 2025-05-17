import { instance } from './main.js';

function getArticleList(params = {}){
    // const url = new URL('https://panda-market-api-crud.vercel.app/articles');
    // Object.keys(params).forEach((v) => url.searchParams.append(v, params[v]));
    // return fetch(url)
    //             .then((res) => {
    //                 if(!res.ok){
    //                     console.log(res.status + '응답이 발생했습니다.');
    //                 }

    //                 return res.json();
    //             })

    //             .then((data) => console.log(data))
    //             .catch((err) => console.log(err))
    //             .finally(() => console.log('getArticleList End'));
    return instance.get('/articles', { params })
                .then((res) => console.log(res.data))
                .catch((err) => {
                    if(err.response){
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                    } else if(err.reeuest){
                        console.log(err.request);
                    } else {
                        console.log(err.message);
                    }
                });
}

// getArticleList({page:1, pageSize:10, orderBy:'recent',keyword:'테스트'});

function getArticle(id){
    // return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    //             .then((res) => {
    //                 if(!res.ok){
    //                     console.log(res.status + '응답이 발생했습니다.');
    //                 }

    //                 return res.json();
    //             })

    //             .then((data) => console.log(data))
    //             .catch((err) => console.log(err))
    //             .finally(() => console.log('getArticle End'));

    return instance.get(`/articles/${id}`)
                .then((res) => console.log(res.data))
                .catch((err) => {
                    if(err.response){
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                    } else if(err.reeuest){
                        console.log(err.request);
                    } else {
                        console.log(err.message);
                    }
                });
}

// getArticle(10);

function createArticle(payload = {}){
    // return fetch(`https://panda-market-api-crud.vercel.app/articles`, {
    //     method: 'POST',
    //     headers: {'content-type':'application/json'},
    //     body:JSON.stringify(payload)
    // })
    //             .then((res) => {
    //                 if(!res.ok){
    //                     console.log(res.status + '응답이 발생했습니다.');
    //                 }

    //                 return res.json();
    //             })

    //             .then((data) => console.log(data))
    //             .catch((err) => console.log(err))
    //             .finally(() => console.log('createArticle End'));

    return instance.post('/articles', payload)
                .then((res) => res.data.id)
                .catch((err) => {
                    if(err.response){
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                    } else if(err.reeuest){
                        console.log(err.request);
                    } else {
                        console.log(err.message);
                    }
                });
}

function patchArticle(id, data){
    // return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    //     method: 'PATCH',
    //     headers: {'content-type':'application/json'},
    //     body:JSON.stringify(data)
    // })
    //             .then((res) => {
    //                 if(!res.ok){
    //                     console.log(res.status + '응답이 발생했습니다.');
    //                 }

    //                 return res.json();
    //             })

    //             .then((data) => console.log(data))
    //             .catch((err) => console.log(err))
    //             .finally(() => console.log('patchArticle End'));
    return instance.patch(`/articles/${id}`, data)
                .then((res) => console.log(res.data))
                .catch((err) => {
                    if(err.response){
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                    } else if(err.reeuest){
                        console.log(err.request);
                    } else {
                        console.log(err.message);
                    }
                });
}

function deleteArticle(id){
    // return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    //     method:'DELETE'
    // })
    //             .then((res) => {
    //                 if(!res.ok){
    //                     console.log(res.status + '응답이 발생했습니다.');
    //                 }

    //                 return res.json();
    //             })

    //             .then((data) => console.log(data))
    //             .catch((err) => console.log(err))
    //             .finally(() => console.log('deleteArticle End'));

    return instance.delete(`/articles/${id}`)
                .then((res) => console.log(res.data))
                .catch((err) => {
                    if(err.response){
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                    } else if(err.reeuest){
                        console.log(err.request);
                    } else {
                        console.log(err.message);
                    }
                });
}

export {getArticle, getArticleList, createArticle, patchArticle, deleteArticle};