import axios from 'axios';

export async function getProductList(page = 1, pageSize = 10, keyword = '') {
    const url = `https://panda-market-api-crud.vercel.app/products`
    const query = `?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}` 
 
    try {
        const res = await axios.get( url + query);
        console.log('전체 불러오기 성공', res.data)
        return res.data
    } catch (err) {
        console.error('전체 불러오기 실패',err.message)
    }
}

export async function getProduct(id) {
    const url = `https://panda-market-api-crud.vercel.app/products/${id}`
 
    try {
        const res = await axios.get(url);
        console.log('불러오기 성공', res.data)
        return res.data
    } catch (err) {
        console.error('불러오기 실패',err.message)
    }
}

export async function createProduct(name, description, price, tags = [], images = []) {
    const url = `https://panda-market-api-crud.vercel.app/products`
 
    try {
        const res = await axios.post(url,{
            name: name,
            description: description,
            price: price,
            tags: tags,
            images: images
        });
        console.log('추가 성공', res.data)
        return res.data
    } catch (err) {
        console.error('추가 실패',err.message)
    }
}

export async function patchProduct(id, updatedata) {
    const url = `https://panda-market-api-crud.vercel.app/products/${id}`
 
    try {
        const res = await axios.patch(url, updatedata);
        console.log('수정 성공', res.data)
        return res.data
    } catch (err) {
        console.error('수정 실패',err.message)
    }
}

export async function deleteProduct(id) {
    const url = `https://panda-market-api-crud.vercel.app/products/${id}`
 
    try {
        const res = await axios.delete(url);
        console.log('삭제 성공', res.data)
        return res.data
    } catch (err) {
        console.error('삭제 실패',err.message)
    }
}