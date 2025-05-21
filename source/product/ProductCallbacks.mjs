import Product from './Product.mjs';
import ElectronicProduct from './ElectronicProduct.mjs'

export default class ProductCallbacks {
  static PRODUCT_TAG_FILTER = {
    '전자제품': (json) => new ElectronicProduct(json)
  }

  static setProductByTag(json) {
    const tags = json.tags

    const key = Object.keys(this.PRODUCT_TAG_FILTER).find(tag => tags.includes(tag));

    // category
    if (key) { return this.PRODUCT_TAG_FILTER[key](json) }

    // default
    return Product.fromJSON(json)
  }
}