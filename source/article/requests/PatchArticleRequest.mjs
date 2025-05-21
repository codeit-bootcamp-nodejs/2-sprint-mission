import ArticleSchemeRequirements from "../ArticleSchemeRequirements.mjs";

export default class PatchArticleRequest {
  #articleId
  #title
  #content
  #image

  // requirements : articleId
  // options : title, content, image
  constructor(schemes = {}) {
    const { articleId, title, content, image } = schemes

    this.#articleId = ArticleSchemeRequirements.checkIdRequirements(articleId)

    this.#title = title !== undefined ? ArticleSchemeRequirements.checkTitleRequirements(title) : null
    this.#content = content !== undefined ? ArticleSchemeRequirements.checkContentRequirements(content) : null
    this.#image = image !== undefined ? ArticleSchemeRequirements.checkImageRequirements(image) : null
  }

  get title() {
    return this.#title
  }

  get content() {
    return this.#content
  }

  get image() {
    return this.#image
  }

  toParameter() {
    return `/${this.#articleId}`
  }

  toQuery() {
    const query = {}

    if (this.#title !== null) {
      query.title = this.#title
    }

    if (this.#content !== null) {
      query.content = this.#content
    }

    if (this.#image !== null) {
      query.image = this.#image
    }

    return query
  }

  static fromJSON(json) {
    return new PatchArticleRequest(json)
  }

  toJSON() {
    return {
      articleId: this.#articleId,
      title: this.#title,
      content: this.#content,
      image: this.#image
    }
  }
}