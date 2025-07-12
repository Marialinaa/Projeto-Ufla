import nodemailer from 'nodemailer';

// IMPORTANTE: Copie este arquivo para email.ts e configure suas credenciais
// Configurações de email baseadas no config.php
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para porta 465, false para outras portas
  auth: {
    user: 'SEU_EMAIL@gmail.com',       // Altere para seu email
    pass: 'SUA_SENHA_APP_GMAIL'        // Altere para sua senha de app do Gmail
  }
};

const ADMIN_EMAIL = 'SEU_EMAIL@gmail.com';  // Altere para seu email

// Criar transporter
const transporter = nodemailer.createTransporter(SMTP_CONFIG);

// Verificar configuração do email
export const verificarConfiguracao = async () => {
  try {
    await transporter.verify();
    console.log('✅ Configuração de email válida');
    return true;
  } catch (error) {
    console.error('❌ Erro na configuração de email:', error);
    return false;
  }
};

// Enviar email para admin sobre nova solicitação
export const notificarAdminNovoUsuario = async (usuario: {
  nome: string;
  email: string;
  login: string;
  endereco: string;
}) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🔔 Nova Solicitação de Acesso</h2>
        <p>Uma nova solicitação de acesso foi recebida:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <strong>Nome:</strong> ${usuario.nome}<br>
          <strong>Email:</strong> ${usuario.email}<br>
          <strong>Login:</strong> ${usuario.login}<br>
          <strong>Endereço:</strong> ${usuario.endereco}
        </div>
        
        <p>
          <a href="http://localhost:8080/login" 
             style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verificar Solicitações
          </a>
        </p>
        
        <p style="color: #666; font-size: 12px;">
          <em>Este email foi enviado automaticamente pelo sistema de gerenciamento de usuários.</em>
        </p>
      </div>
    `;

    const mailOptions = {
      from: SMTP_CONFIG.auth.user,
      to: ADMIN_EMAIL,
      subject: '🔔 Nova Solicitação de Acesso - Sistema UFLA',
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado para admin:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Erro ao enviar email para admin:', error);
    throw error;
  }
};

// Resto do código similar, mas com placeholders para credenciais...
export const notificarUsuarioAprovado = async (usuario: {
  nome: string;
  email: string;
  login: string;
}) => {
  // Implementação similar...
};

export const notificarUsuarioRejeitado = async (usuario: {
  nome: string;
  email: string;
  login: string;
}) => {
  // Implementação similar...
};

export const inicializarEmail = async () => {
  console.log('🔧 Inicializando serviço de email...');
  const isValid = await verificarConfiguracao();
  if (isValid) {
    console.log('✅ Serviço de email inicializado com sucesso');
  } else {
    console.warn('⚠️ Problema na configuração de email. Verifique as credenciais.');
  }
};
