import Article from "../Article.mjs";

export default class CreateArticleResponse {
  #article

  constructor(json) {
    this.#article = Article.fromJSON(json)
  }

  get article() {
    return this.#article
  }

  static fromJSON(json) {
    return new CreateArticleResponse(json)
  }

  toJSON() {
    return this.#article.toJSON()
  }
}