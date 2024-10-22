\echo 'Delete and recreate recipe db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE recipe;
CREATE DATABASE recipe;
\connect recipe

\i recipe-schema.sql

\echo 'Delete and recreate recipe_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE recipe_test;
CREATE DATABASE recipe_test;
\connect recipe_test

\i recipe-schema.sql