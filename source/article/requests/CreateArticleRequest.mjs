import ArticleSchemeRequirements from "../ArticleSchemeRequirements.mjs"

export default class CreateArticleRequest {
  #title
  #content
  #image

  // requirements : title, content
  // options : image
  constructor(schemes = {}) {
    const { title, content, image } = schemes
    this.#title = ArticleSchemeRequirements.checkTitleRequirements(title)
    this.#content = ArticleSchemeRequirements.checkContentRequirements(content)
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

  toQuery() {
    const query = {}

    query.title = this.#title
    query.content = this.#content

    if (this.#image !== null) {
      query.image = this.#image
    }

    return query
  }

  static fromJSON(json) {
    return new CreateArticleRequest(json)
  }

  toJSON() {
    return {
      title: this.#title,
      content: this.#content,
      image: this.#image
    }
  }

}