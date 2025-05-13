import ProductSchemeRequirements from "../ProductSchemeRequirements.mjs"

export default class DeleteProductResponse {
  #id

  constructor({ id }) {
    this.#id = ProductSchemeRequirements.checkIdRequirements(id)
  }

  get id() {
    return this.#id
  }

  static fromJSON(json) {
    return new DeleteProductResponse(json)
  }

  toJSON() {
    return {
      id: this.#id
    }
  }
}