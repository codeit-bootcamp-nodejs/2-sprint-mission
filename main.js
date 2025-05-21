import { Article, getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './ArticleService.js';
import { Product, ElectronicProduct, getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js';



const products = [];

async function createProductInstance(page, pageSize, keyword) {
    const response = await getProductList(page, pageSize, keyword);
    const productListData = response

    if (!response) {
        console.error('상품 데이터를 가져오지 못했습니다...');
        return [];
    }

    const productInstances = productListData.list.map(product => {
        if (product.tags.includes("전자제품")) {
            return new ElectronicProduct(
                product.name,
                product.description,
                product.price,
                product.tags,
                product.images,
                product.favoriteCount,
                product.manufacturer
            );
        } else {
            return new Product(
                product.name,
                product.description,
                product.price,
                product.tags,
                product.images
            );
        }
    });

    products.push(...productInstances);
    console.log(products);
    return products;
}


// 인스턴스 생성 후 배열에 저장
createProductInstance(1, 10, null);


// //Product class 생성, 확인
// const product2 = new Product('맥북', 'string', 3000000, '전자제품', "https://example.com/...");
// console.log(product2);

// //ElectronicProduct class 생성, 확인
// const product3 = new ElectronicProduct('노트북', 'string', '2500000', '전자제품', "https://example.com/...", 0, 'samsung')
// console.log(product3)


// const product1 = {
//     name: '텀블러',
//     description: 'string',
//     price: 30000,
//     tags: '주방제품',
//     images: "https://example.com/...",
// };



// //getProduct 실행코드
// async function productData() {
//     const data = await getProduct();
//     if (data) {
//         console.log(data);
//     } else {
//         console.log('데이터를 가져올 수 없습니다.');
//     }
// }
// productData()

// //createProduct 실행코드
// createProduct(product1.name, product1.description, product1.price, product1.tags, product1.images);


// //patchProduct 실행코드, 아이디번호 필요시 변경
// patchProduct('837', product1.name, product1.description, product1.price, product1.tags, product1.images);

// //deletProduct 실행코드
// deleteProduct(839);


// //전자제품 태그 추가하여 electonicProduct 객체 생성 확인
// const product4 = {
//     name: '맥북프로15',
//     description: 'string',
//     price: 3000000,
//     tags: '전자제품',
//     images: "https://example.com/...",
// };
// createProduct(product4.name, product4.description, product4.price, product4.tags, product4.images)




// //Article class 생성 , 확인
// const article1 = new Article('2025년 벌써 5월 중순.. ', '아무것도 안 했는데 5월이 되어...', '윤희원')
// console.log(article1)


// //getArticleList 실행코드
// async function articleListData(page, pageSize) {
//     const data = await getArticleList(page, pageSize)
//     if (data) {
//         console.log(data)
//     } else {
//         console.log('데이터를 가져올 수 없습니다.')
//     }
// }
// articleListData(1, 20)

// //getArticle 실행코드
// async function articleData() {
//     const data = await getArticle()
//     if (data) {
//         console.log(data)
//     } else {
//         console.log('데이터를 가져올 수 없습니다.')
//     }
// }
// articleData()


// const article2 = {
//     title: '5월의 날씨는',
//     content: '25년 5월 날씨입니다...',
//     image: 'https://example.com/...',
// }

// //createArticle 실행코드
// createArticle(article2.title, article2.content, article2.image)

// //patchArticle 실행코드
// patchArticle(1320, article2.title, article2.content, article2.image)

// //deleteArticle 실행코드
// deleteArticle(1323)



