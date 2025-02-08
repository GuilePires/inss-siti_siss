const pool = require("../config/database");

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};



const addUser = async (email, password, user_type) => {
  const result = await pool.query(
    "INSERT INTO users (email, password, user_type) VALUES ($1, $2, $3) RETURNING *",
    [email, password, user_type]
  );
  return result.rows[0];
};






module.exports = { findUserByEmail, addUser };