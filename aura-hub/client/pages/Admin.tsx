import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Database,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../services/api";
import type { User } from "@shared/types";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("usuarios"); // "usuarios" | "crud"
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Carregar usuários ao montar o componente
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setIsLoading(true);
      setMessage(""); // Limpar mensagens anteriores
      
      const response = await usuarioService.listar();

      if (response.data.success && response.data.data) {
        const usuariosReais = response.data.data;
        setUsers(usuariosReais);
        
        if (usuariosReais.length === 0) {
          setMessage("ℹ️ Nenhum usuário foi encontrado. Aguardando novas solicitações de acesso.");
        } else {
          setMessage(`✅ ${usuariosReais.length} usuário(s) carregado(s) do banco de dados.`);
          
          // Limpar mensagem de sucesso após 3 segundos
          setTimeout(() => setMessage(""), 3000);
        }
      } else {
        // Se não conseguir conectar ou não houver dados reais
        setUsers([]);
        setMessage(
          "⚠️ Não foi possível carregar os usuários do banco de dados. Verifique se o XAMPP está rodando e se o arquivo usuarios.php existe."
        );
      }
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
      
      if (error.response?.status === 503) {
        setMessage(
          "🔌 Servidor PHP não está rodando. Verifique se o XAMPP está iniciado."
        );
      } else if (error.code === 'ECONNREFUSED') {
        setMessage(
          "🔌 Não foi possível conectar ao servidor. Verifique se o XAMPP está rodando."
        );
      } else {
        setMessage(
          "⚠️ Erro ao conectar com o servidor. Verifique sua conexão e se o backend está funcionando."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    userId: number,
    newStatus: "liberado" | "bloqueado",
  ) => {
    try {
      // Find the user before updating
      const user = users.find((u) => u.id === userId);
      if (!user) {
        setMessage("Usuário não encontrado.");
        return;
      }

      // Call API to update user status
      if (newStatus === "liberado") {
        await usuarioService.aprovar(userId);
      } else {
        await usuarioService.rejeitar(userId);
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u,
        ),
      );

      // Show success message
      const acao = newStatus === "liberado" ? "liberado" : "bloqueado";
      setMessage(
        `✅ Usuário ${user.nomeCompleto} foi ${acao} com sucesso! Email de notificação enviado automaticamente.`,
      );

      // Clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);

      console.log(`Email enviado para ${user.email}:`, {
        assunto:
          newStatus === "liberado" ? "Acesso Liberado" : "Acesso Bloqueado",
        usuario: user.nomeCompleto,
        status: newStatus,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);

      if (error.response?.status === 404) {
        setMessage("Usuário não encontrado no servidor.");
      } else if (error.response?.status === 500) {
        setMessage("Erro interno do servidor. Contate o administrador.");
      } else {
        setMessage(
          "⚠️ Erro ao conectar com o servidor. Status atualizado localmente apenas.",
        );

        // Update local state even if API fails (for demo purposes)
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, status: newStatus } : u,
          ),
        );
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "liberado":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Liberado
          </Badge>
        );
      case "bloqueado":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Bloqueado
          </Badge>
        );
      default:
        return null;
    }
  };

  const pendingUsers = users.filter((user) => user.status === "pendente");
  const approvedUsers = users.filter((user) => user.status === "liberado");
  const blockedUsers = users.filter((user) => user.status === "bloqueado");

  const renderContent = () => {
    if (activeView === "crud") {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                CRUD - Em Desenvolvimento
              </CardTitle>
              <p className="text-gray-600">
                Funcionalidades CRUD serão implementadas aqui
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Página XPTO
                </h3>
                <p className="text-gray-600 mb-4">
                  Funcionalidades de Create, Read, Update e Delete
                </p>
                <Button
                  onClick={() => navigate("/xpto")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Ir para XPTO
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                Solicitações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {pendingUsers.length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Usuários Liberados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {approvedUsers.length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Com acesso ativo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                Usuários Bloqueados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {blockedUsers.length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Acesso negado</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Message */}
        {message && (
          <Alert className={`${
            message.includes('✅') ? 'border-green-200 bg-green-50' :
            message.includes('ℹ️') ? 'border-blue-200 bg-blue-50' :
            'border-yellow-200 bg-yellow-50'
          }`}>
            <CheckCircle className={`h-4 w-4 ${
              message.includes('✅') ? 'text-green-600' :
              message.includes('ℹ️') ? 'text-blue-600' :
              'text-yellow-600'
            }`} />
            <AlertDescription className={`${
              message.includes('✅') ? 'text-green-700' :
              message.includes('ℹ️') ? 'text-blue-700' :
              'text-yellow-700'
            }`}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Para que usuários apareçam aqui, eles precisam se cadastrar através da página de registro.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold text-gray-900 mb-2">Como ativar o sistema:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. ✅ Certifique-se que o XAMPP está rodando</li>
                  <li>2. ✅ Execute o arquivo <code>criar_tabela_usuarios.sql</code> no MySQL</li>
                  <li>3. ✅ Verifique se os arquivos PHP estão na pasta correta</li>
                  <li>4. 👥 Usuários devem se cadastrar em <strong>/signup</strong></li>
                  <li>5. 📋 As solicitações aparecerão aqui para aprovação</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        {users.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Liberar / Bloquear Usuários
              </CardTitle>
              <p className="text-gray-600">
                Visualize e gerencie todas as solicitações de acesso do banco de dados
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Nome Completo</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[100px]">Login</TableHead>
                        <TableHead className="min-w-[150px] hidden md:table-cell">Endereço</TableHead>
                        <TableHead className="min-w-[120px] hidden lg:table-cell">Data Solicitação</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[200px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="max-w-[150px] truncate">
                              {user.nomeCompleto}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>{user.login}</TableCell>
                          <TableCell className="max-w-[150px] truncate hidden md:table-cell">
                            {user.endereco}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{user.dataSolicitacao}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              {user.status !== "liberado" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(user.id, "liberado")
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                >
                                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  <span className="hidden sm:inline">Liberar</span>
                                  <span className="sm:hidden">✓</span>
                                </Button>
                              )}
                              {user.status !== "bloqueado" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleStatusChange(user.id, "bloqueado")
                                  }
                                  className="text-xs"
                                >
                                  <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  <span className="hidden sm:inline">Bloquear</span>
                                  <span className="sm:hidden">✕</span>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  window.location.href = `mailto:${user.email}`;
                                }}
                                className="text-xs"
                              >
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">Email</span>
                                <span className="sm:hidden">@</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-16"} ${sidebarOpen ? 'block' : 'hidden md:block'} bg-white shadow-lg border-r transition-all duration-300 flex flex-col absolute md:relative z-10 h-full`}
      >
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Admin Panel</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4">
          <div className="space-y-2">
            <Button
              variant={activeView === "usuarios" ? "default" : "ghost"}
              className={`w-full justify-start text-sm ${!sidebarOpen && "px-2"}`}
              onClick={() => setActiveView("usuarios")}
            >
              <Users className="w-4 h-4 mr-2" />
              {sidebarOpen && "Liberar / Bloquear"}
            </Button>

            <Button
              variant={activeView === "crud" ? "default" : "ghost"}
              className={`w-full justify-start text-sm ${!sidebarOpen && "px-2"}`}
              onClick={() => setActiveView("crud")}
            >
              <Database className="w-4 h-4 mr-2" />
              {sidebarOpen && "CRUD"}
            </Button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className={`w-full justify-start text-sm ${!sidebarOpen && "px-2"}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {sidebarOpen && "Voltar"}
          </Button>
        </div>
      </div>

      {/* Overlay para mobile quando sidebar aberto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                {activeView === "usuarios"
                  ? "Gerenciar Usuários"
                  : "CRUD Management"}
              </h1>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                {users.length} usuários total
              </span>
              <span className="text-xs text-gray-600 sm:hidden">
                {users.length}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 py-4 sm:py-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
