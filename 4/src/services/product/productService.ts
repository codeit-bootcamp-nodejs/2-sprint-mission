import getProductById from "./getProductById";
import getProductsList from "./getProductsList";
import getProductsByTag from "./getProductsByTag";
import createProduct from "./createProduct";
import updateProduct from "./updateProduct";
import deleteProduct from "./deleteProduct";
import getTags from "./getTags";

const productService = {
    getProductsList,
    getProductsByTag,
    getProductById,
    getTags,
    createProduct,
    updateProduct,
    deleteProduct
};

export default productService;