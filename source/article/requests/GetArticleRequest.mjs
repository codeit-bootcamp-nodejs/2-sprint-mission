import ArticleSchemeRequirements from "../ArticleSchemeRequirements.mjs"

export default class GetArticleRequest {
  #articleId

  constructor({ articleId = 0 }) {
    this.#articleId = ArticleSchemeRequirements.checkIdRequirements(articleId)
  }

  get articleId() {
    return this.#articleId
  }

  toParameter() {
    return `/${this.#articleId}`
  }

  static fromJSON(json) {
    return GetArticleRequest(json)
  }

  toJSON() {
    return {
      articleId: this.#articleId
    }
  }
}