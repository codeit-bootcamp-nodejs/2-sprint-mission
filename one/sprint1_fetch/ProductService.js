import {ElectronicProduct, Product, apiKey} from './main.js';

async function getProductList(params = {}){
    try{
        const url = new URL(`${apiKey}/products`);
        Object.keys(params).forEach((v) => url.searchParams.append(v, params[v]));
        const res = await fetch(url);
        if(!res.ok){
            console.log(res.status + '응답이 발생했습니다.');
        }

        const products = [];
        for(const item of (await res.json())['list']){
            const itemToArray = Object.values(item).slice(1, 6);
            // console.log(itemToArray)
            if(item.tags.includes('전자제품'))
                products.push(new ElectronicProduct(...itemToArray, 0, `unknown`));
            else
                products.push(new Product(...itemToArray , 0));
        }
        console.log(products);
    } catch(err) {
        console.log(err);
    } finally {
        console.log('getProductList End');
    }
}

async function getProduct(id){
    try{
        const res = await fetch(`${apiKey}/products/${id}`);
        if(!res.ok){
            console.log(res.status + '응답이 발생했습니다.');
        }

        console.log(await res.json());
    } catch(err){
        console.log(err);
    } finally {
        console.log('getProduct End');
    }
}

async function createProduct(data){
    let rv;
    try{
        const res = await fetch(`${apiKey}/products`, {
            method: 'POST',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(data)
        });
        if(!res.ok){
            console.log(res.status + '응답이 발생했습니다.');
        }

        console.log(await res.json());
        rv = res.id;
    } catch(err){
        console.log(err);
        rv = null;
    } finally {
        console.log('createProduct End');
        return rv;
    }
}

async function patchProduct(id, data){
    try{
        const res = await fetch(`${apiKey}/products/${id}`,{
            method: 'PATCH',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(data)
        });

        if(!res.ok){
            console.log(res.status + '응답이 발생했습니다.');
        }

        console.log(await res.json());
    } catch(err){
        console.log(err);
    } finally {
        console.log('patchProduct End');
    }
}

async function deleteProduct(id){
    try{
        const res = await fetch(`${apiKey}/products/${id}`, {
            method:'DELETE'
        });
        if(!res.ok){
            console.log(res.status + '응답이 발생했습니다.');
        }

        console.log(await res.json());
    } catch(err){
        console.log(err);
    } finally {
        console.log('deleteProduct End');
    }
}

export {getProductList, getProduct, createProduct, patchProduct, deleteProduct};