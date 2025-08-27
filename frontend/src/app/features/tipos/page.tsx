"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle, FileText, Code } from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import { useNotification } from "@/hooks/useNotification";
import { TiposService } from "@/lib/services/tiposService";
import { TipoDocumento } from "@/types";

const TiposPage = () => {
  const { success, error } = useNotification();
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAtivo, setFilterAtivo] = useState<string>("all");

  const [showForm, setShowForm] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoDocumento | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    descricao: "",
    ativo: true
  });

  // Carregar tipos
  const carregarTipos = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | boolean> = {};
      
      if (searchTerm) params.q = searchTerm;
      if (filterAtivo !== "all") params.ativo = filterAtivo === "true";
      
      
      const response = await TiposService.listar(params);
      setTipos(response.data);
    } catch (err) {
      error("Erro ao carregar tipos");
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    carregarTipos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Aplicar filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarTipos();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterAtivo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Limpar formulário
  const limparFormulario = () => {
    setFormData({
      nome: "",
      codigo: "",
      descricao: "",
      ativo: true
    });
    setEditingTipo(null);
    setShowForm(false);
  };

  // Abrir formulário para edição
  const abrirEdicao = (tipo: TipoDocumento) => {
    setEditingTipo(tipo);
    setFormData({
      nome: tipo.nome,
      codigo: tipo.codigo,
      descricao: tipo.descricao || "",
      ativo: tipo.ativo
    });
    setShowForm(true);
  };

  // Salvar tipo
  const salvarTipo = async () => {
    try {
      // Validações mais robustas
      if (!formData.nome.trim()) {
        error("Nome é obrigatório");
        return;
      }
      
      if (!formData.codigo.trim()) {
        error("Código é obrigatório");
        return;
      }
      
      if (formData.codigo.length < 2) {
        error("Código deve ter pelo menos 2 caracteres");
        return;
      }
      


      // Verificar se código já existe
      const codigoExiste = await TiposService.verificarCodigoExistente(
        formData.codigo.trim().toUpperCase(),
        editingTipo?._id
      );
      
      if (codigoExiste) {
        error("Código já existe. Escolha outro código.");
        return;
      }

      // Preparar dados para envio
      const dadosParaEnviar = {
        nome: formData.nome.trim(),
        codigo: formData.codigo.trim().toUpperCase(),
        descricao: formData.descricao.trim() || undefined,
        ativo: formData.ativo
      };

      if (editingTipo) {
        await TiposService.atualizar(editingTipo._id, dadosParaEnviar);
        success("Tipo atualizado com sucesso!");
      } else {
        await TiposService.criar(dadosParaEnviar);
        success("Tipo criado com sucesso!");
      }

      limparFormulario();
      carregarTipos();
    } catch (err) {
      console.error("Erro detalhado ao salvar tipo:", err);
      error(`Erro ao salvar tipo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  // Remover tipo
  const removerTipo = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este tipo?")) return;

    try {
      setLoading(true);
      await TiposService.remover(id);
      success("Tipo removido com sucesso!");
      
      // Remover da lista local imediatamente
      setTipos(prev => prev.filter(tipo => tipo._id !== id));
    } catch (err) {
      error("Erro ao remover tipo");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tipos de Documentos</h1>
          <p className="text-gray-600">Gerencie os tipos de arquivos aceitos pelo sistema</p>
        </div>
        <ModernButton onClick={() => {
          setEditingTipo(null);
          setShowForm(true);
        }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Tipo
        </ModernButton>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModernInput
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          

          
          <select
            value={filterAtivo}
            onChange={(e) => setFilterAtivo(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            {editingTipo ? "Editar Tipo" : "Novo Tipo"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <ModernInput
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome do tipo (ex: Documento PDF)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <ModernInput
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                placeholder="Código (ex: PDF, DOC)"
                icon={<Code className="w-4 h-4" />}
              />
            </div>
            

            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descrição do tipo de documento"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="ativo" className="ml-2 text-sm text-gray-700">
                Tipo ativo
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <ModernButton onClick={limparFormulario} variant="outline">
              Cancelar
            </ModernButton>
            <ModernButton onClick={salvarTipo} className="bg-blue-600 hover:bg-blue-700">
              {editingTipo ? "Atualizar" : "Criar"}
            </ModernButton>
          </div>
        </div>
      )}

      {/* Lista de Tipos */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando tipos...</p>
          </div>
        ) : tipos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Nenhum tipo encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tipos.map((tipo) => (
                  <tr key={tipo._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {tipo.nome}
                        </div>
                        {tipo.descricao && (
                          <div className="text-sm text-gray-500">
                            {tipo.descricao}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tipo.codigo}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tipo.ativo ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <ModernButton
                          onClick={() => abrirEdicao(tipo)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </ModernButton>
                        <ModernButton
                          onClick={() => removerTipo(tipo._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </ModernButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiposPage;
