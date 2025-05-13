import ProductSchemeRequirements from "../ProductSchemeRequirements.mjs";

export default class GetProductRequest {
  #productId

  constructor({ productId = 0 }) {
    this.#productId = ProductSchemeRequirements.checkIdRequirements(productId)
  }

  toParameter() {
    return `/${this.#productId}`
  }

  static fromJSON(json) {
    return GetArticleRequest(json)
  }

  toJSON() {
    return {
      productId: this.#productId
    }
  }
}