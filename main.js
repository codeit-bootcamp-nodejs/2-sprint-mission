import { getProduct, getProductList, createProduct, patchProduct, deleteProduct } from './ProductService.js';
import { getArticle, getArticleList, createArticle, patchArticle, deleteArticle } from './ArticleService.js';

// ❗클래스
// ✅ Products
class Product {
    constructor(name, description, price, tag, images, favoriteCount = 0) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tag = tag;
        this.images = images;
        this.favoriteCount = favoriteCount;
    }

    favorite() {
        this.favoriteCount += 1;
    }
}

const p1 = new Product('망고', '달콤한 망고', 10000, ['여름'], ['mango.jpg']);
// console.log('1회 클릭 전:', p1.favoriteCount); // 0
// p1.favorite();

// Electronic
class ElectronicProduct extends Product {
    constructor(name, description, price, tags, images, favoriteCount, manufacturer = 'Unknown') {
        super(name, description, price, tags, images, favoriteCount);
        this.manufacturer = manufacturer;
    }
}

const p2 = new Product('컴퓨터', '고사양', 1000000, ['computer.jpg'], ['전자제품'], 7, '삼성');
// p2.favorite();
// console.log(p2.favoriteCount);

//✅ Article
class Article {
    constructor(title, content, writer, likeCount = 0) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount;
        this.createdAt = new Date();
    }

    like() {
        this.likeCount += 1;
    }
}

const a1 = new Article('날씨', '맑음', 'JIN');
// console.log(a1)
// a1.like()
// console.log(a1.likeCount)
// a1.like()
// console.log(a1.likeCount)


// ❤️ Article 실행 함수
// getArticleList(1, 5, '날씨');
// getArticle(759);

const newArticle = {
    title: '2025.05.02',
    content: '날씨 맑음 : 오후',
    image: 'https://i.namu.wiki/i/QjnMdzJauau5gigMeDYQ5JtCqFADzHTlygU5dl426dAMrJiLhBD0SARL90ks6YAQdqVqZJXi9Z3LoPjk022ALA.webp',
};

// createArticle(newArticle);

const fixedArticle = {
    title: '2025.05.02',
    content: '오늘 날씨 어떰? 맑고 바람 많이 붐',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToEjBxNj9w55XXA-rB0zCaNgnFqVJLLdRcDw&s',
};
// patchArticle(828, fixedArticle);
// deleteArticle(759);

// ❤️ Product 실행 함수
// getProductList(1, 5, '상품');
// getProduct(589);

const product = {
    name: '노트북2',
    description: '초초고사양',
    price: 100, // 숫자가 너무 커서 500에러 발생했던 것 -> 백엔드에서 가격에 대한 에러처리 안한 것 같음.
    tags: ['전자제품', '컴퓨터'],
    images: ['https://via.placeholder.com/150'], // 이미지 주소 배열로 입력받음
};

// createProduct(product);

const fixedProduct = {
    name: '🖥️노트북',
    description: '고사양',
    price: 100,
    tags: ['전자제품', '컴퓨터'],
    images: ['https://via.placeholder.com/150'],
};
// patchProduct(591, fixedProduct);
// deleteProduct(581);


//❗ 상품 리스트 받아와서 인스턴스화
// 1. getProductList() 를 통해 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장한다.
// 2. 태그에 "전자제품"이 포함되어 있는 상품은 ElectronicProduct 클래스를 사용해 인스턴스를 만든다.
// 3. 그 외 상품은 모두 Product 클래스를 사용한다.
let products = [];

// 상품 받아오고 분류하는 함수 만들기
async function getAndStoreProducts(page, pageSize, keyword) {
    const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}`;

    try {
        const res = await fetch(url);
        const result = await res.json();
        // console.log(`응답 결과:`, result);

        const productList = result.list;
        // console.log(`productList:`, productList);

        // 받은 상품들을 하나씩 순회하면서 처리
        productList.forEach((item) => {
            const { name, description, price, tags, images, favoriteCount } = item;

            // 전자제품이 태그가 포함된 경우 -> ElectronicProduct 사용
            if (tags.includes('전자제품')) {
                electronicItem = new ElectronicProduct(name, description, price, tags, images, favoriteCount, 'unkown');
                products.push(electronicItem);
            } else {
                const normalItem = new Product(name, description, price, tags, images, favoriteCount);
                products.push(normalItem);
            }
        });
        console.log('생성된 products 배열:', products);
    } catch (err) {
        console.log(`getAndStoreProducts 에러: `, err.message);
    }
}

// getAndStoreProducts(1, 5, '');


