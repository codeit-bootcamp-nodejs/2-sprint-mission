import createProductHandler from './createProductHandler';
import getProductByIdHandler from './getProductByIdHandler';
import getProductListHandler from './getProductListHandler';
import getProductsByTagHandler from './getProductsByTagHandler';
import updateProductHandler from './updateProductHandler';
import deleteProductHandler from './deleteProductHandler';
import getTagsHandler from './getTagsHandler';

const productController = {
    getProductListHandler,
    getProductsByTagHandler,
    getProductByIdHandler,
    getTagsHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler
};

export default productController;