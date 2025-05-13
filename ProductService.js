//✅ Product API
const BASE_URL = `https://panda-market-api-crud.vercel.app/products`;

export async function getProductList(page, pageSize, keyword) {
    try {
        const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;

        await fetch(url)
            .then((res) => {
                if (!res.ok) {
                    console.log(`err: 제품 목록 가져오기 실패`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(`Product 목록:`, data);
            })
            .catch((err) => {
                console.error(`getProductList 에러`, err.message);
            });
    } catch (err) {
        console.error(`❌에러 발생:`, error.message);
    }
}

export async function getProduct(id) {
    try {
        const url = `${BASE_URL}/${id}`;
        await fetch(url)
            .then((res) => {
                if (!res.ok) {
                    console.log(`err: 제품 가져오기 실패`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(`제품 가져오기 성공`, data);
            })
            .catch((err) => {
                console.error(`getProduct 에러:`, err.message);
            });
    } catch (err) {
        console.error(`❌에러 발생:`, err.message);
    }
}

export async function createProduct(data) {
    try {
        const url = `${BASE_URL}`;

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    console.log(`상품 등록 실패`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(`상품 등록 성공`, data);
            })
            .catch((err) => {
                console.error(`createProduct 에러:`, err.message);
            });
    } catch (err) {
        console.error(`❌에러 발생:`, error.message);
    }
}

export async function patchProduct(id, data) {
    try {
        const url = `${BASE_URL}/${id}`;

        await fetch(url, {
            method: 'PATCH', // POST 복사해온 것 정신차리고 PATCH로 수정하자!
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    console.log(`상품 수정 실패`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(`상품 수정 성공`, data);
            })
            .catch((err) => {
                console.error(`patchProduct 에러:`, err.message);
            });
    } catch (err) {
        console.error(`❌에러 발생:`, err.message);
    }
}

export async function deleteProduct(id) {
    try {
        const url = `${BASE_URL}/${id}`;

        await fetch(url, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    console.log(`상품 삭제 실패`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(`상품 삭제 성공`, data);
            })
            .catch((err) => {
                console.error(`deleteProduct 에러 :`, err.message);
            });
    } catch (err) {
        console.error(`❌에러 발생:`, err.message);
    }
}


