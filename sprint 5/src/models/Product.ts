export class Product {
  /** 상품명  */
  private _name: string;

  /** 상품 설명 */
  private _description: string;

  /** 판매 가격 */
  private _price: number;

  /** 해시 태그 목록 */
  private _tags: string[];

  /** 이미지 목록 */
  private _images: string[];

  /** 찜하기 수 */
  private _favoriteCount: number;

  constructor(
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[],
    favoriteCount: number
  ) {
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = Array.from(tags); // 깊은 복사
    this._images = Array.from(images);
    this._favoriteCount = favoriteCount;
  }

  getName(): string {
    return this._name;
  }

  getDescription(): string {
    return this._description;
  }

  getPrice(): number {
    return this._price;
  }

  getTags(): string[] {
    return Array.from(this._tags); // 깊은 복사
  }

  getImages(): string[] {
    return Array.from(this._images);
  }

  getFavoriteCount(): number {
    return this._favoriteCount;
  }

  favorite(): void {
    this._favoriteCount++;
  }
}
