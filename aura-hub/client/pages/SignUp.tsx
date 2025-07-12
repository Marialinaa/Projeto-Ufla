import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  MapPin,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import type { RegistrationData } from "@shared/types";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    endereco: "",
    email: "",
    login: "",
    senha: "",
    confirmarSenha: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para limpar campos
  const limparCampos = () => {
    setFormData({
      nomeCompleto: "",
      endereco: "",
      email: "",
      login: "",
      senha: "",
      confirmarSenha: "",
    });
  };

  const handleCancel = () => {
    limparCampos();
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.senha !== formData.confirmarSenha) {
      setMessage("As senhas não conferem.");
      setIsLoading(false);
      return;
    }

    try {
      // Preparar dados para envio ao backend
      const dadosRegistro: RegistrationData = {
        nome: formData.nomeCompleto,
        endereco: formData.endereco,
        email: formData.email,
        login: formData.login,
        senha: formData.senha,
        enviarEmailAdmin: true, // Flag para indicar que deve enviar email ao admin
      };

      console.log("Enviando solicitação de acesso:", dadosRegistro);

      // Enviar dados usando o serviço de API
      const response = await authService.register(dadosRegistro);

      console.log("Resposta do servidor:", response.data);

      // Backend retorna status 201 para sucesso, não campo 'success'
      if (response.status === 201) {
        const statusMsg =
          response.data.status || "Solicitação enviada com sucesso!";
        const avisoMsg = response.data.aviso
          ? `\n⚠️ ${response.data.aviso}`
          : "";

        setMessage(
          `✅ ${statusMsg}${avisoMsg}\n\n📧 O administrador foi notificado por email e analisará sua solicitação em breve.`,
        );
        limparCampos();
      } else {
        setMessage(
          response.data.erro ||
            response.data.message ||
            "Erro ao enviar solicitação. Tente novamente.",
        );
      }
    } catch (error: any) {
      console.error("Erro detalhado:", error);

      // Tratamento específico de erros
      if (error.code === "ECONNABORTED") {
        setMessage(
          "Timeout na conexão. Verifique se o servidor está rodando e tente novamente.",
        );
      } else if (error.response) {
        // Erro retornado pelo servidor
        const status = error.response.status;
        const data = error.response.data;

        // Backend retorna campo 'erro' para mensagens de erro
        const errorMessage = data.erro || data.message || "Erro no servidor";

        switch (status) {
          case 400:
            setMessage(`❌ ${errorMessage}`);
            break;
          case 405:
            setMessage(
              "❌ Método não permitido. Verifique a configuração do servidor.",
            );
            break;
          case 409:
            setMessage(`❌ ${errorMessage} (Dados já existem)`);
            break;
          case 500:
            setMessage(`❌ Erro interno do servidor: ${errorMessage}`);
            break;
          default:
            setMessage(`❌ ${errorMessage} (Status: ${status})`);
        }
      } else if (error.request) {
        // Erro de rede/conexão
        setMessage(
          "⚠️ Erro de conexão com o servidor. Verifique:\n" +
            "• Se o servidor Apache está rodando (http://localhost/Projeto-Ufla/)\n" +
            "• Se o arquivo register.php existe\n" +
            "• Se não há bloqueio de CORS",
        );
      } else {
        setMessage(`Erro inesperado: ${error.message || "Erro desconhecido"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sistema de Usuários
            </span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
              Solicitação de Acesso
            </CardTitle>
            <p className="text-gray-600 mt-2 sm:mt-3 text-base sm:text-lg">
              Preencha seus dados para solicitar acesso ao sistema
            </p>
          </CardHeader>

          <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nomeCompleto"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nome Completo
                    </Label>
                    <Input
                      id="nomeCompleto"
                      name="nomeCompleto"
                      type="text"
                      required
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="endereco"
                      className="text-sm font-medium text-gray-700"
                    >
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Endereço
                    </Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      type="text"
                      required
                      value={formData.endereco}
                      onChange={handleChange}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="Digite seu endereço"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                    placeholder="Digite seu e-mail"
                  />
                </div>
              </div>

              {/* Access Information Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Dados de Acesso
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login"
                      className="text-sm font-medium text-gray-700"
                    >
                      Login
                    </Label>
                    <Input
                      id="login"
                      name="login"
                      type="text"
                      required
                      value={formData.login}
                      onChange={handleChange}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="Escolha um nome de usuário"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="senha"
                        className="text-sm font-medium text-gray-700"
                      >
                        Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="senha"
                          name="senha"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.senha}
                          onChange={handleChange}
                          className="h-12 pr-12"
                          placeholder="Digite sua senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmarSenha"
                        className="text-sm font-medium text-gray-700"
                      >
                        Confirmar Senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmarSenha"
                          name="confirmarSenha"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmarSenha}
                          onChange={handleChange}
                          className="h-12 pr-12"
                          placeholder="Confirme sua senha"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <Alert
                  className={
                    message.includes("Erro") || message.includes("erro")
                      ? "border-red-200 bg-red-50"
                      : "border-green-200 bg-green-50"
                  }
                >
                  <AlertDescription
                    className={
                      message.includes("Erro") || message.includes("erro")
                        ? "text-red-700"
                        : "text-green-700"
                    }
                  >
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 h-14 text-lg"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Solicitar Acesso"}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-6 border-t">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Voltar ao início
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Sua solicitação será analisada pelo administrador. Você receberá
                um email com o resultado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
