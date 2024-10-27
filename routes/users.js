"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const recipeNewSchema = require("../schemas/recipeNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    // const token = createToken(user);
    return res.status(201).json({ user});
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, savedRecipes }
 * 
 * where saveRecipes is { id, name, category, area }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username]/createRecipe/recipeId 
 * 
 * return a single created recipe
 * 
 * Authorization required: same-user-as-:username
 * 
*/
router.get("/:username/createRecipe/:recipeId", ensureCorrectUserOrAdmin, async function (req, res,next) {
  try{
    const username = req.params.username;
    const recipeId = req.params.recipeId;
    const recipe = await User.singleCreateRecipe(username, recipeId);
    console.log("createRecipe:",recipe)
    return res.json({recipe})
  }catch(err){
    return next(err);
  }
})

/** GET /[username]/createRecipe
 *
 *  return created recipes array
 * 
 *  Authorization required: same-user-as-:username
 * 
 */

router.get("/:username/createRecipe", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try{
    const username = req.params.username;
    const recipes = await User.createRecipeList(username);
    console.log(recipes)
    return res.json({recipes});
  }catch(err){
    return next(err);
  }
})

/** POST /[username]/createRecipe
 * 
 * Return a new recipe
 * 
 * Authorization required: same-user-as-:username
 * 
 */

router.post('/:username/createRecipe', ensureLoggedIn, async function (req, res, next) {
  try{
    const validator = jsonschema.validate(req.body, recipeNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const recipe = await User.createRecipe(req.params.username, req.body);
    return res.json({recipe});

  }catch(err){
    return next(err)
  }
})


/** DELETE /[username]/createdRecipe/[id]
 * 
 * return { deleted: recipeId}
 * 
 * Authorization required: admin or same-user-as-:username
 */
router.delete("/:username/createRecipe/:id", ensureCorrectUserOrAdmin, async function(req,res,next){
  try{
    const recipeId = +req.params.id;
    await User.removeCreatedRecipe(recipeId);
    return res.json({ deleted: recipeId});
  }catch(err){
    return next(err);
  }
})


/** POST /[username]/recipes/[id] 
 *
 * Returns {"saved": recipeId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/savedRecipe/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const recipeId = req.params.id;
    const recipe = await User.savedRecipe(req.params.username,recipeId);
    return res.json({recipe});
  } catch (err) {
    return next(err);
  }
});

/**GET /[username/savedRecipe] 
 * 
 * return {recipes:{recipes}}  / return the saved recipes list 
 * 
 * Authorization required: admin or same-user-as-:username
*/

router.get("/:username/savedRecipe", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try{
    const username = req.params.username;
    console.log(username)
    const recipes = await User.savedRecipeList(username);
    return res.json({recipes});
  }catch(err){
    return next(err);
  }
})


/** DELETE /[username]/savedRecipe/[id]
 * 
 * return { deleted: recipeId}
 * 
 * Authorization required: admin or same-user-as-:username
 */
router.delete("/:username/savedRecipe/:id",ensureCorrectUserOrAdmin, async function(req,res,next){
  try{
    const { id }= req.params;
    await User.removeSavedRecipe(id);
    return res.json({ deleted: id});
  }catch(err){
    return next(err);
  }
})




module.exports = router;
