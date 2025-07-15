import getImage from "./getImage";
import imageDelete from "./imageDelete";
import uploadImages from "./uploadImages";
import uploadSingleImage from "./uploadSingleImage";

const imageService = {
    uploadImages,
    uploadSingleImage,
    getImage,
    imageDelete
};

export default imageService;