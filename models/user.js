"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError.js");

const Recipe = require('./recipe.js')

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, firstName, lastName, email, isAdmin }) {
    
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, savedRecipes, createdRecipes }
   * 
   *   where savedRecipes is { id, name, category, area }
   * 
   *   where createdRecipes is {id , name }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const savedRecipes = await db.query(
      `SELECT s.id, s.recipeId, s.name, s.category, s.area
      FROM savedRecipes AS s
      WHERE s.username = $1`,
      [username]
    )

    // if(savedRecipes.rows.length > 0) 
      user.savedRecipes = savedRecipes.rows;

    const createdRecipes = await db.query(
      `SELECT c.id,c.name
      FROM createdRecipes AS c
      WHERE c.username = $1`,
      [username]
    )

    // if(createdRecipes.rows.length > 0) 
      user.createdRecipes = createdRecipes.rows;
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
          isAdmin: "is_admin",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

/**
 * checkUser function
 * receive a username, return a user
 */
  static async checkUser(username){
    const userCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`, [username]);
    const user = userCheck.rows[0];
    if (!user) throw new NotFoundError(`User Not Found`);
    return user;
  }

  /** Save a recipe, update db, returns undefined.
   *
   * - username: user saves the recipe
   * - recipeId:
   **/

  static async savedRecipe(username, recipeID) { 
  
    // check if this recipe logic
    const recipe = await Recipe.getById(recipeID);
   
    if(!recipe) throw new NotFoundError(`Not Found this recipe:${recipeID}`);

    // check if this recipe already been saved
    const savedList = await this.savedRecipeList(username);

     if(savedList.length > 0) {
      const recipeIds = await savedList.map(recipe => recipe.recipeid)
      const idSet = new Set(recipeIds);
      const idArray = Array.from(idSet);
      if(idArray.includes(+recipeID)){
          console.log("repeated")
         return;
       }
    }
  
    const {recipeId, name, category, area} = recipe;

    User.checkUser(username);

    let result = await db.query(
      `INSERT INTO savedRecipes (recipeId, name, category, area, username)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING recipeId, name,category,area,username`,
    [recipeId, name, category, area, username]);

    return result.rows[0]
  }



  /**j Get an array of saved recipes */

  static async savedRecipeList(username){
    let user = await this.get(username)
    return user.savedRecipes;
  }

  static async createRecipeList(username){

    let user = await this.get(username)
    return user.createdRecipes;

}


  /** Delete a saved recipe from database; returns undefined. */

  static async removeSavedRecipe(id) {

    console.log("recipeId:",id);
    await db.query(
      `DELETE 
       FROM savedRecipes
       WHERE id = $1
       RETURNING id `, [id]
    );
  }


  /** create a recipe, update db, returns the created recipe.
   *
   * - username: user creates the recipe
   * - data: required data to create a recipe
   **/

  static async createRecipe(username, data){
    const user = await this.get(username);

    const {name, ingredient,instruction} = data;
    let result = await db.query(
      `INSERT INTO createdRecipes (name, ingredient, instruction, username)
       VALUES($1, $2, $3, $4)
       RETURNING name, ingredient, instruction, username`,
       [name,ingredient,instruction,username],
    );
    
    const recipe = result.rows[0];
    return recipe;
  }

  /** Get a single created recipe */

  static async singleCreateRecipe(username, recipeId){

    User.checkUser(username);

    const recipeCheck = await db.query(
          `SELECT id, name, ingredient, instruction
          FROM createdRecipes
          WHERE id = $1`, [recipeId]
    )
    const rec = recipeCheck.rows[0];

    if(!rec) throw new BadRequestError(`Can't find recipe: ${recipeId}`) 

      return rec;
  }

  /** remove a single created recipe */

  static async removeCreatedRecipe(recipeId) {

      const result = await db.query(
        `DELETE 
         FROM createdRecipes
         WHERE id = $1
         RETURNING id `, [recipeId]
      );

      const recipe = result.rows[0];

      if(!recipe) throw new NotFoundError(`You don't have this recipeId: ${recipeId}`);
  }
}


module.exports = User;
