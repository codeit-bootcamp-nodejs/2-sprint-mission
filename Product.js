//####상품 클래스 정의
export class Product {

    //####private 변수: 찜한 수 (캡슐화)
    #favoriteCount = 0;

    //####생성자: 상품의 기본 정보 초기화
    constructor(name, description, price, tags, images) {
        this.name = name;
        this.description = description; // _상품 설명_
        this.price = price;
        this.tags = tags;
        this.images = images;
    }

    //####찜하기: 찜 수 증가
    favorite() {
        this.#favoriteCount += 1;
    }

    //####찜한 수 조회 (getter)
    get favoriteCount() {
        return this.#favoriteCount;
    }
}

//####상품 인스턴스 생성 및 테스트
const product1 = new Product(
    "무선 이어폰",
    "노이즈 캔슬링 기능이 있는 고급 무선 이어폰",
    129000,
    ["전자제품", "이어폰", "무선"],
    ["earphone1.jpg", "earphone2.jpg"]
);

//####찜하기 기능 사용
product1.favorite();
product1.favorite();
product1.favorite();

//####출력
console.log("상품명:", product1.name);
console.log("설명:", product1.description);
console.log("가격:", product1.price + "원");
console.log("해시태그:", product1.tags.join(", "));
console.log("이미지 목록:", product1.images);
console.log("찜하기 수:", product1.favoriteCount);