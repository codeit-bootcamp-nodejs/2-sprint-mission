import SprintUtility from "../utility/SprintUtility.mjs"
import ArticleEnums from "./ArticleEnums.mjs"
import Article from "./Article.mjs"

export default class ArticleSchemeRequirements {
  static #article = 'Article'

  static checkIdRequirements(id = 0) {
    const scheme = { id: id }

    const key = this.#getKey(scheme, id)
    const number = this.#checkType(key, id, 'number')

    if (Number.isInteger(number) === false) {
      const checkIntegerErrorMessage = `[ERROR][SCHEME] ${this.#article} 의 ${key} 는 반드시 정수형이어야 합니다.`
      throw new Error(checkIntegerErrorMessage)
    }

    // check requirements
    // min=1
    this.#checkNumberRange(key, number, { min: 1 })

    return number
  }

  static checkTitleRequirements(title = '') {
    const scheme = { title: title }

    const key = this.#getKey(scheme, title)
    const string = this.#checkType(key, title, 'string')

    // check requirements
    // min=1, max=50
    const MIN = 1
    const MAX = 50
    this.#checkStringRange(key, string, { min: MIN, max: MAX })

    return string
  }

  static checkContentRequirements(content = '') {
    const scheme = { content: content }

    const key = this.#getKey(scheme, content)
    const string = this.#checkType(key, content, 'string')

    // check requirements
    // min=1
    const MIN = 1
    this.#checkStringRange(key, string, { min: MIN })

    return string
  }

  static checkWriterRequirements(writer = '') {
    const scheme = { writer: writer }

    const key = this.#getKey(scheme, writer)
    const string = this.#checkType(key, writer, 'string')

    // check requirements
    // none
    this.#checkStringRange(key, string, {})

    return string
  }

  static checkLikeCountRequirements(likeCount) {
    const scheme = { likeCount: likeCount }

    const key = this.#getKey(scheme, likeCount = 0)
    const number = this.#checkType(key, likeCount, 'number')

    // check requirements
    // min=0
    this.#checkNumberRange(key, number, { min: 0 })

    return number
  }

  static checkImageRequirements(image = '') {
    const scheme = { image: image }

    const key = this.#getKey(scheme, image)
    const string = this.#checkType(key, image, ['string', 'null'])

    if (string == null) {
      return string
    }

    // check requirements
    this.#checkUrl(key, string, /^https?:\/\/.+/)

    return string
  }

  static checkCreatedAtRequirements(createdAt) {
    const scheme = { createdAt: createdAt }

    const key = this.#getKey(scheme, createdAt)
    const string = this.#checkType(key, createdAt, 'string')

    // check requirements
    this.#checkDate(key, string, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)

    return string
  }

  static checkUpdatedAtRequirements(updatedAt) {
    const scheme = { updatedAt: updatedAt }

    const key = this.#getKey(scheme, updatedAt)
    const string = this.#checkType(key, updatedAt, 'string')

    // check requirements
    this.#checkDate(key, string, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)

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
    this.#checkEnums(key, ArticleEnums.ORDER_BY, orderBy)

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

    const articleList = []

    for (const json of array) {
      articleList.push(Article.fromJSON(json))
    }

    return articleList
  }

  static #getKey(scheme, value) {
    return Object.keys(scheme).find((k) => scheme[k] === value)
  }

  static #checkType(key = '', value = 0, type = '' | []) {
    const checkTypErrorMessage = `[ERROR][SCHEME] ${this.#article} 의 ${key} 가 ${typeof value} 입니다. ${key} 는 ${type} 이어야 합니다.`
    return SprintUtility.from(value, type, checkTypErrorMessage)
  }

  static #checkEnums(key, enums, value) {
    const items = Object.values(enums)
    const isValidItem = items.includes(value)

    if (isValidItem === false) {
      const checkEnumsErrorMessage = `[ERROR][SCHEME] ${this.#article} 의 ${key} 가 ${typeof value} 입니다. ${key} 는 ${enums} 중에 하나여야 합니다.`
      throw new Error(checkEnumsErrorMessage)
    }

    return value
  }

  static #checkNumberRange(key = '', number = 0, range = { min, max }) {
    const { min, max } = range

    const conditionMin = min !== undefined ? number < min : false
    const conditionMax = max !== undefined ? number > max : false

    if (conditionMin) {
      const checkRequirementsErrorMessage = `[ERROR][SCHEME] ${this.#article} 의 ${key} 가 ${number} 입니다. ${key} 는 ${min} 이상이어야 합니다.`
      throw new Error(checkRequirementsErrorMessage)
    }

    if (conditionMax) {
      const checkRequirementsErrorMessage = `[ERROR][SCHEME] ${this.#article} 의 ${key} 가 ${number} 입니다. ${key} 는 ${max} 이하이어야 합니다.`
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
      throw new Error(`[ERROR][SCHEME] ${this.#article} 의 ${key} 가 ${url} 입니다. ${key} 는 http:// 또는 https:// 로 시작해야 하고, 반드시 한 글자 이상의 주소가 있어야 합니다.`)
    }

    return url
  }

  static #checkDate(key = '', date = '', pattern) {
    // /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    if (pattern.test(date) === false) {
      throw new Error(`[ERROR][SCHEME] ${this.#article} 의 ${key} 가 ${date} 입니다. ${key} 는 '년년년년-월월-일일T시시:분분:초초.협정시Z' 의 형태여야 합니다.`)
    }

    return date
  }
}