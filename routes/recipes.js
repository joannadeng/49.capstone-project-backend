"use strict";

/** Routes for recipes */

const express = require('express');
const router = new express.Router(); 
const Recipe = require('../models/recipe');


/** GET /recipes/random:
 *  
 * Returns a random recipe
 * 
 * Authorization required: none
 */

router.get('/random',async function(req,res,next){
    try{
        const recipe = await Recipe.getRandom();
        console.log(recipe)
        return res.json({recipe});
    }catch(err){
        return next(err)
    }  
})

/** GET /recipes/categories 
 * 
 *  Return an array of categories
 * 
 *  {categories:['Beef','Breakfast'.....]}
 * 
 * authorization required: none
*/

router.get('/categories', async function(req,res,next) {
    try{
        const categories = await Recipe.getCategoriesList();
        console.log(categories);
        return res.json({categories});
    }catch(err){
        return next(err);
    }
})

/** GET /recipes/area 
 * 
 *  Return an array of area
 * 
 *  ["canada","usa"...]
 * 
 * authorization required: none
*/

router.get('/area', async function (req, res, next) {
    try{
        const area = await Recipe.getAreaList();
        console.log(area)
        return res.json({area});
    }catch(err){
        return next(err);
    }
})

/** Get /recipes/:name 
 * 
 * search an recipe by name
 * 
 * return an object of a recipe
*/

// 名字和id查找就留一个，暂定留id
// router.get('/:name', async function (req,res,next) {
//     try{
//         const meal = await Recipe.getByName(req.params.name);
//         return res.json({meal});
//     }catch(err){
//         return next(err);
//     }
// })

/** Get /recipes/meal/:id
 * 
 * search an recipe by id
 * 
 * return an object of a recipe
*/

router.get('/:id', async function (req,res,next) {
    try{
        const id = +req.params.id;
        const recipe = await Recipe.getById(id);
        return res.json({recipe});
    }catch(err){
        return next(err);
    }
})

/** Get /recipes/categories/:category
 * 
 * filter recipes by category
 * 
 * return [{strMeal,strMealThumb,idMeal},{strMeal,strMealThumb,idMeal}...]
 */

router.get('/categories/:category', async function (req, res, next) {
    try{
        const category = req.params.category;
        const recipes = await Recipe.getByCategory(category);
        return res.json({recipes})
    }catch(err){
        return next(err)
    }
})

/** Get /recipes/area/:area
 * 
 * filter recipes by area
 * 
 * return [{strMeal,strMealThumb,idMeal},{strMeal,strMealThumb,idMeal}...]
 */

router.get('/area/:area', async function (req, res, next) {
    try{
        const area = req.params.area;
        const recipes = await Recipe.getByArea(area);
        return res.json({recipes})
    }catch(err){
        return next(err)
    }
})

/** Get /recipes/ingredient/:ingredient
 * 
 * filter recipes by ingredient
 * 
 * return [{strMeal,strMealThumb,idMeal},{strMeal,strMealThumb,idMeal}...]
 */

router.get('/ingredient/:ingredient', async function (req, res, next) {
    try{
        const ingredient = req.params.ingredient;
        const recipes = await Recipe.getByIngredient(ingredient);
        return res.json({recipes})
    }catch(err){
        return next(err)
    }
})



module.exports = router;

