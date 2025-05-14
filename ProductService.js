class Product {
    constructor(name, description, price, tags, images, favoriteCount = 0) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
        this.favoriteCount = favoriteCount
    }
    favorite() {
        this.favoriteCount += 1
    }
}

class ElectronicProduct extends Product {
    constructor(name, description, price, tags, images, favoriteCount = 0, manufacturer) {
        super(name, description, price, tags, images, favoriteCount);
        this.manufacturer = manufacturer;
    }
}

export { Product, ElectronicProduct };



export async function getProductList() {
    try {
        const url = new URL('https://panda-market-api-crud.vercel.app/products')
        url.searchParams.append('page', 1);
        url.searchParams.append('pageSize', 10);
        url.searchParams.append('keyword', '');

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!res.ok) {
            throw new Error('데이터를 가져오는 데 실패했습니다.');
        }
        const data = await res.json();
        return data;

    } catch (error) {
        console.error('에러 발생', error);
        return null;
    }
}



export async function getProduct() {
    try {
        const res = await fetch('https://panda-market-api-crud.vercel.app/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!res.ok) {
            throw new Error(`데이터 요청 실패. 상태 코드: ${res.status}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('에러 발생', error);
        return null;
    }
}


export async function createProduct(name, description, price, tags, images) {
    try {
        const res = await fetch('https://panda-market-api-crud.vercel.app/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price, tags, images }),

        }
        )

        if (!res.ok) {
            throw new Error(`데이터 생성 실패. 상태 코드: ${res.status}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('에러 발생', error);
        return null;
    }
}

export async function patchProduct(productId, name, description, price, tags, images) {
    try {
        const res = await fetch(`https://panda-market-api-crud.vercel.app/products${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price, tags, images }),

        });

        if (!res.ok) {
            throw new Error(`데이터 수정 실패. 상태 코드: ${res.status}`);
        }

        const data = await res.json();
        return data

    } catch (error) {
        console.error('에러 발생', error);
        return null;
    }
}


export async function deleteProduct(productId) {
    try {
        const res = await fetch(`https://panda-market-api-crud.vercel.app/products${productId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`데이터 삭제 실패. 상태 코드: ${res.status}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('에러 발생', error);
        return null;
    }
}

