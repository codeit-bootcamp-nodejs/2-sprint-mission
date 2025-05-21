import ArticleSchemeRequirements from "../ArticleSchemeRequirements.mjs"

export default class GetArticleListResponse {
  #totalCount
  #list

  constructor({ totalCount = 0, list = [] }) {
    this.#totalCount = ArticleSchemeRequirements.checkTotalCountRequirements(totalCount)
    this.#list = ArticleSchemeRequirements.checkListRequirements(list)
  }

  get totalCount() {
    return this.#totalCount
  }

  get list() {
    return this.#list
  }

  static fromJSON(json) {
    return new GetArticleListResponse(json)
  }

  toJSON() {
    return {
      totalCount: this.#totalCount,
      list: this.#list.map((article) => article.toJSON())
    }
  }
}