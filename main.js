import { getArticle,getArticlelist,createArticle,patchArticle,deleteArticle } from "./ArticleService.js";
import { getProduct, getProductList,createProduct,patchProduct,deleteProduct } from "./ProductService.js";





class Product{
    constructor(name,description,price,tags,images,favoriteCount){
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
        this.favoriteCount = favoriteCount;

    }
    favorite(){
        this.favoriteCount += 1;
    }

}

class ElectronicProduct extends Product{
    constructor(name,description,price,tags,images,favoriteCount,manufacturer){
        super(name,description,price,tags,images,favoriteCount)
        this.manufacturer = manufacturer;
    }
}

class Article{
    constructor(title,content,writer,likeCount){
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount;
        this.createdAt = new Date();
    }
    like(){
        this.likeCount += 1;
    }
}

// getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어  products 배열에 저장해 주세요.
//해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.


let products = [];

const data = await getProductList();
data.list.forEach(item => {
    if(item.tags.includes('전자제품')){
        const electroproduct = new ElectronicProduct (item.name,item.description,item.price,item.tags,item.images,item.favoriteCount,item.manufacturer);
        products.push(electroproduct)

    }
    else {
        const product = new Product(item.name,item.description,item.price,item.tags,item.images,item.favoriteCount);
        products.push(product);
    }

});

