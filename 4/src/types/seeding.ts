type userType = {
    id: string;
    email: string;
    nickname?: string | null;
    imageUrl?: string | null;
    password?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type tagType = {
    id: string;
    name: string;
    createdAt?: string; 
    updatedAt?: string;
};

type productType = {
    id: string;
    name: string;
    description: string;
    price: number;
    createdAt?: string; 
    updatedAt?: string;
};

type productTagType = {
    id: string;
    productId: string;
    tagId: string;
};

type articleType = {
    id: string;
    title: string;
    content: string;
    createdAt?: string; 
    updatedAt?: string;
}

type commentType = {
    id: string;
    parentId?: string | null;
    replyId?: string | null;
    title?: string | null;
    content: string;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
    articleId: string;
}

// export {
//     userType,
//     tagType,
//     productType,
//     productTagType,
//     articleType,
//     commentType
// };