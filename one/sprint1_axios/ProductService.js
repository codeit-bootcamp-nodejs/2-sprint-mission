import {ElectronicProduct, Product} from './main.js';

import {instance} from './ArticleService.js';
async function getProductList(params = {}){
    // try{
    //     const url = new URL('https://panda-market-api-crud.vercel.app/products');
    //     Object.keys(params).forEach((v) => url.searchParams.append(v, params[v]));
    //     const res = await fetch(url);
    //     if(!res.ok){
    //         console.log(res.status + '응답이 발생했습니다.');
    //     }

    //     console.log(await res.json());
    // } catch(err) {
    //     console.log(err);
    // } finally {
    //     console.log('getProductList End');
    // }
    try{
        const res = await instance.get('/products', { params });
        const products = [];
        for(const item of res.data['list']){
            const itemToArray = Object.values(item).slice(1, 6);
            // console.log(itemToArray)
            if(item.tags.includes('전자제품'))
                products.push(new ElectronicProduct(...itemToArray, 0, `unknown`));
            else
                products.push(new Product(...itemToArray , 0));
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
    // try{
    //     const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`);
    //     if(!res.ok){
    //         console.log(res.status + '응답이 발생했습니다.');
    //     }

    //     console.log(await res.json());
    // } catch(err){
    //     console.log(err);
    // } finally {
    //     console.log('getProduct End');
    // }
    try{
        const res = await instance.get(`/products/${id}`);
        console.log(res.data);
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
    // try{
    //     const res = await fetch(`https://panda-market-api-crud.vercel.app/products`, {
    //         method: 'POST',
    //         headers: {'content-type':'application/json'},
    //         body: JSON.stringify(data)
    //     });
    //     if(!res.ok){
    //         console.log(res.status + '응답이 발생했습니다.');
    //     }

    //     console.log(await res.json());
    // } catch(err){
    //     console.log(err);
    // } finally {
    //     console.log('createProduct End');
    // }
    try{
        const res = await instance.post('/products', data);
        return res.data.id;
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
    // try{
    //     const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`,{
    //         method: 'PATCH',
    //         headers: {'content-type':'application/json'},
    //         body: JSON.stringify(data)
    //     });

    //     if(!res.ok){
    //         console.log(res.status + '응답이 발생했습니다.');
    //     }

    //     console.log(await res.json());
    // } catch(err){
    //     console.log(err);
    // } finally {
    //     console.log('patchProduct End');
    // }
    try{
        const res = await instance.patch(`/products/${id}`, data);
        console.log(res.data);
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
    // try{
    //     const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`, {
    //         method:'DELETE'
    //     });
    //     if(!res.ok){
    //         console.log(res.status + '응답이 발생했습니다.');
    //     }

    //     console.log(await res.json());
    // } catch(err){
    //     console.log(err);
    // } finally {
    //     console.log('deleteProduct End');
    // }
    try{
        const res = await instance.delete(`/products/${id}`);
        console.log(res.data);
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