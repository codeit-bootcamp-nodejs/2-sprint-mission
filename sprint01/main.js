import { 
   getArticleList,
   getArticle,
   createArticle,
   patchArticle,
   deleteArticle
} from './ArticleService.js';

import { 
   getProductList,
   getProduct,
   createProduct,
   patchProduct,
   deleteProduct
} from './ProductService.js';




class Product {
 constructor (name, description, price = 0, tags = [], images = []) {
  this.name = name;
  this.description = description
  this.price = price
  this.tags= tags
  this.images = images
  this.favoriteCount = 0;
 }

 favorite() {
    this.favoriteCount += 1;
 }
}

 class ElectronicProduct extends Product {
  constructor (name, description, price = 0, tags = [], images = [], manufacturer) {
    super (name, description, price, tags, images)
    this.manufacturer = manufacturer;
  }
}
   


class Article {
    constructor (title, content, writer) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = 0;
        this.createdAt = new Date();
    }

 like() {
    this.likeCount += 1;
 }   
}


async function creatInstance() {
const response = await getProductList();
const lists = response.list;
const products = lists.map((all) => {
   const isElectronic = all.tags.includes('전자제품');
   const { name, description, price, tags, images, manufacturer } = all;
   
   return isElectronic
     ? new ElectronicProduct(name, description, price, tags, images, manufacturer)
     : new Product(name, description, price, tags, images);
 })
 console.log(products)
 }

creatInstance();

