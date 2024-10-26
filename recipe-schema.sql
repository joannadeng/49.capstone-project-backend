CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
       CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE savedRecipes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    area TEXT NOT NULL,
    username VARCHAR(25) NOT NULL 
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE createdRecipes (
    id SERIAL PRIMARY KEY, 
    name TEXT UNIQUE NOT NULL,
    ingredient TEXT NOT NULL,
    instruction VARCHAR(200) NOT NULL,
    username VARCHAR(25) NOT NULL 
        REFERENCES users ON DELETE CASCADE
)

