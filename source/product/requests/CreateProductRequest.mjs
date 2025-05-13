import ProductSchemeRequirements from "../ProductSchemeRequirements.mjs"

export default class CreateProductRequest {
  #name
  #description
  #price
  #tags
  #images

  // requirements : name, description, price,
  // options : tags, iamges
  constructor(schemes = {}) {
    const { name, description, price, tags, images } = schemes

    this.#name = ProductSchemeRequirements.checkNameRequirements(name)
    this.#description = ProductSchemeRequirements.checkDescriptionRequirements(description)
    this.#price = ProductSchemeRequirements.checkPriceRequirements(price)
    this.#tags = ProductSchemeRequirements.checkTagsRequirements(tags)
    this.#images = ProductSchemeRequirements.checkImagesRequirements(images)
  }

  get name() {
    return this.#name
  }

  get description() {
    return this.#description
  }

  get price() {
    return this.#price
  }

  get tags() {
    return this.#tags
  }

  get iamges() {
    return this.#images
  }

  toQuery() {
    const query = {}

    query.name = this.#name
    query.description = this.#description
    query.price = this.#price
    query.tags = this.#tags
    query.images = this.#images

    return query
  }

  static fromJSON(json) {
    return new CreateProductRequest(json)
  }

  toJSON() {
    return {
      name: this.#name,
      description: this.#description,
      price: this.#price,
      tags: this.#tags,
      images: this.#images
    }
  }

}