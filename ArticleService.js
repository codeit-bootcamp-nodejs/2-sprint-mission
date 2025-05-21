
class Article {
    constructor(title, content, writer, likeCount) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount;
        this.createdAt = new Date()
    }

    Like() {
        this.likeCount += 1;
    }

}

export { Article };




export function getArticleList(page, pageSize) {
    const url = new URL('https://panda-market-api-crud.vercel.app/articles')
    url.searchParams.append('page', page);
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('keyword', '');

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`데이터 요청 실패. 상태 코드: ${response.status}`);
            } return response.json()
        })
        .catch((error) => {
            console.error('에러 발생', error);
        })

}




export function getArticle() {
    const url = 'https://panda-market-api-crud.vercel.app/articles'
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`데이터 요청 실패. 상태 코드: ${response.status}`);
            } return response.json()
        })
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error('에러 발생', error);
        })
};



export function createArticle(title, content, image) {
    const url = 'https://panda-market-api-crud.vercel.app/articles';
    const requestBody = { title, content, image };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`데이터 생성 실패. 상태 코드: ${response.status}`)
            } return response.json()
        })
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error('에러 발생', error);
        })
}



export function patchArticle(articleId, title, content, image) {
    const url = `https://panda-market-api-crud.vercel.app/articles/${articleId}`
    const requestBody = { title, content, image };

    return fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`데이터 수정 실패. 상태 코드: ${response.status}`);
            } return response.json()
        })
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error('에러 발생', error);
        })
}



export function deleteArticle(articleId) {
    const url = `https://panda-market-api-crud.vercel.app/articles/${articleId}`
    return fetch(url, {
        method: 'DELETE',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`데이터 삭제 실패. 상태 코드: ${response.status}`);
            } return response.json()
        })
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error('삭제 실패', error);
        })
}



