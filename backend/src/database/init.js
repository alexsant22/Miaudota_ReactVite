const mysql = require("mysql2/promise");
const dbConfig = require("./config");

async function createDatabase() {
  try {
    // Conexão sem banco de dados específico
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });

    console.log("Conectado ao MySQL...");

    // Criar banco de dados se não existir
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``
    );
    console.log(`Banco de dados '${dbConfig.database}' criado/verificado.`);

    // Usar o banco de dados
    await connection.query(`USE \`${dbConfig.database}\``);

    // Criar tabela de usuários
    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    console.log('Tabela "users" criada/verificada.');

    // Criar tabela de pets
    await connection.query(`
            CREATE TABLE IF NOT EXISTS pets (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                species VARCHAR(50) NOT NULL,
                breed VARCHAR(100),
                age INT,
                age_unit ENUM('meses', 'anos') DEFAULT 'meses',
                gender ENUM('M', 'F') NOT NULL,
                size ENUM('pequeno', 'medio', 'grande') NOT NULL,
                weight DECIMAL(5,2),
                description TEXT,
                health_info TEXT,
                temperament VARCHAR(100),
                location VARCHAR(200),
                status ENUM('disponivel', 'adotado', 'processo') DEFAULT 'disponivel',
                is_vaccinated BOOLEAN DEFAULT false,
                is_dewormed BOOLEAN DEFAULT false,
                is_castrated BOOLEAN DEFAULT false,
                image_url VARCHAR(500),
                additional_images JSON,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_species (species),
                INDEX idx_status (status)
            )
        `);
    console.log('Tabela "pets" criada/verificada.');

    // Criar tabela de favoritos
    await connection.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                pet_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
                UNIQUE KEY unique_favorite (user_id, pet_id),
                INDEX idx_user_id (user_id),
                INDEX idx_pet_id (pet_id)
            )
        `);
    console.log('Tabela "favorites" criada/verificada.');

    // Criar tabela de interesses em adoção
    await connection.query(`
            CREATE TABLE IF NOT EXISTS adoption_interest (
                id INT PRIMARY KEY AUTO_INCREMENT,
                pet_id INT NOT NULL,
                user_id INT,
                user_name VARCHAR(100) NOT NULL,
                user_email VARCHAR(100) NOT NULL,
                user_phone VARCHAR(20),
                message TEXT,
                status ENUM('pendente', 'contatado', 'aprovado', 'rejeitado') DEFAULT 'pendente',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_pet_id (pet_id),
                INDEX idx_status (status)
            )
        `);
    console.log('Tabela "adoption_interest" criada/verificada.');

    // Inserir dados de exemplo se as tabelas estiverem vazias
    await insertSampleData(connection);

    await connection.end();
    console.log("Banco de dados inicializado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    process.exit(1);
  }
}

async function insertSampleData(connection) {
  try {
    // Verificar se já existem pets
    const [pets] = await connection.query("SELECT COUNT(*) as count FROM pets");
    if (pets[0].count > 0) {
      console.log("Dados já existem, pulando inserção de exemplo.");
      return;
    }

    // Inserir usuário de exemplo
    const [userResult] = await connection.query(
      `
            INSERT INTO users (email, password, name, phone) 
            VALUES (?, ?, ?, ?)
        `,
      [
        "admin@miaudota.com",
        "$2a$10$YourHashedPasswordHere",
        "Administrador",
        "(11) 99999-9999",
      ]
    );

    const userId = userResult.insertId;

    // Inserir pets de exemplo
    const samplePets = [
      {
        name: "Luna",
        species: "Gato",
        breed: "Siamês",
        age: 2,
        age_unit: "anos",
        gender: "F",
        size: "pequeno",
        weight: 3.5,
        description:
          "Gatinha dócil e brincalhona, adora carinho e está acostumada com crianças. É castrada e vacinada.",
        health_info: "Vacinada, vermifugada e castrada. Saudável.",
        temperament: "Dócil, brincalhona",
        location: "São Paulo, SP",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        image_url:
          "https://images.unsplash.com/photo-1514888286974-6d03bde4ba6d?w=600&h=400&fit=crop",
        created_by: userId,
      },
      {
        name: "Thor",
        species: "Cachorro",
        breed: "Labrador",
        age: 3,
        age_unit: "anos",
        gender: "M",
        size: "grande",
        weight: 28.0,
        description:
          "Muito amigável e adora crianças. Treinado para fazer necessidades no lugar certo.",
        health_info: "Vacinado, vermifugado e castrado. Peso saudável.",
        temperament: "Amigável, brincalhão",
        location: "Rio de Janeiro, RJ",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        image_url:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
        created_by: userId,
      },
      {
        name: "Mimi",
        species: "Gato",
        breed: "Persa",
        age: 4,
        age_unit: "anos",
        gender: "F",
        size: "pequeno",
        weight: 4.2,
        description:
          "Calma e carinhosa, ideal para apartamento. Acostumada com outros animais.",
        health_info:
          "Vacinada e vermifugada. Necessita cuidados com pelos longos.",
        temperament: "Calma, carinhosa",
        location: "Belo Horizonte, MG",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        image_url:
          "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=400&fit=crop",
        created_by: userId,
      },
      {
        name: "Rex",
        species: "Cachorro",
        breed: "Vira-lata",
        age: 8,
        age_unit: "meses",
        gender: "M",
        size: "medio",
        weight: 12.5,
        description:
          "Brincalhão e cheio de energia. Adora passeios e está em treinamento.",
        health_info: "Vacinado e vermifugado. Saudável.",
        temperament: "Energético, brincalhão",
        location: "Curitiba, PR",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: false,
        image_url:
          "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=400&fit=crop",
        created_by: userId,
      },
      {
        name: "Nina",
        species: "Cachorro",
        breed: "Poodle",
        age: 5,
        age_unit: "anos",
        gender: "F",
        size: "pequeno",
        weight: 6.8,
        description:
          "Muito inteligente e obediente. Conhece vários comandos e é muito carinhosa.",
        health_info: "Vacinada, vermifugada e castrada. Peso ideal.",
        temperament: "Inteligente, obediente",
        location: "Porto Alegre, RS",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: true,
        image_url:
          "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=600&h=400&fit=crop",
        created_by: userId,
      },
      {
        name: "Mel",
        species: "Gato",
        breed: "SRD",
        age: 1,
        age_unit: "anos",
        gender: "F",
        size: "pequeno",
        weight: 2.8,
        description:
          "Filhote muito brincalhona e curiosa. Está aprendendo a usar a caixinha de areia.",
        health_info: "Vacinada e vermifugada. Saudável.",
        temperament: "Brincalhona, curiosa",
        location: "Florianópolis, SC",
        status: "disponivel",
        is_vaccinated: true,
        is_dewormed: true,
        is_castrated: false,
        image_url:
          "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=400&fit=crop",
        created_by: userId,
      },
    ];

    for (const pet of samplePets) {
      await connection.query(
        `
                INSERT INTO pets (
                    name, species, breed, age, age_unit, gender, size, weight,
                    description, health_info, temperament, location, status,
                    is_vaccinated, is_dewormed, is_castrated, image_url, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
        Object.values(pet)
      );
    }

    console.log(`${samplePets.length} pets de exemplo inseridos.`);

    // Inserir alguns interesses de exemplo
    await connection.query(`
            INSERT INTO adoption_interest (pet_id, user_name, user_email, user_phone, message)
            VALUES 
            (1, 'Maria Silva', 'maria@email.com', '(11) 98888-7777', 'Adorei a Luna! Tenho experiência com gatos siameses.'),
            (2, 'João Santos', 'joao@email.com', '(21) 97777-6666', 'Procuro um cachorro para minha família. Tenho duas crianças.')
        `);

    console.log("Dados de exemplo inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados de exemplo:", error);
  }
}

// Executar a inicialização
if (require.main === module) {
  createDatabase();
}

module.exports = { createDatabase, insertSampleData };
