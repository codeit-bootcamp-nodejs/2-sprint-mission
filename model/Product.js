export class Product {
	// 상품 클래스
	constructor(name = '', description = '', price = 0, tags = [], images = [], favoriteCount = 0) {
		this.name = name; // 상품명
		this.description = description; // 상품 설명
		this.price = price; // 판매 가격
		this.tags = !Array.isArray(tags) && tags.length > 1 ? [tags] : tags; // 해시태그 배열
		this.images = !Array.isArray(images) && images.length > 1 ? [images] : images; // 이미지 배열
		this.favoriteCount = favoriteCount; //찜하기 수
	}

	favorite() {
		this.favoriteCount++;
	}
}

export class ElectronicProduct extends Product {
	constructor(name = '', description = '', price = 0, tags = [], images = [], favoriteCount = 0, manufacturer = '') {
		super(name, description, price, tags, images, favoriteCount);
		this.manufacturer = manufacturer; // 제조사
	}
}

