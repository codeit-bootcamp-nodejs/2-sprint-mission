import { Article } from './model/Article.js';
import { Product, ElectronicProduct } from './model/Product.js';
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './service/ArticleService.js';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './service/ProductService.js';

/* getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장 */
const setProductsList = async (params) => {
	let products = [];
	const productList = await getProductList(params);

	productList.forEach((item) => {
		// 상품명, 상품 설명, 가격, 태그, 이미지, 찜하기 수
		// 전자제품 여부에 따라 Product 또는 ElectronicProduct 인스턴스 생성
		if (item.tags.includes('전자제품')) {
			products.push(new ElectronicProduct(item.name, item.description, item.price, ...item.tags, ...item.images, item.favoriteCount, item.manufacturer));
		} else {
			products.push(new Product(item.name, item.description, item.price, ...item.tags, ...item.images, item.favoriteCount));
		}
	});
	return products;
}

const testList = await setProductsList({ page: 10, pageSize: 15 });

console.log(testList);


/** 함수 실행 및 결과 확인 코드 */
/* Article 클래스 test */
/*
// instance 생성
const article = new Article('제목', '내용', '작성자');
const article2 = new Article('제목2', '내용2');

// 좋아요 수 증가
article.like();
article.like();

// console 확인
console.log(article);
console.log(article2);
*/

/* Product 클래스 test */
/*
// instance 생성
const product = new Product('상품명', '상품 설명', 10000, ['태그1', '태그2'], ['이미지1', '이미지2']);
const electronicProduct = new ElectronicProduct('전자제품명', '전자제품 설명', 20000, ['전자제품태그1', '전자제품태그2'], ['전자제품이미지1', '전자제품이미지2']);
const electronicProduct2 = new ElectronicProduct('가전제품', '제품 설명', 35000, [], ['이미지1', '이미지2']);

// 찜하기 수 증가
product.favorite();
electronicProduct2.favorite();

// console 확인
console.log(product);
console.log(electronicProduct);
console.log(electronicProduct2);
 */

/* Article Service test */
/*
// API 호출
const test =  getArticleList({page:1, pageSize:10}); 
const test = getArticle(10);
const test =  createArticle({ title: '250502-1513',content: '250502-1513', image: '' });
const test =  patchArticle({ title: '250502-1513',content: '250502-1513', image: '' });
const test =  deleteArticle('1080');

test.then((res) => console.log(res));
 */


/* Product Service test */
/* 
// API 호출
const test2 = await getProductList({page:1, pageSize:10});
const test2 = await getProduct(639);
const test2 = await createProduct({ name: 'test', price: 1000, description: '250507-1513'});
const test2 = await createProduct({ price: 0, description: "string", name: "상품 이름" });
const test2 = await patchProduct(717, { name: 'test', price: 1000, description: '250507-1513'});
const test2 = await deleteProduct(717);

console.log(test2); 
*/