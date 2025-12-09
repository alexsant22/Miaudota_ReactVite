const mysql = require("mysql2/promise");
const dbConfig = require("./config");

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Testar conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexão com o banco de dados estabelecida");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error.message);
    return false;
  }
}

// Função para executar queries com tratamento de erros
async function executeQuery(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Erro na query:", error.message);
    console.error("SQL:", sql);
    console.error("Parâmetros:", params);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Função para executar transações
async function executeTransaction(queries) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const results = [];
    for (const query of queries) {
      const [result] = await connection.execute(query.sql, query.params);
      results.push(result);
    }

    await connection.commit();
    return results;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Erro na transação:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction,
};
