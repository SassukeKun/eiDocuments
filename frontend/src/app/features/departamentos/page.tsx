"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import { useNotification } from "@/hooks/useNotification";
import { DepartamentosService } from "@/lib/services/departamentosService";
import { Departamento } from "@/types";

const DepartamentosPage = () => {
  const { success, error } = useNotification();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState<Departamento | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    descricao: "",
    ativo: true
  });

  // Carregar departamentos
  const carregarDepartamentos = async () => {
    try {
      setLoading(true);
      const params: { q?: string } = {};
      if (searchTerm) params.q = searchTerm;
      
      const response = await DepartamentosService.listar(params);
      setDepartamentos(response.data);
    } catch {
      error("Erro ao carregar departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDepartamentos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarDepartamentos();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const limparFormulario = () => {
    setFormData({ nome: "", codigo: "", descricao: "", ativo: true });
    setEditingDepartamento(null);
    setShowForm(false);
  };

  const abrirEdicao = (departamento: Departamento) => {
    setEditingDepartamento(departamento);
    setFormData({
      nome: departamento.nome,
      codigo: departamento.codigo,
      descricao: departamento.descricao || "",
      ativo: departamento.ativo
    });
    setShowForm(true);
  };

  const salvarDepartamento = async () => {
    try {
      if (!formData.nome || !formData.codigo) {
        error("Nome e código são obrigatórios");
        return;
      }

      if (editingDepartamento) {
        await DepartamentosService.atualizar(editingDepartamento._id, formData);
        success("Departamento atualizado com sucesso!");
      } else {
        await DepartamentosService.criar(formData);
        success("Departamento criado com sucesso!");
      }

      limparFormulario();
      carregarDepartamentos();
    } catch {
      error("Erro ao salvar departamento");
    }
  };

  const removerDepartamento = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este departamento?")) return;

    try {
      // Desabilitar o botão durante a operação
      setLoading(true);
      
      await DepartamentosService.remover(id);
      success("Departamento removido com sucesso!");
      
      // Remover da lista local imediatamente
      setDepartamentos(prev => prev.filter(dept => dept._id !== id));
    } catch (err) {
      error("Erro ao remover departamento");
      console.error("Erro ao remover:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departamentos</h1>
          <p className="text-gray-600">Gerencie os departamentos da empresa</p>
        </div>
        <ModernButton onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Departamento
        </ModernButton>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <ModernInput
          placeholder="Buscar por nome ou código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            {editingDepartamento ? "Editar Departamento" : "Novo Departamento"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <ModernInput
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome do departamento"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <ModernInput
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                placeholder="Código (ex: RH, TI)"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descrição do departamento"
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
                Departamento ativo
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <ModernButton onClick={limparFormulario} variant="outline">
              Cancelar
            </ModernButton>
            <ModernButton onClick={salvarDepartamento} className="bg-blue-600 hover:bg-blue-700">
              {editingDepartamento ? "Atualizar" : "Criar"}
            </ModernButton>
          </div>
        </div>
      )}

      {/* Lista de Departamentos */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando departamentos...</p>
          </div>
        ) : departamentos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Nenhum departamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
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
                {departamentos.map((departamento) => (
                  <tr key={departamento._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {departamento.nome}
                        </div>
                        {departamento.descricao && (
                          <div className="text-sm text-gray-500">
                            {departamento.descricao}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {departamento.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {departamento.ativo ? (
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
                          onClick={() => abrirEdicao(departamento)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </ModernButton>
                        <ModernButton
                          onClick={() => removerDepartamento(departamento._id)}
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

export default DepartamentosPage;
