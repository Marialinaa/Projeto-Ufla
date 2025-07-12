import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Zap, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema de Usuários
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 px-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bem-vindo
              </span>
              <br />
              <span className="text-gray-900">ao Sistema</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
              Entre na sua conta para acessar o sistema ou cadastre-se para solicitar
              acesso. Uma plataforma moderna e segura para gerenciar
              usuários.
            </p>

            {/* Hero Image */}
            <div className="relative inline-block mb-8 sm:mb-12 px-4">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Sistema de usuários moderno"
                className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-full h-full bg-gradient-to-r from-blue-200 to-indigo-200 rounded-xl sm:rounded-2xl -z-10"></div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto px-4">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg border-2 hover:bg-gray-50 flex items-center justify-center"
              >
                <LogIn className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Entrar
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center justify-center"
              >
                <UserPlus className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Criar Conta
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 sm:mt-20 text-center px-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg max-w-3xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Como funciona?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                    Já tem uma conta?
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Clique em "Entrar" para acessar o sistema com
                    suas credenciais.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 flex-shrink-0" />
                    Novo usuário?
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Clique em "Criar Conta" para se cadastrar e solicitar acesso ao
                    sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-6 sm:py-8 mt-12 sm:mt-16 bg-white border-t">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <div className="flex justify-center space-x-4">
            {/* Footer vazio por enquanto */}
          </div>
        </div>
      </footer>
    </div>
  );
}
