import mysql from 'mysql2/promise';

// IMPORTANTE: Copie este arquivo para database.ts e configure suas credenciais
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'SUA_SENHA_MYSQL_AQUI',  // Altere para sua senha do MySQL
  database: 'projeto_ufla',
  charset: 'utf8mb4'
};

export const createConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    throw error;
  }
};

export const createPool = () => {
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

export const pool = createPool();
