import ProductSchemeRequirements from "../ProductSchemeRequirements.mjs"

export default class GetProductListResponse {
  #totalCount
  #list

  constructor({ totalCount = 0, list = [] }) {
    this.#totalCount = ProductSchemeRequirements.checkTotalCountRequirements(totalCount)
    this.#list = ProductSchemeRequirements.checkListRequirements(list)
  }

  get totalCount() {
    return this.#totalCount
  }

  get list() {
    return this.#list
  }

  static fromJSON(json) {
    return new GetProductListResponse(json)
  }

  toJSON() {
    return {
      totalCount: this.#totalCount,
      list: this.#list.map((product) => product.toJSON())
    }
  }
}