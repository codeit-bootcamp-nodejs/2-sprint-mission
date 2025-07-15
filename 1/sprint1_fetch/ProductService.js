import {ElectronicProduct, Product} from './main.js';
import dotenv from 'dotenv'
dotenv.config({path: '../.env'});

async function getProductList(params = {}){
    try{
        const url = new URL(`${process.env.APIHOST}/products`);
        Object.keys(params).forEach((v) => url.searchParams.append(v, params[v]));
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(res.status + '응답이 발생했습니다.');
        }

        const products = [];
        const items = await res.json();

        for(const item of items['list']){
            const { name, description, price, tags, images, favoriteCount, manufacturer } = item;
            
            if(item.tags.includes('전자제품'))
                products.push(new ElectronicProduct(name, description, price, tags, images, favoriteCount, manufacturer));
            else
                products.push(new Product(name, description, price, tags, images, favoriteCount));
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
        const res = await fetch(`${process.env.APIHOST}/products/${id}`);
        if(!res.ok){
            throw new Error(res.status + '응답이 발생했습니다.');
        }

        const productById = await res.json();

        console.log(productById);
    } catch(err){
        console.log(err);
    } finally {
        console.log('getProduct End');
    }
}

async function createProduct(data){
    let rv;
    try{
        const res = await fetch(`${process.env.APIHOST}/products`, {
            method: 'POST',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(data)
        });
        if(!res.ok){
            throw new Error(res.status + '응답이 발생했습니다.');
        }

        const createdProduct = await res.json();

        console.log(createdProduct);
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
        const res = await fetch(`${process.env.APIHOST}/products/${id}`,{
            method: 'PATCH',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(data)
        });

        if(!res.ok){
            throw new Error(res.status + '응답이 발생했습니다.');
        }

        const patchedProduct = await res.json();

        console.log(patchedProduct);
    } catch(err){
        console.log(err);
    } finally {
        console.log('patchProduct End');
    }
}

async function deleteProduct(id){
    try{
        const res = await fetch(`${process.env.APIHOST}/products/${id}`, {
            method:'DELETE'
        });
        if(!res.ok){
            throw new Error(res.status + '응답이 발생했습니다.');
        }

        const deletedId = await res.json();

        console.log(deletedId);
    } catch(err){
        console.log(err);
    } finally {
        console.log('deleteProduct End');
    }
}

export {getProductList, getProduct, createProduct, patchProduct, deleteProduct};