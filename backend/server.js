// --- IMPORTAÇÕES ---
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- CONEXÃO COM O BANCO DE DADOS POSTGRESQL (DOCKER) ---
// Como o backend está a rodar localmente (fora do Docker), o host do banco
// é 'localhost', pois a porta 5432 do contentor está mapeada para a sua máquina.
const pool = new Pool({
    host: 'localhost', // MUDANÇA IMPORTANTE AQUI
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432,
});

// --- FUNÇÃO PARA CRIAR A TABELA DE UTILIZADORES ---
const criarTabelaUsuarios = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            birthdate DATE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log('Tabela "usuarios" verificada/criada com sucesso no banco de dados.');
    } catch (error) {
        console.error('Erro ao criar a tabela de utilizadores:', error);
    }
};

// =============================================================
// --- ROTAS DA APLICAÇÃO (ENDPOINTS) ---
// =============================================================

// ROTA DE CADASTRO (CREATE do CRUD)
app.post('/cadastro', async (req, res) => {
    const { fullname, email, username, birthdate, password } = req.body;
    try {
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const insertQuery = `
            INSERT INTO usuarios (fullname, email, username, birthdate, password_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const values = [fullname, email, username, birthdate, password_hash];
        const result = await pool.query(insertQuery, values);
        console.log('Utilizador registado com sucesso! ID:', result.rows[0].id);
        res.status(201).json({ message: 'Utilizador registado com sucesso!', userId: result.rows[0].id });
    } catch (error) {
        console.error('Erro ao registar utilizador:', error);
        res.status(500).json({ message: 'Erro no servidor. O email ou nome de utilizador pode já estar em uso.' });
    }
});

// ROTA DE LOGIN (READ do CRUD)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const selectQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await pool.query(selectQuery, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const user = result.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        console.log('Login bem-sucedido para o utilizador:', user.username);
        const userResponse = { id: user.id, username: user.username, email: user.email };
        res.status(200).json({ message: 'Login realizado com sucesso!', user: userResponse });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(port, () => {
    console.log(`Backend a rodar em http://localhost:${port}`);
    criarTabelaUsuarios();
});

