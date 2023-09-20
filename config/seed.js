const pool = require('./connection');
const fs = require('fs');

const tags = JSON.parse(fs.readFileSync('./data/tags.json', 'utf-8'))
  .map(tag => `('${tag.name}')`).join();

const shirts = JSON.parse(fs.readFileSync('./data/shirts.json', 'utf-8'))
  .map(shirt => `('${shirt.name}', '${shirt.type}', '${shirt.size}', ${shirt.stock}, ${shirt.tagId})`).join();

const queryTags = `
INSERT INTO "Tags" ("name")
VALUES ${tags}
`;

const queryShirts = `
INSERT INTO "Shirts" ("name", "type", "size", "stock", "TagId")
VALUES ${shirts}
`;

pool.query(queryTags, err => {
  if(err) console.log("FAILED INSERT INTO TAGS");
  else {
    console.log("SUCCESS INSERT INTO TAGS");

    pool.query(queryShirts, err => {
      if(err) console.log("FAILED INSERT INTO SHIRTS");
      else console.log("SUCCESS INSERT INTO SHIRTS");
    })
  };
});