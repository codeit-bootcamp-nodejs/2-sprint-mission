import ArticleService from "./source/ArticleService.js"
import ProductService from "./source/ProductService.js"

console.log(`============================`)
console.log(`= ARTICLE TEST`)
console.log(`============================`)

// CREATE ARTICLE
const createdArticle = await ArticleService.createArticle('CREATED_TITLE', 'CREATED_CONTENT', {})
console.log(`[POST] id[${createdArticle.id}] title[${createdArticle.title}] content[${createdArticle.content}]`)

// GET ARTICLE LIST
const articleList = await ArticleService.getArticleList({ page: 1, pageSize: 1, keyword: 'CREATED_TITLE', orderBy: ArticleService.ORDER_BY.RECENT })
const articleTitles = articleList.map((article) => { return `${article.id}(${article.title}),` })
console.log(`[GET] list : {${articleTitles}}`)

// GET ARTICLE
const specificArticle = await ArticleService.getArticle(articleList[0].id)
console.log(`[GET] id[${specificArticle.id}] title[${specificArticle.title}] content[${specificArticle.content}]`)

// PATCH ARTICLE
const patchedArticle = await ArticleService.patchArticle(createdArticle.id, { title: 'PATCHED_CONTENT', content: 'PATCHED_CONTENT' })
console.log(`[PATCH] id[${patchedArticle.id}] title[${patchedArticle.title}] content[${patchedArticle.content}] : like[${patchedArticle.likeCount}]`)
patchedArticle.like()
console.log(`[PATCH] id[${patchedArticle.id}] title[${patchedArticle.title}] content[${patchedArticle.content}] : like[${patchedArticle.likeCount}]`)

// DELETE ARTICLE
const deletedId = await ArticleService.deleteArticle(patchedArticle.id)
console.log(`[DELETE] id[${deletedId.id}]`)

console.log(`============================`)
console.log(`= PRODUCT TEST`)
console.log(`============================`)

// CREATE PRODUCT
const createdProduct = await ProductService.createProduct('CREATED_NAME', 'CREATED_DESCRIPTION', 100, { tags: ['전자제품'], images: ['https://.'] })
console.log(`[POST] id[${createdProduct.id}] name[${createdProduct.name}] description[${createdProduct.description}] : type[${createdProduct.constructor.name}]`)

// GET PRODUCT LIST
const productList = await ProductService.getProductList({ page: 1, pageSize: 1, keyword: 'CREATED_NAME', orderBy: ProductService.ORDER_BY.RECENT })
const productTitleList = productList.map((product) => { return `${product.id}(${product.name}),` })
console.log(`[GET] list : {${productTitleList}}`)

// GET PRODUCT
const specificProduct = await ProductService.getProduct(productList[0].id)
console.log(`[GET] id[${specificProduct.id}] name[${specificProduct.name}] description[${specificProduct.description}]`)

// PATCH PRODUCT
const patchedProduct = await ProductService.patchProduct(createdProduct.id, { name: "PATCHED_NAME", description: "PATCHED_DESCRIPTION" })
console.log(`[PATCH] id[${patchedProduct.id}] name[${patchedProduct.name}] description[${patchedProduct.description}] : favorite[${patchedProduct.favoriteCount}]`)
patchedProduct.favorite()
console.log(`[PATCH] id[${patchedProduct.id}] name[${patchedProduct.name}] description[${patchedProduct.description}] : favorite[${patchedProduct.favoriteCount}]`)

// DELETE PRODUCT
const deletedProduct = await ProductService.deleteProduct(patchedProduct.id)
console.log(`[DELETE] id[${deletedProduct.id}]`)
