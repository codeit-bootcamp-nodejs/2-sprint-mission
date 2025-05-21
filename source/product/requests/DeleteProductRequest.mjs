import ProductSchemeRequirements from "../ProductSchemeRequirements.mjs"

export default class DeleteProductRequest {
  #productId

  constructor({ productId = 0 }) {
    this.#productId = ProductSchemeRequirements.checkIdRequirements(productId)
  }

  get productId() {
    return this.#productId
  }

  toParameter() {
    return `/${this.#productId}`
  }

  static fromJSON(json) {
    return new DeleteArticleResponse(json)
  }

  toJSON() {
    return {
      productId: this.#productId
    }
  }
}