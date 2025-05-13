import Product from "./Product.mjs";
import ProductSchemeRequirements from "./ProductSchemeRequirements.mjs";

export default class ElectronicProduct extends Product {
  #manufacturer

  constructor({ id = 0, name = '', description = '', price = 0, tags = [], images = [], favoriteCount = 0, createdAt = '', manufacturer = '' }) {
    super({ id, name, description, price, tags, images, createdAt, favoriteCount, createdAt })
    this.#manufacturer = ProductSchemeRequirements.checkManufacturerRequirements(manufacturer)
  }

  get manufacturer() {
    return this.#manufacturer
  }

  static fromJSON(json) {
    return new ElectronicProduct(json)
  }

  toJSON() {
    return {
      ...super.toJSON(),
      manufacturer: this.#manufacturer
    }
  }
}