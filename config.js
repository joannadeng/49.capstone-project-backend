"use strict";

/** Shared config for application; can be required many places. */
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "postgresql:///recipe_test"
        : process.env.DATABASE_URL || "postgresql:///recipe";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
    SECRET_KEY,
    PORT,
    getDatabaseUri,
    BCRYPT_WORK_FACTOR
};