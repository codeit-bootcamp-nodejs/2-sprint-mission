export default class SprintUtility {
  static from(value, typeList, message) {
    let typeOfValue = ''
    if (Array.isArray(value)) {
      typeOfValue = 'array'
    } else if (value === null && typeof value !== 'string' && typeof value === 'object') {
      typeOfValue = 'null'
    } else {
      typeOfValue = typeof value
    }

    const typeListForCheck = Array.isArray(typeList) ? typeList : [typeList]

    if (typeListForCheck.includes(typeOfValue) === false) {
      throw new TypeError(message)
    }

    return value
  }
}