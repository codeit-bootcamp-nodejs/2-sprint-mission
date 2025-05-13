import ProductSchemeRequirements from "./ProductSchemeRequirements.mjs"

export default class Product {
  #id
  #name
  #description
  #price
  #tags
  #images
  #favoriteCount
  #createdAt

  constructor({ id = 0, name = '', description = '', price = 0, tags = [], images = [], favoriteCount = 0, createdAt = '' }) {
    this.#id = ProductSchemeRequirements.checkIdRequirements(id)
    this.#name = ProductSchemeRequirements.checkNameRequirements(name)
    this.#description = ProductSchemeRequirements.checkDescriptionRequirements(description)
    this.#price = ProductSchemeRequirements.checkPriceRequirements(price)
    this.#tags = ProductSchemeRequirements.checkTagsRequirements(tags)
    this.#images = ProductSchemeRequirements.checkImagesRequirements(images)
    this.#favoriteCount = ProductSchemeRequirements.checkFavoriteCountRequirements(favoriteCount)
    this.#createdAt = ProductSchemeRequirements.checkCreatedAtRequirements(createdAt)
  }

  get id() {
    return this.#id
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

  get favoriteCount() {
    return this.#favoriteCount
  }

  get createdAt() {
    return this.#createdAt
  }

  static fromJSON(json) {
    return new Product(json)
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      price: this.#price,
      tags: this.#tags,
      images: this.#images,
      favoriteCount: this.#favoriteCount,
      createdAt: this.#createdAt
    }
  }

  favorite() {
    this.#favoriteCount += 1
  }
}