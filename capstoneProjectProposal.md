1. Create a website to learn to cook

This website will be powered by external API https://www.themealdb.com/api.php

The goal for this website is for people to learn to how to make meals and to create and record their own recipe. 

Backend will be Node.js with a database.

Frontend will be react.

Database includes three tables 
                 1. Users table (id, username, password,firstname,lastname, email)

                 2. Saved-recipes (id, area, category, name, user-id(reference User’s id) 

                 3. Self-Created-recipes (id, user-id(reference Users table, name,instruction, ingredient with amount)

Website features: 1. Users can browser recipes from external app without authentication(doesn’t need to register as a user) 
  
                             2. Users need to register as a user and be authenticated to like a recipe.

                             3. Users can like or unlike a recipe;
    
                             4. Users can create his/her own recipe, and update the database, with authentication.

                             4. Users can update or delete his/her own created recipes,  with authentication.

                             5. Users profile can only be updated only by themselves or admin;




2. Job searching 

Job remote jobs around the world

This website will be powered by external API  https://jobicy.com/api/v2/remote-jobs

The goal is to help people to find remote jobs around the world. 

Backend will be Node.js with a database.

Frontend will be react.

Database includes: 

1, users table (id, username, password, first name, last name, email)

2. Job-applications table (id(job id from API), 
                                        user-id(reference User’s id, 
                                        JobTitle, 
                                        companyName, 
                                        JobGeo)
3. Job saved table 

Website features: 1. User need to log in to view job information.

                             2. User can search for job by filtering count/geo/industry/tag.

                             3. User can like(save) / unlike a job 
   
                             4. User can apply for a job

                             5.User/admin can check his/her job collection and job application list

                             6.User can update his profile.

(This proposal is similar as the las topic, not sure if it’s qualified)


Above is the basic outline for each proposal, adjustment may applied during coding as needed. 

