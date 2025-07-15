import { instance } from './main.js';

function getArticleList(params = {}){
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

function getArticle(id){
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

function createArticle(payload = {}){

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