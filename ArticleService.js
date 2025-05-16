export function getArticlelist(){
    return fetch('https://panda-market-api-crud.vercel.app/articles?page=1&pageSize=10')
    .then((res) => {
        if(!res.ok){
            throw new Error(`오류발생 상태코드: ${res.status}`)
        }else{
            return res.json();
        }
    })
}
//  getArticlelist().then((data) => {console.log("받은 데이터:", data);});

export function getArticle(id){
    return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    .then((res)=> {
        if(!res.ok){
            throw new Error(`오류발생 상태코드: ${res.status}`)
        }else{
            return res.json()
        }
    })   
}
// getArticle(1319).then((data) => console.log(data))


const articleData = {
    image: "https://example.com/...",
    content: "게시글 내용입니다.",
    title: "게시글 제목입니다."
}

export function createArticle(articleData) {
    fetch('https://panda-market-api-crud.vercel.app/articles',{      
        method: "POST",
        body: JSON.stringify(articleData),
        headers: {
            'Content-Type':'application/json',
        },     
    })
    .then((res) => {
        if(!res.ok){
            throw new Error(`오류코드: ${res.status}`)
        }else{
            return res.json()
        }
    })
}
// createArticle(articleData).then((data) => console.log(data))

const artPatch = {
    image: "패치 게시글 이미지 입니다.",
    content: "패치 내용입니다.",
    title: "패치 제목입니다.",
};

export function patchArticle(id,artPatch) {
     return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`,{
        method: "PATCH",
        body: JSON.stringify(artPatch),
        headers: {
            'Content-Type':'application/json'
        },      
    })
    .then((res) => {
        if(!res.ok){
            throw new Error(`오류코드: ${res.status}`)
        }else{
            return res.json()
        }
    })
}
//patchArticle(1327,artPatch).then((data) => console.log(data)) 
// error 오류코드 400 발생

export function deleteArticle(id){
    return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`,{
        method: "DELETE",
        body: JSON.stringify(articleData),
        headers: {
            'Content-Type':'application/json'
        },       
    })
    .then((res) => {
        if(!res.ok){
            throw new Error(`오류코드: ${res.status}`)
        }else{
            return res.json()
        }
    })
}

// deleteArticle(1327).then((data) => console.log(data))
// getArticle(1327).then((data) => console.log(data))
// 오류코드 404발생


