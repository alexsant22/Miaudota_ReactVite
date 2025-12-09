const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name, phone } = req.body;

      // Validação básica
      if (!email || !password || !name) {
        return res.status(400).json({
          error: "Email, senha e nome são obrigatórios",
        });
      }

      // Verificar se email já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: "Email já cadastrado",
        });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const userId = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        phone,
      });

      // Buscar usuário criado (sem senha)
      const user = await UserModel.findById(userId);

      res.status(201).json({
        message: "Usuário registrado com sucesso",
        user,
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email e senha são obrigatórios",
        });
      }

      // Buscar usuário
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: "Credenciais inválidas",
        });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          error: "Credenciais inválidas",
        });
      }

      // Remover senha da resposta
      delete user.password;

      res.json({
        message: "Login realizado com sucesso",
        user,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.params.userId || req.user?.id;

      if (!userId) {
        return res.status(400).json({
          error: "ID do usuário é obrigatório",
        });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado",
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.params.userId || req.user?.id;
      const { name, phone } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: "ID do usuário é obrigatório",
        });
      }

      if (!name) {
        return res.status(400).json({
          error: "Nome é obrigatório",
        });
      }

      const user = await UserModel.update(userId, { name, phone });
      res.json({
        message: "Perfil atualizado com sucesso",
        user,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = AuthController;
