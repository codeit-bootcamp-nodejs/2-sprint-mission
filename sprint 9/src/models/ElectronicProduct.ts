import { Product } from './Product';

export class ElectronicProduct extends Product {
  /** 제조사 */
  private _manufacturer: string;

  constructor(
    name: string,
    description: string,
    price: number,
    tags: string[],
    images: string[],
    favoriteCount: number,
    manufacturer: string
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;
  }

  getManufacturer(): string {
    return this._manufacturer;
  }
}

