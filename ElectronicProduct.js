import { Product } from './Product.js'; //####product.js에서 Product 클래스 가져오기
//####ElectronicProduct 클래스는 product 클래스를 상속받는다.
export class ElectronicProduct extends Product {
  constructor(name, desciption, price, tags, images, manufacturer) {
      super(name, desciption, price, tags, images);
      this.manufacturer = manufacturer; //####추가 프로퍼티(제조사)
  }
}

const laptop = new ElectronicProduct( //####ElectronicProduct 인스턴스 생성
  "그램 노트북",
  "초경량 14인치 노트북",
  1790000,
  ["노트북", "전자제품", "휴대용"],
  ["gram1.jpg", "gram2.jpg"],
  "LG전자"
);

//####찜하기 기능 사용
laptop.favorite();
laptop.favorite();

console.log("상품명:", laptop.name);
console.log("설명:", laptop.description);
console.log("가격:", laptop.price + "원");
console.log("해시태그:", laptop.tags.join(", "));
console.log("이미지 목록:", laptop.images);
console.log("제조사:", laptop.manufacturer);
console.log("찜 수:", laptop.favoriteCount);