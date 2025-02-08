const bcrypt = require("bcryptjs");
const pool = require("../config/database");
require('dotenv').config(); // Carrega as variáveis de ambiente

const jwt = require('jsonwebtoken'); // Certifique-se de que o jwt está importado

const generateToken = require("../utils/generateToken");

/************************************************************************* */

const register = async (req, res) => {
  console.log('Requisição recebida:', req.body); // Verifica o corpo da requisição

  const { email, password, user_type } = req.body;

  if (!email || !password || !user_type) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) return res.status(400).json({ error: "Email já cadastrado!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Senha criptografada:', hashedPassword); // Verifica o hash da senha

    const newUser = await pool.query(
      "INSERT INTO users (email, password, user_type) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, user_type]
    );

    console.log('Usuário criado:', newUser.rows[0]); // Verifica os dados do usuário criado

    const token = generateToken(newUser.rows[0]);

    res.status(201).json({
      token,
      user: { id: newUser.rows[0].id, email: newUser.rows[0].email, user_type: newUser.rows[0].user_type },
    });
  } catch (err) {
    console.error('Erro ao tentar registrar o usuário:', err); // Exibe o erro detalhado
    res.status(500).json({ error: "Erro no servidor!" });
  }
};

//******************************************************** */


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se os campos foram preenchidos
    if (!email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    // Busca o usuário pelo email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    // Verifica se o usuário existe
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado!" });
    }

    const user = result.rows[0];

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Senha incorreta!" });
    }

    // Gera um token JWT para o usuário
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET, // Troque isso por uma variável de ambiente
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login realizado com sucesso!", token, user });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no login", details: err.message });
  }
};

/************************************************************************************* */

// Função para listar os usuários
const listUsers = async (req, res) => {
  try {
    console.log("Buscando usuários no banco de dados...");

    const result = await pool.query("SELECT id, email, user_type FROM users");

    if (result.rows.length === 0) {
      console.log("Nenhum usuário encontrado.");
      return res.status(404).json({ message: "Sem usuário na base de dados" });
    }

    console.log("Usuários encontrados:", result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao obter usuários:", err);
    res.status(500).json({ error: "Erro ao obter usuários", details: err.message });
  }
};



module.exports = { register, login, listUsers };
