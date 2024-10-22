"use strict";

const axios = require("axios")

const {BadRequestError} = require('../expressError')

const BASE_URL = "https://www.themealdb.com/api/json/v1/1"

class Recipe {

   /** Get a single recipe,
    * 
    * Authentication required: none
    * 
    * return a meal object meal:{strMeal,strCategory,strArea,strInstructions}
    */

    static async getRandom(){
        const res = await axios.get(`${BASE_URL}/random.php`);
        console.log(res.data);
        if(res){
          const meal = res.data.meals; //meal is an array with one element
          const {strMeal,strCategory,strArea,strInstructions} = meal[0];
          return {meal:{strMeal,strCategory,strArea,strInstructions}}  
        }
        return new BadRequestError();
        
        
    }

    /** Get a list of categories 
     * 
     * Authentication required: none
     * 
     * return an array of categories;
     * 
    */

    static async getCategoriesList(){
        const res = await axios.get(`${BASE_URL}/list.php?c=list`);
        let catArr = res.data.meals;
        console.log(catArr[0].strCategory)
        let list = [];
        if(catArr){
            for(let i in catArr){
                list.push(catArr[i].strCategory)
            }
            return list;
        }
        throw new BadRequestError();
    }

    /** Get a list of area 
     * 
     * Authentication required: none
     * 
     * return an array of area;
    */

    static async getAreaList() {
        const res = await axios.get(`${BASE_URL}/list.php?a=list`);
        let areaArr = res.data.meals;
        let list = [];
        if(areaArr){
            for(let i in areaArr){
                list.push(areaArr[i].strArea)
            }
            // console.log(list);
            return list;
        }
        throw new BadRequestError();
    }

    /** Get a specific recipe by name;
     * 
     * Authentication required: none
     * 
     * return an object of meal:{strMeal,strCategory,strArea,strInstructions};
    */


    static async getByName(name) {
        const res = await axios.get(`${BASE_URL}/search.php?s=${name}`);
        const meal = res.data.meals; //an array with one element ==> that single meal
        if(!meal)throw new BadRequestError();

        const {idMeal,strMeal,strCategory,strArea,strInstructions} = meal[0];
        const targetMeal = {id:idMeal,
                               name:strMeal,
                              category:strCategory,
                              area:strArea,
                              instruction:strInstructions}
        return targetMeal;
      
    }

    /** Get a specific recipe by Id;
     * 
     * Authentication required: none
     * 
     * return an object of meal:{strMeal,strCategory,strArea,strInstructions};
    */


    static async getById(id) {
        const res = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
        const recipe = res.data.meals; //an array with one element ==> that single meal
        if(!recipe) throw new BadRequestError();

         const {idMeal,strMeal,strCategory,strArea,strMealThumb,strInstructions} = recipe[0];

         const targetRecipe = {id:idMeal,
                             name:strMeal,
                             category:strCategory,
                             area:strArea,
                             image:strMealThumb,
                             instruction:strInstructions};

         return targetRecipe;
    }


    static async getByCategory(category) {
        const res = await axios.get(`${BASE_URL}/filter.php?c=${category}`)
        const recipes = res.data.meals;
        if(!recipes) throw new BadRequestError();
        console.log(recipes)
        return recipes;
    }

    static async getByArea(area) {
        const res = await axios.get(`${BASE_URL}/filter.php?a=${area}`)
        const recipes = res.data.meals;
        if(!recipes) throw new BadRequestError();
        console.log(recipes)
        return recipes;
    }
    
    static async getByIngredient(ingredient) {
        const res = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`)
        console.log(res)
        const recipes = res.data.meals;
        // if(!recipes) throw new BadRequestError();
        return recipes;
    }
}

module.exports = Recipe;
