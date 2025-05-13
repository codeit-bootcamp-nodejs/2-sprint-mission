import ArticleSchemeRequirements from "../ArticleSchemeRequirements.mjs"

export default class DeleteArticleRequest {
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
    return DeleteArticleRequest(json)
  }

  toJSON() {
    return {
      articleId: this.#articleId
    }
  }

}