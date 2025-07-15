import db from '../../model/prisma';

const getTags = async function(){
    const allTags = await db.tag.findMany({});

    return allTags;
};

export default getTags;