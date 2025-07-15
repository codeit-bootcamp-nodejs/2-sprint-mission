type productCreateData = {
    id: string;
    name: string;
    description: string;
    price: number;
    tagNames?: { name: string }[]
};