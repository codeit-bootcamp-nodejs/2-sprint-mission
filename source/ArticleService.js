import axios from "axios";
import GetArticleRequest from "./article/requests/GetArticleRequest.mjs";
import GetArticleResponse from "./article/responses/GetArticleResponse.mjs";
import GetArticleListRequest from "./article/requests/GetArticleListRequest.mjs";
import GetArticleListResponse from "./article/responses/GetArticleListResponse.mjs";
import CreateArticleRequest from "./article/requests/CreateArticleRequest.mjs";
import CreateArticleResponse from "./article/responses/CreateArticleResponse.mjs";
import PatchArticleRequest from "./article/requests/PatchArticleRequest.mjs";
import PatchArticleResponse from "./article/responses/PatchArticleResponse.mjs";
import DeleteArticleRequest from "./article/requests/DeleteArticleRequest.mjs";
import DeleteArticleResponse from "./article/responses/DeleteArticleResponse.mjs"
import ArticleEnums from "./article/ArticleEnums.mjs";

export default class ArticleService {
  static ORDER_BY = ArticleEnums.ORDER_BY

  static #axiosInstance = new axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app/articles',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })

  constructor() { }

  static async getArticle(articleId = 0) {
    const request = new GetArticleRequest({ articleId: articleId })

    return this.#axiosInstance.get(request.toParameter())
      .then(
        response => {
          const getArticleResponse = GetArticleResponse.fromJSON(response.data)
          const article = getArticleResponse.article

          return article
        })
      .catch(error => { throw error })
  }

  static async getArticleList(schemes = {}) {
    const { page, pageSize, keyword, orderBy } = schemes

    const request = new GetArticleListRequest({ page: page, pageSize: pageSize, keyword: keyword, orderBy: orderBy })

    return this.#axiosInstance.get(``, { params: request.toQuery() })
      .then(
        response => {
          const getArticleListResponse = GetArticleListResponse.fromJSON(response.data)
          const articleList = getArticleListResponse.list

          return articleList
        })
      .catch(
        error => { throw error })
  }

  static async createArticle(title = '', content = '', schemes = {}) {
    const { image } = schemes

    const request = new CreateArticleRequest({ title: title, content: content, image: image })

    return this.#axiosInstance.post(``, request.toQuery())
      .then(
        response => {
          const createArticleResponse = CreateArticleResponse.fromJSON(response.data)
          const article = createArticleResponse.article

          return article
        })
      .catch(error => { throw error })
  }

  static async patchArticle(articleId = 0, schemes = {}) {
    const { title, content, image } = schemes

    const request = new PatchArticleRequest({ articleId: articleId, title: title, cotent: content, image: image })

    return this.#axiosInstance.patch(request.toParameter(), request.toQuery())
      .then(response => {
        const patchArticleResponse = PatchArticleResponse.fromJSON(response.data)
        const article = patchArticleResponse.article

        return article
      })
      .catch(error => { throw error })
  }

  static async deleteArticle(articleId = 0) {
    const request = new DeleteArticleRequest({ articleId: articleId })

    return this.#axiosInstance.delete(request.toParameter())
      .then(response => {
        return DeleteArticleResponse.fromJSON(response.data)
      })
      .catch(error => { throw error })
  }
}
