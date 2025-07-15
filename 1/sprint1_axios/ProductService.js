import { ElectronicProduct, Product } from './main.js';
import { instance } from './main.js';

async function getProductList(params = {}){
    try{
        const res = await instance.get('/products', { params });
        
        const products = [];
        const items = res.data['list'];

        for(const item of items){
            const { name, description, price, tags, images, favoriteCount, manufacturer } = item;

            if(item.tags.includes('전자제품'))
                products.push(new ElectronicProduct(name, description, price, tags, images, favoriteCount, manufacturer));
            else
                products.push(new Product(name, description, price, tags, images, favoriteCount));
        }
        console.log(products);
    } catch(err){
        if(err.response){
            // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if(err.request){
            // 요청이 전송되었지만, 응답이 수신되지 않았습니다. 
            // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
            // node.js에서는 http.ClientRequest 인스턴스입니다.
            console.log(err.request);
        } else {
            // 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
            console.log(err.message);
        }
    }
}

async function getProduct(id){
    try{
        const res = await instance.get(`/products/${id}`);
        const productById = res.data;
        console.log(productById);
    } catch(err){
        if(err.response){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if(err.request){
            console.log(err.request);
        } else {
            console.log(err.message);
        }
    }
}

async function createProduct(data){
    try{
        const res = await instance.post('/products', data);
        const createdProduct = res.data;
        return createdProduct.id;
    } catch(err){
        if(err.response){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if(err.request){
            console.log(err.request);
        } else {
            console.log(err.message);
        }
    }
}

async function patchProduct(id, data){
    try{
        const res = await instance.patch(`/products/${id}`, data);
        const patchedProduct = res.data;
        console.log(patchedProduct);
    } catch(err){
        if(err.response){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if(err.request){
            console.log(err.request);
        } else {
            console.log(err.message);
        }
    }
}

async function deleteProduct(id){
    try{
        const res = await instance.delete(`/products/${id}`);
        const deletedId = res.data;
        console.log(deletedId);
    } catch(err){
        if(err.response){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        } else if(err.request){
            console.log(err.request);
        } else {
            console.log(err.message);
        }
    }
}

export {getProductList, getProduct, createProduct, patchProduct, deleteProduct};