const bcrypt = require("bcrypt");

const db = require("../db.js")
const {BCRYPT_WORK_FACTOR} = require("../config.js");

async function commonBeforeAll() {
    await db.query("DELETE FROM users");

    await db.query(`
         INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

    await db.query(`
      INSERT INTO createdRecipes(name,
                                 ingredient,
                                 instruction,
                                 username)
      VALUES('fried rice','rice','cook with high heat','u1')
      RETURNING name`)
}
 
async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function commonAfterAll() {
    await db.end();
  }
  
  
  module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
  };