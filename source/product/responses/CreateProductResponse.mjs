import ProductCallbacks from "../ProductCallbacks.mjs"

export default class CreateProductResponse {
  #product

  constructor(json) {
    this.#product = ProductCallbacks.setProductByTag(json)
  }

  get product() {
    return this.#product
  }

  static fromJSON(json) {
    return new CreateProductResponse(json)
  }

  toJSON() {
    return {
      product: this.#product.toJSON()
    }
  }
}