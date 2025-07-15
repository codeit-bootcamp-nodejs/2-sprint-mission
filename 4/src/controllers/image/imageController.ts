import getImageHandler from "./getImage";
import imageDeleteHandler from "./imageDeleteHandler";
import uploadImagesHanlder from "./uploadImagesHanlder";
import uploadSingleImageHandler from './uploadSingleImageHandler'

const imageController = {
    uploadImagesHanlder,
    uploadSingleImageHandler,
    getImageHandler,
    imageDeleteHandler
};

export default imageController;