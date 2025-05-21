import axios from 'axios';

export function getArticleList(page = 1, pageSize = 10, keyword = '') {
   const url = `https://panda-market-api-crud.vercel.app/articles`
   const query = `?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}` 

  axios.get( url + query)
   .then((res) => {console.log('불러오기 성공', res.data)
    return res.data
   })
   .catch((err) => {console.error('불러오기 실패',err.message)})
}


export function getArticle(id) {
    const url = `https://panda-market-api-crud.vercel.app/articles/${id}`

    axios.get(url)
   .then((res) => {console.log('전체 불러오기 성공', res.data)
    return res.data
   })
   .catch((err) => {console.error('전체 불러오기 실패', err.message)})
}   

export function createArticle( title, content, image ) {
    const url = `https://panda-market-api-crud.vercel.app/articles/`

    axios.post(url,{
        title: title,
        content: content,
        image: image
    })
    .then((res) => {console.log('추가 성공', res.data)
    return res.data
    })
    .catch((err) => {console.error('추가 실패',err.message)})
}    

export function patchArticle(id, updatedata) {
    const url = `https://panda-market-api-crud.vercel.app/articles/${id}`

    axios.patch(url, updatedata)
   .then((res) => {console.log('수정 성공', res.data)
    return res.data
   })
   .catch((err) => {console.error('수정 실패',err.message)})
}   

export function deleteArticle(id) {
    const url = `https://panda-market-api-crud.vercel.app/articles/${id}`

    axios.delete(url)
   .then((res) => {console.log('삭제 성공', res.data)
    return res.data
   })
   .catch((err) => {console.error('삭제 실패',err.message)})
}   
