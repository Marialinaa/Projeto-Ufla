# 🌟 Aura Hub - Sistema de Gerenciamento de Usuários

> Sistema completo de cadastro, aprovação e gerenciamento de usuários com interface administrativa moderna.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

## 🚀 Funcionalidades

### 👥 Para Usuários
- 📝 **Cadastro simplificado** com validação em tempo real
- 📧 **Notificação automática** por email ao administrador
- 🔐 **Login seguro** com senhas criptografadas
- 📱 **Interface responsiva** para todos os dispositivos

### 🔧 Para Administradores
- 📊 **Dashboard completo** com estatísticas em tempo real
- ✅ **Aprovação/Rejeição** de usuários em um clique
- 📧 **Notificações automáticas** para usuários aprovados/rejeitados
- 🗂️ **Sistema CRUD** para gerenciar conteúdo
- 🎨 **Interface moderna** com sidebar responsiva

## 🛠️ Tecnologias

### Frontend
- **React 18** + TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Router** para navegação
- **Axios** para requisições HTTP

### Backend
- **Node.js** + Express + TypeScript
- **PHP** para APIs específicas
- **MySQL** para banco de dados
- **bcrypt** para criptografia de senhas
- **PHPMailer** / **Nodemailer** para emails

## ⚡ Instalação e Configuração

### 📋 Pré-requisitos
- **Node.js** 18+ 
- **XAMPP** (Apache + MySQL + PHP)
- **npm** ou **yarn**

### 🔧 Configuração Rápida

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/aura-hub.git
   cd aura-hub
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   ```bash
   # Windows PowerShell
   .\private\setup-dev.ps1
   ```
   
   Ou configure manualmente:
   - Copie `private/config.example.php` para `php-files/config.php`
   - Copie `private/database.example.ts` para `server/database.ts`
   - Configure suas credenciais nos arquivos

4. **Configure o banco de dados**
   - Inicie o XAMPP (Apache + MySQL)
   - Execute o arquivo `criar_tabela_usuarios.sql` no phpMyAdmin
   - Execute o arquivo `criar_tabela_xpto.sql` no phpMyAdmin

5. **Inicie o projeto**
   ```bash
   npm run dev
   ```

6. **Acesse o sistema**
   - Frontend: http://localhost:8080
   - Login admin: `admin@sistema.com` / `123456`

## 📁 Estrutura do Projeto

```
aura-hub/
├── 🎨 client/              # Frontend React
│   ├── pages/              # Páginas da aplicação
│   ├── components/         # Componentes reutilizáveis
│   └── services/           # Serviços de API
├── 🔧 server/              # Backend Node.js
│   ├── routes/             # Rotas da API
│   └── database.ts         # Configuração do banco
├── 🐘 php-files/           # Backend PHP
│   ├── config.php          # Configurações
│   └── *.php               # APIs específicas
├── 🔒 private/             # Arquivos sensíveis (não commitados)
│   ├── credentials.md      # Credenciais padrão
│   ├── *.example.*         # Templates de configuração
│   └── setup-dev.ps1       # Script de configuração
└── 📊 shared/              # Tipos compartilhados
```

## 🎯 Como Usar

### 👤 Fluxo do Usuário
1. Acesse a página inicial
2. Clique em "Sign Up" 
3. Preencha o formulário de cadastro
4. Aguarde aprovação do administrador
5. Receba email de confirmação
6. Faça login no sistema

### 🔧 Fluxo do Administrador
1. Acesse `/login` 
2. Entre com credenciais de admin
3. Vá para o painel administrativo
4. Aprove/rejeite usuários pendentes
5. Gerencie conteúdo na seção CRUD

## 📧 Configuração de Email

### Gmail (Recomendado)
1. Ative a autenticação de 2 fatores
2. Gere uma senha de app em: https://myaccount.google.com/apppasswords
3. Configure no arquivo `php-files/config.php`:
   ```php
   define('SMTP_USER', 'seu-email@gmail.com');
   define('SMTP_PASS', 'sua-senha-de-app');
   ```

## 🚀 Deploy

### 🏭 Produção
1. Configure variáveis de ambiente
2. Use banco de dados dedicado
3. Configure SSL/HTTPS
4. Altere senhas padrão
5. Configure domínio próprio

### 🐳 Docker (Opcional)
```bash
# Em desenvolvimento
docker-compose up -d
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@aurahub.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/aura-hub/issues)
- 📖 Wiki: [Documentação Completa](https://github.com/seu-usuario/aura-hub/wiki)

## 🙏 Agradecimentos

- [Shadcn/ui](https://ui.shadcn.com/) pelos componentes
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Vite](https://vitejs.dev/) pela ferramenta de build
- [React](https://reactjs.org/) pela biblioteca frontend

---

⭐ **Gostou do projeto? Deixe uma estrela!** ⭐
