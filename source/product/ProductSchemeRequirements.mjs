import SprintUtility from "../utility/SprintUtility.mjs"
import ProductCallbacks from "./ProductCallbacks.mjs"
import ProductEnums from "./ProductEnums.mjs"

export default class ProductSchemeRequirements {
  static #product = 'Product'

  static checkIdRequirements(id = 0) {
    const scheme = { id: id }

    const key = this.#getKey(scheme, id)
    const number = this.#checkType(key, id, 'number')

    if (Number.isInteger(number) === false) {
      const checkIntegerErrorMessage = `[ERROR][SCHEME] ${this.#product} 의 ${key} 는 반드시 정수형이어야 합니다.`
      throw new Error(checkIntegerErrorMessage)
    }

    // check requirements
    // min=1
    this.#checkNumberRange(key, number, { min: 1 })

    return number
  }

  static checkNameRequirements(name = '') {
    const scheme = { name: name }

    const key = this.#getKey(scheme, name)
    const string = this.#checkType(key, name, 'string')

    // check requirements
    // min=1, max=30
    const MIN = 1
    const MAX = 30
    this.#checkStringRange(key, string, { min: MIN, max: MAX })

    return string
  }

  static checkDescriptionRequirements(description = '') {
    const scheme = { description: description }

    const key = this.#getKey(scheme, description)
    const string = this.#checkType(key, description, 'string')

    // check requirements
    // none

    return string
  }

  static checkPriceRequirements(price = 0) {
    const scheme = { price: price }

    const key = this.#getKey(scheme, price)
    const number = this.#checkType(key, price, 'number')

    if (Number.isInteger(number) === false) {
      const checkIntegerErrorMessage = `[ERROR][SCHEME] ${this.#product} 의 ${key} 는 반드시 정수형이어야 합니다.`
      throw new Error(checkIntegerErrorMessage)
    }

    // check requirements
    // min=0
    this.#checkNumberRange(key, number, { min: 0 })

    return number
  }

  static checkTagsRequirements(tags = []) {
    const scheme = { tags: tags }

    const key = this.#getKey(scheme, tags)
    const array = this.#checkType(key, tags, 'array')

    // check requirements
    // min=1
    const MIN = 1
    this.#checkNumberRange(key, array.length, { min: MIN })

    array.forEach((tag) => { this.checkTagRequirements(tag) })

    return array
  }

  static checkImagesRequirements(images = []) {
    const scheme = { images: images }

    const key = this.#getKey(scheme, images)
    const array = this.#checkType(key, images, 'array')

    // check requirements
    // min=1
    const MIN = 1
    this.#checkNumberRange(key, array.length, { min: MIN })

    array.forEach((image) => { this.checkTagRequirements(image) })

    return array
  }

  static checkFavoriteCountRequirements(favoriteCount = 0) {
    const scheme = { favoriteCount: favoriteCount }

    const key = this.#getKey(scheme, favoriteCount)
    const number = this.#checkType(key, favoriteCount, 'number')

    // check requirements
    // min=0
    const MIN = 0
    this.#checkNumberRange(key, number, { min: MIN })

    return number
  }

  static checkCreatedAtRequirements(createdAt = '') {
    const scheme = { createdAt: createdAt }

    const key = this.#getKey(scheme, createdAt)
    const string = this.#checkType(key, createdAt, 'string')

    // check requirements
    this.#checkDate(key, string, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)

    return string
  }

  static checkTagRequirements(tag = '') {
    const scheme = { tag: tag }

    const key = this.#getKey(scheme, tag)
    const string = this.#checkType(key, tag, 'string')

    // check requirements
    // min=1, max=20
    const MIN = 1
    const MAX = 20
    this.#checkStringRange(key, string, { min: MIN, max: MAX })

    return string
  }

  static checkImageRequirements(image = '') {
    const scheme = { image: image }

    const key = this.#getKey(scheme, image)
    const string = this.#checkType(key, image, 'string')

    // check requirements
    this.#checkUrl(key, string, /^https?:\/\/.+/)

    return string
  }

  static checkPageReuqirements(page) {
    const scheme = { page: page }

    const key = this.#getKey(scheme, page)
    const number = this.#checkType(key, page, 'number')

    // check requirements
    // min=1
    const MIN = 1
    this.#checkNumberRange(key, number, { min: MIN })

    return number
  }

  static checkPageSizeRequirements(pageSize) {
    const scheme = { pageSize: pageSize }

    const key = this.#getKey(scheme, pageSize)
    const number = this.#checkType(key, pageSize, 'number')

    // check requirements
    // min=1
    const MIN = 1
    this.#checkNumberRange(key, number, { min: MIN })

    return number
  }

  static checkKeywordRequirements(keyword) {
    const scheme = { keyword: keyword }

    const key = this.#getKey(scheme, keyword)
    const string = this.#checkType(key, keyword, 'string')

    // check requirements
    // none
    this.#checkStringRange(key, string, {})

    return string
  }

  static checkOrderByRequirements(orderBy) {
    const scheme = { orderBy: orderBy }

    const key = this.#getKey(scheme, orderBy)
    const string = this.#checkType(key, orderBy, 'string')

    // check requirements
    // none
    this.#checkEnums(key, ProductEnums.ORDER_BY, orderBy)

    return string
  }

  static checkTotalCountRequirements(totalCount) {
    const scheme = { totalCount: totalCount }

    const key = this.#getKey(scheme, totalCount)
    const number = this.#checkType(key, totalCount, 'number')

    this.#checkNumberRange(key, number, {})

    return number
  }

  static checkListRequirements(list) {
    const scheme = { list: list }

    const key = this.#getKey(scheme, list)
    const array = this.#checkType(key, list, 'array')

    const productList = []

    for (const json of array) {
      productList.push(ProductCallbacks.setProductByTag(json))
    }

    return productList
  }

  static checkManufacturerRequirements(manufacturer) {
    const scheme = { manufacturer: manufacturer }

    const key = this.#getKey(scheme, manufacturer)
    const string = this.#checkType(key, manufacturer, 'string')

    // check requirements
    // none

    return string
  }

  static #getKey(scheme, value) {
    return Object.keys(scheme).find((k) => scheme[k] === value)
  }

  static #checkType(key = '', value = 0, type = '' | []) {
    const checkTypErrorMessage = `[ERROR][SCHEME] ${this.#product} 의 ${key} 가 ${typeof value} 입니다. ${key} 는 ${type} 이어야 합니다.`
    return SprintUtility.from(value, type, checkTypErrorMessage)
  }

  static #checkEnums(key, enums, value) {
    const items = Object.values(enums)
    const isValidItem = items.includes(value)

    if (isValidItem === false) {
      const checkEnumsErrorMessage = `[ERROR][SCHEME] ${this.#product} 의 ${key} 가 ${typeof value} 입니다. ${key} 는 ${enums} 중에 하나여야 합니다.`
      throw new Error(checkEnumsErrorMessage)
    }

    return value
  }

  static #checkNumberRange(key = '', number = 0, range = { min, max }) {
    const { min, max } = range

    const conditionMin = min !== undefined ? number < min : false
    const conditionMax = max !== undefined ? number > max : false

    if (conditionMin) {
      const checkRequirementsErrorMessage = `[ERROR][SCHEME] ${this.#product} 의 ${key} 가 ${number} 입니다. ${key} 는 ${min} 이상이어야 합니다.`
      throw new Error(checkRequirementsErrorMessage)
    }

    if (conditionMax) {
      const checkRequirementsErrorMessage = `[ERROR][SCHEME] ${this.#product} 의 ${key} 가 ${number} 입니다. ${key} 는 ${max} 이하이어야 합니다.`
      throw new Error(checkRequirementsErrorMessage)
    }

    return number
  }

  static #checkStringRange(key = '', string = '', range = { min, max }) {
    const { min, max } = range
    const length = string.length

    this.#checkNumberRange(`${key} 의 내용`, length, { min: min, max: max })

    return string
  }

  static #checkUrl(key = '', url = '', pattern) {
    if (pattern.test(url) === false) {
      throw new Error(`[ERROR][SCHEME] ${this.#product} 의 ${key} 가 ${url} 입니다. ${key} 는 http:// 또는 https:// 로 시작해야 하고, 반드시 한 글자 이상의 주소가 있어야 합니다.`)
    }

    return url
  }

  static #checkDate(key = '', date = '', pattern) {
    // /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    if (pattern.test(date) === false) {
      throw new Error(`[ERROR][SCHEME] ${this.#product} 의 ${key} 가 ${date} 입니다. ${key} 는 '년년년년-월월-일일T시시:분분:초초.협정시Z' 의 형태여야 합니다.`)
    }

    return date
  }
}