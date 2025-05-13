import ProductSchemeRequirements from "../ProductSchemeRequirements.mjs"

export default class GetProductListRequest {
  #page
  #pageSize
  #keyword
  #orderBy

  constructor(scheme = {}) {
    const { page, pageSize, keyword, orderBy } = scheme

    this.#page = page !== undefined ? ProductSchemeRequirements.checkPageReuqirements(page) : null
    this.#pageSize = pageSize !== undefined ? ProductSchemeRequirements.checkPageSizeRequirements(pageSize) : null
    this.#keyword = keyword !== undefined ? ProductSchemeRequirements.checkKeywordRequirements(keyword) : null
    this.#orderBy = orderBy !== undefined ? ProductSchemeRequirements.checkOrderByRequirements(orderBy) : null
  }

  get page() {
    return this.#page
  }

  get pageSize() {
    return this.#pageSize
  }

  get keyword() {
    return this.#keyword
  }

  toQuery() {
    const query = {}

    if (this.#page !== null) {
      query.page = this.#page
    }

    if (this.#pageSize !== null) {
      query.pageSize = this.#pageSize
    }

    if (this.#keyword !== null) {
      query.keyword = this.#keyword
    }

    if (this.#orderBy !== null) {
      query.orderBy = this.#orderBy
    }

    return query
  }

  static fromJSON(json) {
    return new GetProductListRequest(json)
  }

  toJSON() {
    return {
      page: this.#page,
      pageSize: this.#pageSize,
      keyword: this.#keyword,
      orderBy: this.#orderBy
    }
  }

}