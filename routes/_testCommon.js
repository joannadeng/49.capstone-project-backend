"use strict";

const db = require('../db.js');
const User = require('../models/user')
const Recipe = require('../models/recipe')
const { createToken } = require('../helpers/tokens');



async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM savedRecipes")
    await db.query("DELETE FROM createdRecipes")

    await User.register({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "user1@user.com",
      password: "password1",
      isAdmin: false,
    });
    await User.register({
      username: "u2",
      firstName: "U2F",
      lastName: "U2L",
      email: "user2@user.com",
      password: "password2",
      isAdmin: false,
    });
    await User.register({
      username: "u3",
      firstName: "U3F",
      lastName: "U3L",
      email: "user3@user.com",
      password: "password3",
      isAdmin: false,
    });

    // await User.savedRecipe("u1",52772)
    // await User.savedRecipe("u1",52773)
    // await User.savedRecipe("u1",52774)

    await User.createRecipe("u1",
        {
            name:"fried egg",
            ingredient:"egg,olive oil",
            instruction:"cook with hot oil"
        }
    )
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

  const u1Token = createToken({ username: "u1", isAdmin: false });
  const u2Token = createToken({ username: "u2", isAdmin: false });
  const adminToken = createToken({ username: "admin", isAdmin: true }); 
  
module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
};