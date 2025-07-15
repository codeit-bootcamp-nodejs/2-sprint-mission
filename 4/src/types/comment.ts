type metadataType = {
    lastCursor: string | null,
    hasNextPage: boolean,
};

type commentReqBody = {
    title: string | undefined;
    content: string;
};

type whereToLeaveComment = "articles" | "products";