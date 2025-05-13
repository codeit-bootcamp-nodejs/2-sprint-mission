import axios from "axios";
import GetProductRequest from "./product/requests/GetProductRequest.mjs";
import GetProductResponse from "./product/responses/GetProductResponse.mjs";
import GetProductListRequest from "./product/requests/GetProductListRequest.mjs";
import GetProductListResponse from "./product/responses/GetProductListResponse.mjs";
import CreateProductRequest from "./product/requests/CreateProductRequest.mjs"
import CreateProductResponse from "./product/responses/CreateProductResponse.mjs";
import PatchProductRequest from "./product/requests/PatchProductRequest.mjs";
import PatchProductResponse from "./product/responses/PatchProductResponse.mjs";
import DeleteProductRequest from "./product/requests/DeleteProductRequest.mjs";
import DeleteProductResponse from "./product/responses/DeleteProductResponse.mjs"
import ProductEnums from "./product/ProductEnums.mjs";

export default class ProductService {
  static ORDER_BY = ProductEnums.ORDER_BY

  static #axiosInstance = new axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app/products',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  constructor() { }

  static async getProduct(productId = 0) {
    try {
      const request = new GetProductRequest({ productId: productId })
      const response = await this.#axiosInstance.get(request.toParameter())
      const product = GetProductResponse.fromJSON(response.data).product

      return product
    } catch (error) { throw error }
  }

  static async getProductList(schemes = {}) {
    try {
      const { page, pageSize, keyword, orderBy } = schemes

      const request = new GetProductListRequest({ page: page, pageSize: pageSize, keyword: keyword, orderBy: orderBy })
      const response = await this.#axiosInstance.get(``, { params: request.toQuery() })
      const getProductListResponse = GetProductListResponse.fromJSON(response.data)
      const productList = getProductListResponse.list

      return productList
    } catch (error) { throw error }
  }

  static async createProduct(name = '', description = '', price = 0, schemes = {}) {
    try {
      const { tags, images } = schemes
      const request = new CreateProductRequest({ name: name, description: description, price: price, tags: tags, images: images })
      const response = await this.#axiosInstance.post(``, request.toQuery())
      const createProductResponse = CreateProductResponse.fromJSON(response.data)
      const product = createProductResponse.product

      return product
    } catch (error) { throw error }
  }

  static async patchProduct(productId, schemes = {}) {
    try {
      const { name, description, price, tags, images } = schemes

      const request = new PatchProductRequest({ productId: productId, name: name, description: description, price: price, tags: tags, images: images })
      const response = await this.#axiosInstance.patch(request.toParameter(), request.toQuery())
      const patchProductResponse = PatchProductResponse.fromJSON(response.data)
      const product = patchProductResponse.product

      return product
    } catch (error) { throw error }
  }

  static async deleteProduct(productId = 0) {
    try {
      const request = new DeleteProductRequest({ productId: productId })
      const response = await this.#axiosInstance.delete(request.toParameter())
      const deleteProductResponse = DeleteProductResponse.fromJSON(response.data)

      return deleteProductResponse
    } catch (error) { throw error }
  }
}