## **Product** 클래스와 **Article** 클래스의 생성 
 
```js
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
```
<br>

##  **Product** 클래스의 자식 클래스의 생성

```js
class ElectronicProduct extends Product {
  constructor (name, description, price = 0, tags = [], images = [], manufacturer) {
    super (name, description, price, tags, images)
    this.manufacturer = manufacturer;
  }
}
```
<br>

## API 와 HTTP 메서드를 사용해서 주어진 함수들을 구현 

```js
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
   const url = `https://panda-market-api-crud.vercel.app/articles`
   const query = `?page=${page}&pageSize=${pageSize}&keyword=${encodeURIComponent(keyword)}` 

  axios.get( url + query)
   .then((res) => {console.log('불러오기 성공', res.data)
    return res.data
   })
   .catch((err) => {console.error('불러오기 실패',err.message)})
}
```
* 응답 상태의 코드가 `2XX`가 아닐경우, 에러 메세지를 콘솔에 출력해 달라는 요구사항이 있어서, <br> 응답 코드가 200번대를 넘어가면  `catch()` 로 에러를 보내는 **axios**를 사용했습니다.

<br>


 ## 함수 를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어  `products` 배열에 저장

 ```js
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
 ```
* `isElectronic` 에 **전자제품** 태그가 들어간 상품을 추려내고 분해할당 하여 파라미터로 쓸 준비를 한 후,
* 전자제품인 것은 **ElectronicProduct** 아닌 것은 **Product**로  인스턴스를 생성 하여 최종적으로 `products` 에 저장 하였습니다.

 <br>
 <br>
 <br>
 

> ### 구현한 코드들을 `ProductService.js` , `ArticleService.js`  `main.js`에 모듈화 
 
 
<br>
<br>
<br>


## 📍 심화 요구사항

### **Article** 클래스에 `createdAt(생성일자)` 프로퍼티를 생성

```js
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
```

* **Article** 클래스에 `new Date()` 객체를 사용하는 `createdAt` 프로퍼티를 추가 하였습니다. 
* `createdAt` 는 값을 넘겨줄 필요가 없는 자동으로 설정되는 
속성이기 때문에 `constructor` 매개변수에는 추가하지 않았습니다.
 