import ArticleSchemeRequirements from "../ArticleSchemeRequirements.mjs"

export default class DeleteArticleResponse {
  #id

  constructor({ id }) {
    this.#id = ArticleSchemeRequirements.checkIdRequirements(id)
  }

  get id() {
    return this.#id
  }

  static fromJSON(json) {
    return new DeleteArticleResponse(json)
  }

  toJSON() {
    return {
      id: this.#id
    }
  }

}