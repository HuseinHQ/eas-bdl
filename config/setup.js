const pool = require('./connection');

const dropTables = `DROP TABLE IF EXISTS "Shirts", "Tags"`;

const createTagsTable = `
  CREATE TABLE IF NOT EXISTS "Tags" (
    id serial PRIMARY KEY,
    "name" varchar NOT NULL
)
`;

const createShirtsTable = `
CREATE TABLE IF NOT EXISTS "Shirts" (
	id serial PRIMARY KEY,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"size" varchar NOT NULL,
	stock integer NOT NULL,
	"TagId" integer REFERENCES "Tags"(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
)
`;

pool.query(dropTables, err => {
  if(err) return console.log("FAILED DROP TABLES");
  else {
    console.log("SUCCESS DROP TABLES");
    
    pool.query(createTagsTable, err => {
      if(err) console.log("FAILED CREATE TABLE TAGS");
      else {
        console.log("SUCCESS CREATE TABLE TAGS");
  
        pool.query(createShirtsTable, err => {
          if(err) console.log("FAILED CREATE TABLE SHIRTS");
          else console.log("SUCCESS CREATE TABLE SHIRTS");
        })
      }
    })
  }
})