export async function getProductList(){
    try{
        const url =  new URL('https://panda-market-api-crud.vercel.app/products'); 
        url.searchParams.append('page', 1)
        url.searchParams.append('pageSize', 10)
        url.searchParams.append('keyword', '')     
        const res = await fetch(url);
        const data = await res.json()
        return data;
     }catch(error){
        console.log('오류발생', error)
     }  
}
// console.log(await getProductList());

export async function getProduct(id){
    try{
    const url =  new URL(`https://panda-market-api-crud.vercel.app/products/${id}`); 
    url.searchParams.append('page', 1)
    url.searchParams.append('pageSize', 10)
    url.searchParams.append('keyword', '')
    
    const res = await fetch(url);
    const data = await res.json()
    return data;

   }catch(error){
    console.log('오류발생',error)
   }
}
//console.log(await getProduct(837));

const productData = {
    images: [
    "https://example.com/..."
    ],
    tags: [
    "전자제품"
    ],
    price: 0,
    description: "string",
    name: "상품 이름"
};

export async function createProduct(productData){
    try{
        const res = await fetch('https://panda-market-api-crud.vercel.app/products',{
        method : 'POST',
        body: JSON.stringify(productData),
        headers:{
            "Content-Type" : "application/json",
        },
    })
    const data = await res.json();
    return data;
    }catch(error){
        console.log('에러발생');
    }   
}

// console.log(await createProduct(productData));

const patchData = {
    name: '수정된 상품명',
    price: 3000,
}

export async function patchProduct(id,patchData){
    try{
        const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`,{
            method : 'PATCH',
            body: JSON.stringify(patchData),
            headers:{
                "Content-Type" : "application/json",
            },
        })
        const data = await res.json();
        return data;
    }catch(error){
        console.log('에러발생')
    }
}
//console.log(await patchProduct(837,patchData));

export async function deleteProduct(id){
    try{
        const res = await fetch(`https://panda-market-api-crud.vercel.app/products/${id}`,{
        method : 'DELETE',
        headers:{
            "Content-Type" : "application/json",
        },
    })
        const data = await res.json();
        return data;
    }catch(error){
        console.log('에러발생')
    }  
}
// console.log(await deleteProduct(838));
