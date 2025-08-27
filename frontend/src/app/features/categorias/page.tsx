"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle, Palette, Tag } from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernInput from "@/components/ui/ModernInput";
import { useNotification } from "@/hooks/useNotification";
import { CategoriasService } from "@/lib/services/categoriasService";
import { DepartamentosService } from "@/lib/services/departamentosService";
import { CategoriaDocumento, Departamento } from "@/types";

const CategoriasPage = () => {
  const { success, error } = useNotification();
  const [categorias, setCategorias] = useState<CategoriaDocumento[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("all");
  const [filterAtivo, setFilterAtivo] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaDocumento | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    descricao: "",
    departamento: "",
    cor: "#3B82F6",
    icone: "tag",
    ativo: true
  });

  // Carregar departamentos para o select
  const carregarDepartamentos = async () => {
    try {
      console.log("Carregando departamentos...");
      const response = await DepartamentosService.listar({ ativo: true });
      console.log("Departamentos carregados:", response.data);
      setDepartamentos(response.data);
    } catch (err) {
      console.error("Erro ao carregar departamentos:", err);
      error("Erro ao carregar departamentos");
    }
  };

  // Carregar categorias
  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | boolean> = {};
      
      if (searchTerm) params.q = searchTerm;
      if (selectedDepartamento !== "all") params.departamento = selectedDepartamento;
      if (filterAtivo !== "all") params.ativo = filterAtivo === "true";
      
      const response = await CategoriasService.listar(params);
      setCategorias(response.data);
    } catch (err) {
      error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    carregarDepartamentos();
    carregarCategorias();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Aplicar filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarCategorias();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedDepartamento, filterAtivo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Limpar formulário
  const limparFormulario = () => {
    console.log("Limpando formulário, editingCategoria antes:", editingCategoria);
    setFormData({
      nome: "",
      codigo: "",
      descricao: "",
      departamento: "",
      cor: "#3B82F6",
      icone: "tag",
      ativo: true
    });
    setEditingCategoria(null);
    setShowForm(false);
    console.log("Formulário limpo, editingCategoria depois: null");
  };

  // Abrir formulário para edição
  const abrirEdicao = (categoria: CategoriaDocumento) => {
    console.log("Abrindo edição para categoria:", categoria._id);
    console.log("Departamento da categoria:", categoria.departamento);
    
    // Verificar se departamento é objeto ou string
    const departamentoId = typeof categoria.departamento === 'object' && categoria.departamento !== null
      ? (categoria.departamento as { _id: string })._id 
      : categoria.departamento;
    
    console.log("Departamento ID extraído:", departamentoId);
    
    setEditingCategoria(categoria);
    setFormData({
      nome: categoria.nome,
      codigo: categoria.codigo,
      descricao: categoria.descricao || "",
      departamento: departamentoId,
      cor: categoria.cor || "#3B82F6",
      icone: categoria.icone || "tag",
      ativo: categoria.ativo
    });
    setShowForm(true);
  };

  // Salvar categoria
  const salvarCategoria = async () => {
    try {
      console.log("Salvando categoria:", { formData, editingCategoria });
      
      if (!formData.nome || !formData.codigo || !formData.departamento) {
        error("Nome, código e departamento são obrigatórios");
        return;
      }

      // Verificar se código já existe no departamento
      const codigoExiste = await CategoriasService.verificarCodigoExistente(
        formData.codigo, 
        formData.departamento,
        editingCategoria?._id
      );
      
      if (codigoExiste) {
        error("Código já existe neste departamento. Escolha outro código.");
        return;
      }

      if (editingCategoria) {
        console.log("Atualizando categoria:", editingCategoria._id);
        await CategoriasService.atualizar(editingCategoria._id, formData);
        success("Categoria atualizada com sucesso!");
      } else {
        console.log("Criando nova categoria");
        await CategoriasService.criar(formData);
        success("Categoria criada com sucesso!");
      }

      limparFormulario();
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      error("Erro ao salvar categoria");
    }
  };

  // Remover categoria
  const removerCategoria = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta categoria?")) return;

    try {
      setLoading(true);
      await CategoriasService.remover(id);
      success("Categoria removida com sucesso!");
      
      // Remover da lista local imediatamente
      setCategorias(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      error("Erro ao remover categoria");
    } finally {
      setLoading(false);
    }
  };

  // Obter nome do departamento
  const getDepartamentoNome = (departamento: string | { _id: string; nome: string }) => {
    // Se departamento é um objeto, usar o nome diretamente
    if (typeof departamento === 'object' && departamento !== null) {
      return departamento.nome;
    }
    
    // Se é uma string (ID), buscar no array de departamentos
    const dept = departamentos.find(d => d._id === departamento);
    return dept ? dept.nome : "Departamento não encontrado";
  };

  // Cores predefinidas para o seletor
  const coresPredefinidas = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">Gerencie as categorias de documentos por departamento</p>
        </div>
        <ModernButton onClick={() => {
          console.log("Clicando em Nova Categoria, editingCategoria atual:", editingCategoria);
          setEditingCategoria(null);
          setShowForm(true);
        }} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </ModernButton>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModernInput
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          
          <select
            value={selectedDepartamento}
            onChange={(e) => setSelectedDepartamento(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos os departamentos</option>
            {departamentos.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.nome}
              </option>
            ))}
          </select>
          
          <select
            value={filterAtivo}
            onChange={(e) => setFilterAtivo(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos os status</option>
            <option value="true">Ativas</option>
            <option value="false">Inativas</option>
          </select>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategoria ? "Editar Categoria" : "Nova Categoria"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <ModernInput
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome da categoria"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <ModernInput
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                placeholder="Código (ex: ADM, INF)"
                icon={<Tag className="w-4 h-4" />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
              <select
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Selecione um departamento</option>
                {departamentos.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.cor}
                  onChange={(e) => setFormData({...formData, cor: e.target.value})}
                  className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <div className="flex space-x-1">
                  {coresPredefinidas.map((cor) => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => setFormData({...formData, cor})}
                      className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400"
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Descrição da categoria"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="ativo" className="ml-2 text-sm text-gray-700">
                Categoria ativa
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <ModernButton onClick={limparFormulario} variant="outline">
              Cancelar
            </ModernButton>
            <ModernButton onClick={salvarCategoria} className="bg-purple-600 hover:bg-purple-700">
              {editingCategoria ? "Atualizar" : "Criar"}
            </ModernButton>
          </div>
        </div>
      )}

      {/* Lista de Categorias */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando categorias...</p>
          </div>
        ) : categorias.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Nenhuma categoria encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
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
                {categorias.map((categoria) => (
                  <tr key={categoria._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoria.cor || "#3B82F6" }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {categoria.nome}
                          </div>
                          {categoria.descricao && (
                            <div className="text-sm text-gray-500">
                              {categoria.descricao}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {categoria.codigo}
                      </span>
                    </td>
                                                              <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getDepartamentoNome(categoria.departamento)}
                        </span>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {categoria.ativo ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          Inativa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <ModernButton
                          onClick={() => abrirEdicao(categoria)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </ModernButton>
                        <ModernButton
                          onClick={() => removerCategoria(categoria._id)}
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

export default CategoriasPage;
