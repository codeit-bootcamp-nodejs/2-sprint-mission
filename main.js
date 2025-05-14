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

    const productInstances = productListData.list.map(product => new Product(
        product.name,
        product.description,
        product.price,
        product.tags,
        product.images)
    );
    products.push(...productInstances);


    const eletoronicProductInstances = productListData.list
        .filter(product => {
            return Array.isArray(product.tags) && product.tags.includes("전자제품")
        })
        .map(product => new ElectronicProduct(
            product.name,
            product.description,
            product.price,
            product.tags,
            product.images,
            product.favoriteCount,
            product.manufacturer)

        );

    products.push(...eletoronicProductInstances)

    console.log(products);
    return products;
}


// createProductInstance(1, 10, null);


//Article 이용 
const article1 = new Article('2025년 벌써 5월 중순.. ', '아무것도 안 했는데 5월이 되어...', '윤희원')
console.log(article1)










