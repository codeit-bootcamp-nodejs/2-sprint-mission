import axios from "axios";
import * as ProSev from './ProductService.js';
import * as ArtSev from './ArticleService.js';

// [ ]  .then() 메소드를 이용하여 비동기 처리를 해주세요.
// [ ]  .catch() 를 이용하여 오류 처리를 해주세요.

// ArtSev.getArticleList({page : 1, pageSize: 10, keyword: '차수연'})
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });

// ArtSev.getArticle(55)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });

// let data = {title: '차수연',
//   content: '내용입니다.',
//   image: 'https://via.placeholder.com/150',
// };
// ArtSev.createArticle(data)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });

// const data = {
//   title: '수정된 제목',
//   content: '수정된 내용',
//   image: 'https://via.placeholder.com/150',
// }
// ArtSev.patchArticle(55, data)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });

// ArtSev.deleteArticle(55)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });



// ProSev.getProductList({ page: 1, pageSize: 10})
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });

// ProSev.getProduct(1)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });


// const data ={
//   name: '전자레인지',
//   description: '전자레인지 입니다',
//   price: 10000,
//   tags: ['전자제품', '가전제품'],
//   images: ['https://via.placeholder.com/150'],
// }
// ProSev.createProduct(data)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);  
//   });

// ProSev.deleteProduct(1)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error('에러 발생!', error);
//   });

// [ ]  getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어  products 배열에 저장해 주세요.
// let products = [];
// products.push(await ProSev.getProductList({ page: 1, pageSize: 10}))
// products.forEach((products) => {console.log(products);});


// [ ] 해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
// const ElectronicProduct1 = new ProSev.ElectronicProduct(
//   '전자레인지',
//   '삼성 전자레인지입니다다',
//   10000,
//   ['전자제품', '가전제품'],
//   ['https://via.placeholder.com/150'],
//   0,
//   '삼성'
// )


// [ ] 나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.
// const Product1 = new ProSev.Product(
//   '지갑',
//   '악어가죽 지갑입니다.',
//   10000,
//   ['지갑', '가죽'],
//   ['https://via.placeholder.com/150'],
//   0,
// );
// console.log(Product1);

// [ ]  구현한 함수들을 아래와 같이 파일을 분리해 주세요.

// [ ] export를 활용해 주세요.
// [ ] ProductService.js 파일 Product API 관련 함수들을 작성해 주세요.
// [ ] ArticleService.js 파일에 Article API 관련 함수들을 작성해 주세요.
// [ ]  이외의 코드들은 모두 main.js 파일에 작성해 주세요.

// [ ] import를 활용해 주세요.
// [ ] 각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.

// 심화 요구사항
// [ ] Article 클래스에 createdAt(생성일자) 프로퍼티를 만들어 주세요.
// [ ] 새로운 객체가 생성되어 constructor가 호출될 시 createdAt에 현재 시간을 저장합니다.

// const article1 = new ArtSev.Article(
//   '차수연',
//   '콘텐츠.',
//   '차수연',
//   0,
// );
// console.log(article1);