import ProductSchemeRequirements from "../ProductSchemeRequirements.mjs"

export default class PatchProductRequest {
  #productId
  #name
  #description
  #price
  #tags
  #images

  // requirements : productId
  // options : name, description, price, tags, images
  constructor(schemes = {}) {
    const { productId, name, description, price, tags, images } = schemes

    this.#productId = ProductSchemeRequirements.checkIdRequirements(productId)

    this.#name = name !== undefined ? ProductSchemeRequirements.checkNameRequirements(name) : null
    this.#description = description !== undefined ? ProductSchemeRequirements.checkDescriptionRequirements(description) : null
    this.#price = price !== undefined ? ProductSchemeRequirements.checkPriceRequirements(price) : null
    this.#tags = tags !== undefined ? ProductSchemeRequirements.checkTagsRequirements(tags) : null
    this.#images = images !== undefined ? ProductSchemeRequirements.checkImagesRequirements(images) : null
  }

  get productId() {
    return this.#productId
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

  get images() {
    return this.#images
  }

  toParameter() {
    return `/${this.#productId}`
  }

  toQuery() {
    const query = {}

    if (this.#name !== null) {
      query.name = this.#name
    }

    if (this.#description != null) {
      query.description = this.#description
    }

    if (this.#price != null) {
      query.price = this.#price
    }

    if (this.#tags != null) {
      query.tags = this.#tags
    }

    if (this.#images != null) {
      query.images = this.#images
    }

    return query
  }

  static fromJSON(json) {
    return new PatchProductRequest(json)
  }

  toJSON() {
    return {
      productId: this.#productId,
      name: this.#name,
      description: this.#description,
      price: this.#price,
      tags: this.#tags,
      images: this.#images
    }
  }
}