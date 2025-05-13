import Article from "../Article.mjs";

export default class PatchArticleResponse {
  #article

  constructor(json) {
    this.#article = Article.fromJSON(json)
  }

  get article() {
    return this.#article
  }

  static fromJSON(json) {
    return new PatchArticleResponse(json)
  }

  toJSON() {
    return {
      article: this.#article.toJSON()
    }
  }
}