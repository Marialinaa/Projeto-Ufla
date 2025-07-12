<?php
// config.example.php - Arquivo de exemplo de configuração
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configurações do banco de dados
$host = 'localhost';
$usuario = 'root';
$senha = 'SUA_SENHA_MYSQL_AQUI';  // Altere para sua senha do MySQL
$banco = 'projeto_ufla';

define('DB_HOST', $host);
define('DB_NAME', $banco);
define('DB_USER', $usuario);
define('DB_PASS', $senha);

// Configurações de email
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'SEU_EMAIL@gmail.com');  // Altere para seu email
define('SMTP_PASS', 'SUA_SENHA_APP_GMAIL');  // Altere para sua senha de app do Gmail
define('ADMIN_EMAIL', 'SEU_EMAIL@gmail.com'); // Altere para seu email

// Configurações de upload
define('UPLOAD_DIR', 'uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024);

// Conectar ao banco
function conectarBanco() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erro de conexão com o banco de dados'
        ]);
        exit;
    }
}

// Função para enviar resposta JSON
function enviarResposta($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
}

// Função para validar email
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Função para gerar hash da senha
function gerarHashSenha($senha) {
    return password_hash($senha, PASSWORD_DEFAULT);
}

// Função para verificar senha
function verificarSenha($senha, $hash) {
    return password_verify($senha, $hash);
}
?>
