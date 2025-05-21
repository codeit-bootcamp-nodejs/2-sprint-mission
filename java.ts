class product {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;

  constructor(name, description, price, tags, images, favoriteCount) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }

  favorite(): void {
    this.favoriteCount++;
  }
}
class ElectronicProduct extends product {
  manufacturer: string;

  constructor(
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[],
    favoriteCount: number,
    manufacturer: string // ElectronicProduct 고유의 프로퍼티
  ) {
    // super()를 호출하여 부모 클래스의 생성자를 실행합니다.
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer; // ElectronicProduct의 manufacturer 프로퍼티 초기화
  }

  displayManufacturer(): void {
    console.log(`제조사: ${this.manufacturer}`);}
  }