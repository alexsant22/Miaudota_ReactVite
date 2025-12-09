const mysql = require("mysql2/promise");
const dbConfig = require("./config");

async function resetDatabase() {
  try {
    // Conexão sem banco de dados específico
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });

    console.log("🔄 Conectado ao MySQL...");
    console.log(
      "⚠️  ATENÇÃO: Esta operação vai DROPAR o banco de dados existente!"
    );

    // Dropar banco de dados se existir
    await connection.query(`DROP DATABASE IF EXISTS \`${dbConfig.database}\``);
    console.log(`🗑️  Banco de dados '${dbConfig.database}' dropado.`);

    // Criar banco de dados novamente
    await connection.query(`CREATE DATABASE \`${dbConfig.database}\``);
    console.log(`✅ Banco de dados '${dbConfig.database}' criado.`);

    // Usar o banco de dados
    await connection.query(`USE \`${dbConfig.database}\``);

    // Chamar função de inicialização
    const { createDatabase } = require("./init");
    await createDatabase();

    await connection.end();
    console.log("✨ Banco de dados resetado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao resetar banco de dados:", error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  // Perguntar confirmação
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question(
    "⚠️  Tem certeza que deseja RESETAR o banco de dados? Todos os dados serão perdidos! (s/N): ",
    async (answer) => {
      if (answer.toLowerCase() === "s" || answer.toLowerCase() === "sim") {
        await resetDatabase();
      } else {
        console.log("❌ Operação cancelada.");
        process.exit(0);
      }
      readline.close();
    }
  );
}

module.exports = { resetDatabase };
