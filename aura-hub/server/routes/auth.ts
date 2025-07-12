// server/routes/auth.ts
import { Request, Response } from "express";
import { pool } from '../database';
import bcrypt from 'bcrypt';
import { notificarAdminNovoUsuario, notificarUsuarioAprovado, notificarUsuarioRejeitado } from '../email';

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Tentativa de login:", { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    // Buscar usuário no banco de dados
    const [rows] = await pool.execute(
      'SELECT id, nome, login, email, password, tipo, status FROM usuarios WHERE email = ?',
      [email]
    );

    const users = rows as any[];
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado. Verifique seu email."
      });
    }

    const user = users[0];

    // Verificar se o usuário está aprovado (para admins, sempre permitir)
    if (user.tipo !== 'admin' && user.status !== 'aprovado') {
      const statusMessages: { [key: string]: string } = {
        'pendente': 'Sua conta ainda está pendente de aprovação pelo administrador.',
        'rejeitado': 'Sua conta foi rejeitada pelo administrador.'
      };
      
      return res.status(403).json({
        success: false,
        message: statusMessages[user.status] || 'Status da conta inválido'
      });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(password, user.password);
    
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: "Senha incorreta"
      });
    }

    // Atualizar último login
    await pool.execute(
      'UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Preparar dados para enviar (sem a senha)
    const { password: _, ...userWithoutPassword } = user;

    // Gerar token simples (em produção use JWT)
    const token = Buffer.from(JSON.stringify({
      user_id: user.id,
      email: user.email,
      tipo: user.tipo,
      timestamp: Date.now()
    })).toString('base64');

    res.json({
      success: true,
      message: 'Login efetuado com sucesso',
      user: userWithoutPassword,
      token: token
    });

  } catch (error: any) {
    console.error("❌ Erro no login:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const { nome, endereco, email, login, senha } = req.body;

    console.log("📝 Tentativa de registro:", { email, nome });

    // Validar campos obrigatórios
    const camposObrigatorios = ['nome', 'endereco', 'email', 'login', 'senha'];
    for (const campo of camposObrigatorios) {
      if (!req.body[campo]) {
        return res.status(400).json({
          success: false,
          message: `Campo '${campo}' é obrigatório`
        });
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Validar senha
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se email já existe
    const [emailRows] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if ((emailRows as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado no sistema'
      });
    }

    // Verificar se login já existe
    const [loginRows] = await pool.execute(
      'SELECT id FROM usuarios WHERE login = ?',
      [login]
    );

    if ((loginRows as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Login já está em uso'
      });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir novo usuário
    const [result] = await pool.execute(
      `INSERT INTO usuarios (nome, endereco, email, login, password, tipo, status, created_at) 
       VALUES (?, ?, ?, ?, ?, 'usuario', 'pendente', CURRENT_TIMESTAMP)`,
      [nome, endereco, email, login, senhaHash]
    );

    const insertResult = result as any;
    const novoId = insertResult.insertId;

    // Buscar dados do usuário recém-criado
    const [newUserRows] = await pool.execute(
      `SELECT 
        id, 
        nome as nomeCompleto, 
        email, 
        login, 
        endereco, 
        status,
        DATE_FORMAT(created_at, '%Y/%m/%d') as dataSolicitacao
       FROM usuarios 
       WHERE id = ?`,
      [novoId]
    );

    const novoUsuario = (newUserRows as any[])[0];
    novoUsuario.status = 'pendente';

    // Enviar email para o admin sobre a nova solicitação
    console.log('📧 Enviando notificação para admin...');
    const emailResult = await notificarAdminNovoUsuario({
      nome: nome,
      email: email,
      login: login,
      endereco: endereco
    });

    if (emailResult.success) {
      console.log('✅ Email enviado para admin com sucesso');
    } else {
      console.log('⚠️ Falha ao enviar email para admin:', emailResult.error);
    }

    res.json({
      success: true,
      message: 'Usuário registrado com sucesso! Aguarde a aprovação do administrador.',
      data: novoUsuario
    });

  } catch (error: any) {
    console.error("❌ Erro no registro:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};
