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
const pool = new Pool({
    host: 'localhost',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432,
});

// --- FUNÇÕES DE INICIALIZAÇÃO DO BANCO DE DADOS ---
const inicializarBancoDeDados = async () => {
    // Cria a tabela de utilizadores se não existir
    const queryUsuarios = `
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
    // Cria a tabela de chamados se não existir
    const queryChamados = `
        CREATE TABLE IF NOT EXISTS chamados (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'Aberto',
            priority VARCHAR(50),
            assignee VARCHAR(255),
            requester VARCHAR(255),
            email VARCHAR(255),
            sala VARCHAR(50),
            predio VARCHAR(50),
            telefone VARCHAR(50),
            patrimonio VARCHAR(100),
            progress INT DEFAULT 0,
            situation VARCHAR(100) DEFAULT 'Aguardando Atendimento',
            solution_notes TEXT,
            attachment VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(queryUsuarios);
        await pool.query(queryChamados);
        console.log('Tabelas "usuarios" e "chamados" verificadas/criadas com sucesso.');
    } catch (error) {
        console.error('Erro ao criar as tabelas:', error);
    }
};

// =============================================================
// --- ROTAS DA API ---
// =============================================================

// --- Rotas de Autenticação (sem alterações) ---
app.post('/cadastro', async (req, res) => {
    const { fullname, email, username, birthdate, password } = req.body;
    try {
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const insertQuery = `
            INSERT INTO usuarios (fullname, email, username, birthdate, password_hash)
            VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
        const values = [fullname, email, username, birthdate, password_hash];
        const result = await pool.query(insertQuery, values);
        res.status(201).json({ message: 'Utilizador registado com sucesso!', userId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor. O email ou nome de utilizador pode já estar em uso.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const user = result.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        const userResponse = { id: user.id, username: user.username, email: user.email };
        res.status(200).json({ message: 'Login realizado com sucesso!', user: userResponse });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});


// --- ROTAS DO CRUD DE CHAMADOS ---

// ROTA PARA LER TODOS OS CHAMADOS (Read)
app.get('/chamados', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chamados ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar chamados:', error);
        res.status(500).json({ message: 'Erro no servidor ao buscar chamados.' });
    }
});

// ROTA PARA CRIAR UM NOVO CHAMADO (Create)
app.post('/chamados', async (req, res) => {
    const { title, priority, requester, email, sala, predio, telefone, patrimonio, description } = req.body;
    try {
        const insertQuery = `
            INSERT INTO chamados (title, priority, requester, email, sala, predio, telefone, patrimonio, description, status, progress, situation)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Aberto', 0, 'Aguardando Atendimento')
            RETURNING *;
        `;
        const values = [title, priority, requester, email, sala, predio, telefone, patrimonio, description];
        const result = await pool.query(insertQuery, values);
        console.log('Novo chamado criado com sucesso! ID:', result.rows[0].id);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        res.status(500).json({ message: 'Erro no servidor ao criar chamado.' });
    }
});

// ROTA PARA ATUALIZAR UM CHAMADO (Update)
app.put('/chamados/:id', async (req, res) => {
    const { id } = req.params;
    const { assignee, status, situation, progress, solution_notes } = req.body;
    try {
        const updateQuery = `
            UPDATE chamados
            SET assignee = $1, status = $2, situation = $3, progress = $4, solution_notes = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [assignee, status, situation, progress, solution_notes, id];
        const result = await pool.query(updateQuery, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Chamado não encontrado.' });
        }
        console.log('Chamado atualizado com sucesso! ID:', result.rows[0].id);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar chamado:', error);
        res.status(500).json({ message: 'Erro no servidor ao atualizar chamado.' });
    }
});


// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(port, () => {
    console.log(`Backend a rodar em http://localhost:${port}`);
    inicializarBancoDeDados();
});

