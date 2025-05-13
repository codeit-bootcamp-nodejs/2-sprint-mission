import ProductCallbacks from "../ProductCallbacks.mjs"

export default class PatchProductResponse {
  #product

  constructor(json) {
    this.#product = ProductCallbacks.setProductByTag(json)
  }

  get product() {
    return this.#product
  }

  static fromJSON(json) {
    return new PatchProductResponse(json)
  }

  toJSON() {
    return {
      product: this.#product.toJSON()
    }
  }
}