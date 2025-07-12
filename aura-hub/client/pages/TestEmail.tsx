import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const TestEmail: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const testEmailFunctionality = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const testData = {
        nome: "Teste Email",
        endereco: "Rua Teste, 123",
        email: "teste@email.com",
        login: "teste_" + Date.now(),
        senha: "senha123",
        enviarEmailAdmin: true,
      };

      console.log("🧪 Testando funcionalidade de email...");
      const response = await authService.register(testData);

      if (response.status === 201) {
        setMessage(
          `✅ Teste realizado com sucesso!\n\n` +
            `Status: ${response.data.status}\n` +
            `${response.data.aviso ? `Aviso: ${response.data.aviso}` : ""}\n\n` +
            `📧 Verifique se o email foi enviado para: mariaxxlina@gmail.com`,
        );
      }
    } catch (error: any) {
      console.error("Erro no teste:", error);

      if (error.response) {
        const errorMsg =
          error.response.data.erro || error.response.data.message;
        setMessage(`❌ Erro no teste: ${errorMsg}`);
      } else if (error.request) {
        setMessage(
          `❌ Erro de conexão com o servidor.\n\n` +
            `Verifique se:\n` +
            `• XAMPP está rodando\n` +
            `• Apache está ativo\n` +
            `• URL: http://localhost/Projeto-Ufla/register.php está acessível`,
        );
      } else {
        setMessage(`❌ Erro inesperado: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <Mail className="w-6 h-6 mr-2 text-blue-600" />
              Teste de Email
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Teste a funcionalidade de envio de email para o administrador
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Configuração Detectada:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Backend: http://localhost/Projeto-Ufla/</li>
                <li>✅ Email Admin: mariaxxlina@gmail.com</li>
                <li>✅ SMTP: smtp.gmail.com:587</li>
                <li>✅ PHPMailer configurado</li>
              </ul>
            </div>

            {message && (
              <Alert
                className={
                  message.includes("✅")
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                {message.includes("✅") ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription
                  className={
                    message.includes("✅") ? "text-green-700" : "text-red-700"
                  }
                  style={{ whiteSpace: "pre-line" }}
                >
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-4">
              <Button
                onClick={testEmailFunctionality}
                disabled={isLoading}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? "Testando..." : "🧪 Testar Email para Admin"}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full h-12"
              >
                Voltar ao Início
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="w-full h-12"
              >
                Ir para Admin Panel
              </Button>
            </div>

            <div className="text-center pt-4 border-t text-sm text-gray-600">
              <p>
                <strong>Como funciona:</strong>
              </p>
              <p>
                1. Clique em "Testar Email" para simular um registro
                <br />
                2. O sistema enviará um email para mariaxxlina@gmail.com
                <br />
                3. Verifique sua caixa de entrada (e spam)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestEmail;
