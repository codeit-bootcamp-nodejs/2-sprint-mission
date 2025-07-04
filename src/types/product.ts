export interface CreateProduct {
    name: string;
    description: string;
    price: number;
    tags?: string[];
}

export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
}

export interface UpdateProduct {
    id: number;
    data: UpdateProductData;
    file?: Express.Multer.File;
}

export interface ProductQuery {
    skip?: string;
    limit?: string;
    keyword?: string;
}
