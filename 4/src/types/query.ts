type QueryType<T extends string> = {
    offset?: string;
    limit?: string;
    orderBy?: T;
    name?: string;
    description?: string;
    title?: string;
    content?: string;
    lastCursor?: string;
};