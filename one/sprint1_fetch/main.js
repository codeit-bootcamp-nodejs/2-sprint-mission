import * as article from './ArticleService.js';
import * as product from './ProductService.js';
import fs from 'fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
export const apiKey = fs.readFileSync(require.resolve('../ArticleProductAPI'), 'utf8');
class Product{
    constructor(name, description, price, tags, images, favoriteCount){
        this.name=name;
        this.description=description;
        this.price=price;
        this.tags=tags;
        this.images=images;
        this.favoriteCount=favoriteCount;
    }
    
    favorite(){
        this.favoriteCount++;
    }
}

class ElectronicProduct extends Product{
    constructor(name, description, price, tags, images, favoriteCount, manufacturer){
        super(name, description, price, tags, images, favoriteCount);
        this.manufacturer=manufacturer;
    }
}

class Article{
    constructor(title, content, writer, likeCount){
        this.title=title;
        this.content=content;
        this.writer=writer;
        this.likeCount=likeCount;
        this.createdAt=new Date();
    }
    like(){
        this.likeCount++;
    }
}

// 아래에 있는 코드들은 실행 순서를 보장하지 않는다.
// article.getArticleList({page:1, pageSize:10, orderBy:'recent',keyword:'테스트'});
// article.getArticle(10);
// const articleId = await article.createArticle({
//     "image": "https://example123.com/...",
//     "content": "나의 게시글 내용입니다.",
//     "title": "나의 게시글 제목입니다."
//   });
// article.patchArticle(articleId, {"title": "나의 게시글 제목입니까??"});
// article.deleteArticle(articleId);

product.getProductList({page:1, pageSize:10, orderBy:'recent',keyword:'이름'});
// product.getProduct(10);
// const productId = product.createProduct({
//     "images": [
//       "https://example.com/...",
//       "https://hello world!!!"
//     ],
//     "tags": [
//       "전자제품", "nice to meet you!"
//     ],
//     "price": 73737,
//     "description": "string",
//     "name": "이것이 상품 이름인가 ?!?!"
//   });
// product.patchProduct(productId, {"name": "나의 게시글의 상품 제목입니까??"});
// product.deleteProduct(productId);

export {ElectronicProduct, Product};