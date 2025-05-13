//✅ Article API
const BASE_URL = `https://panda-market-api-crud.vercel.app/articles`;
export async function getArticleList(page, pageSize, keyword) {
    const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;

    await fetch(url)
        .then((res) => {
            if (!res.ok) {
                console.log(`err: 글 목록 가져오기 실패 `);
            }
            return res.json();
        })
        .then((data) => {
            console.log(`Article 목록:`, data);
        })
        .catch((err) => {
            console.error(`getArticleList 에러`, err.message);
        });
}

export async function getArticle(id) {
    const url = `${BASE_URL}/${id}`;

    await fetch(url)
        .then((res) => {
            if (!res.ok) {
                console.log(`글 불러오기 실패`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(`Article:`, data);
        })
        .catch((err) => {
            console.error(`getArticle 에러`, err.message);
        });
}

export async function createArticle(article) {
    const url = `${BASE_URL}`;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
    })
        .then((res) => {
            if (!res.ok) {
                console.log(`글 작성 실패`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(`글 작성 성공`, data);
        })
        .catch((err) => {
            console.error(`createArticle 에러:`, err.message);
        });
}

export async function patchArticle(id, data) {
    const url = `${BASE_URL}/${id}`;

    await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (!res.ok) {
                console.log(`글 수정 실패`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(`글 수정 완료`, data);
        })
        .catch((err) => {
            console.error(`patchArticle 에러 :`, err.message);
        });
}



export async function deleteArticle(id) {
    const url = `${BASE_URL}/${id}`;

    await fetch(url, {
        method: 'DELETE',
    })
        .then((res) => {
            if (!res.ok) {
                console.log(`글 삭제 실패`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(`글 삭제 성공`, data);
        })
        .catch((err) => {
            console.error(`deleteArticle 에러 :`, err.message);
        });
}

