const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { v4:uuidv4 } = require('uuid');
const db = require('./db.js');
const dotenv = require('dotenv');
// const now = new Date().toISOString();

const products = [];
const productTags = [];
const articles = [];
const comments = [];

// Generate 5 products, each with 2 productTags
for (let i = 0; i < 5; i++) {
  const productId = uuidv4();
  products.push({
    id: productId,
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: faker.number.int({ min: 1000, max: 100000 }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  for (let j = 0; j < 2; j++) {
    productTags.push({
      id: uuidv4(),
      name: faker.commerce.productAdjective(),
      productId,
    });
  }
}

// Generate 3 articles, each with root comments and reply comments
for (let i = 0; i < 3; i++) {
  const articleId = uuidv4();
  articles.push({
    id: articleId,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // root comment -> 2 reply comment
  const root1Id = uuidv4();
  comments.push({
    id: root1Id,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    parentId: null,
    replyId: null,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    articleId
  });

  for (let j = 0; j < 2; j++) {
    comments.push({
      id: uuidv4(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      parentId: root1Id,
      replyId: root1Id,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleId
    });
  }

  // root comment -> 3 reply comment -> each reply comment has 1 reply comment
  const root2Id = uuidv4();
  comments.push({
    id: root2Id,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    parentId: null,
    replyId: null,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    articleId
  });

  // root comment -> 3 reply comments
  for (let j = 0; j < 3; j++) {
    const childId = uuidv4();
    comments.push({
      id: childId,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      parentId: root2Id,
      replyId: root2Id,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleId
    });

    // reply comment -> 1 reply comment
    comments.push({
      id: uuidv4(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      parentId: root2Id,
      replyId: childId,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      articleId
    });
  }
}


// // Save to file
dotenv.config({path:'../.env'});
const fsp = fs.promises;
async function seeding(){
    await db.$executeRaw`SET session_replication_role = 'replica';`;
    await db.product.deleteMany({});
    await db.productTags.deleteMany({});
    await db.comment.deleteMany({});
    await db.article.deleteMany({});

    await db.product.createMany({data: products,skipDuplicates: true});

    await db.productTags.createMany({data: productTags,skipDuplicates: true});

    await db.article.createMany({data: articles,skipDuplicates: true});

    await db.comment.createMany({data: comments,skipDuplicates: true});

    await db.$executeRaw`SET session_replication_role = 'origin';`;
}

seeding()
    .then( async () => {
        console.log('seeding is completed');
        await db.$disconnect();
    }).catch( async (e) => {
        console.error(`error!! program exit(1) ${e}`);
        await db.$disconnect();
        process.exit(1);
    });