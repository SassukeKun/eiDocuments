// Service para upload de documentos com criação automática de categorias e tipos
import { apiPost, apiGet, ApiResponse } from '@/lib/api';
import { DocumentosService, DocumentoCreateData } from './documentosService';

interface CategoriaRequest {
  nome: string;
  codigo: string;
  descricao: string;
  departamento: string;
}

interface TipoRequest {
  nome: string;
  codigo: string;
  descricao: string;
}

export class UploadService {
  // Função para remover acentos e caracteres especiais
  private static normalizeString(str: string): string {
    return str
      .normalize('NFD') // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remover marcas diacríticas (acentos)
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '') // Remove caracteres especiais exceto espaços
      .replace(/\s+/g, '_') // Substitui espaços por underscore
      .substring(0, 20);
  }
  // Buscar ou criar categoria
  static async buscarOuCriarCategoria(nome: string, departamentoId: string): Promise<string> {
    console.log('🔍 Buscando/criando categoria:', nome, 'para departamento:', departamentoId);
    
    try {
      // Primeiro tentar buscar categoria existente
      const response = await apiGet<{ success: boolean; data: any[] }>('/categorias', { 
        q: nome, 
        departamento: departamentoId 
      });
      
      console.log('📋 Categorias encontradas:', response.data);
      
      // Se encontrou categoria com nome similar, usar a primeira
      if (response.data && response.data.length > 0) {
        const categoria = response.data.find(cat => 
          cat.nome.toLowerCase() === nome.toLowerCase()
        );
        if (categoria) {
          console.log('✅ Categoria existente encontrada:', categoria._id);
          return categoria._id;
        }
      }
      
      // Se não encontrou, criar nova categoria
      console.log('🆕 Criando nova categoria:', nome);
      const codigo = this.normalizeString(nome);
      
      // Garantir que o código não esteja vazio após limpeza
      if (!codigo || codigo.length === 0) {
        throw new Error(`Nome de categoria "${nome}" não pode ser convertido em código válido`);
      }
      
      const categoriaData: CategoriaRequest = {
        nome: nome,
        codigo: codigo,
        descricao: `Categoria: ${nome}`,
        departamento: departamentoId
      };
      
      console.log('📝 Dados da categoria que serão enviados:', categoriaData);
      console.log('🔍 Código gerado:', codigo, '(length:', codigo.length, ')');
      
      const newCategoria = await apiPost<ApiResponse<any>>('/categorias', categoriaData);
      console.log('✅ Nova categoria criada:', newCategoria.data._id);
      return newCategoria.data._id;
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar/criar categoria:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      throw new Error(`Erro ao processar categoria "${nome}": ${errorMessage}`);
    }
  }

  // Buscar ou criar tipo
  static async buscarOuCriarTipo(nome: string): Promise<string> {
    console.log('🔍 Buscando/criando tipo:', nome);
    
    try {
      // Primeiro tentar buscar tipo existente
      const response = await apiGet<{ success: boolean; data: any[] }>('/tipos', { q: nome });
      
      console.log('📋 Tipos encontrados:', response.data);
      
      // Se encontrou tipo com nome similar, usar o primeiro
      if (response.data && response.data.length > 0) {
        const tipo = response.data.find(tip => 
          tip.nome.toLowerCase() === nome.toLowerCase()
        );
        if (tipo) {
          console.log('✅ Tipo existente encontrado:', tipo._id);
          return tipo._id;
        }
      }
      
      // Se não encontrou, criar novo tipo
      console.log('🆕 Criando novo tipo:', nome);
      const codigo = this.normalizeString(nome);
      
      // Garantir que o código não esteja vazio após limpeza
      if (!codigo || codigo.length === 0) {
        throw new Error(`Nome de tipo "${nome}" não pode ser convertido em código válido`);
      }
      
      const tipoData: TipoRequest = {
        nome: nome,
        codigo: codigo,
        descricao: `Tipo: ${nome}`
      };
      
      const newTipo = await apiPost<ApiResponse<any>>('/tipos', tipoData);
      console.log('✅ Novo tipo criado:', newTipo.data._id);
      return newTipo.data._id;
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar/criar tipo:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      throw new Error(`Erro ao processar tipo "${nome}": ${errorMessage}`);
    }
  }

  // Upload completo com criação automática de categoria e tipo
  static async uploadDocumento(data: {
    titulo: string;
    descricao?: string;
    categoriaNome: string;
    tipoNome: string;
    departamento: string;
    usuario: string;
    tipoMovimento: 'enviado' | 'recebido' | 'interno';
    remetente?: string;
    destinatario?: string;
    responsavel?: string;
    dataEnvio?: string;
    dataRecebimento?: string;
    tags?: string[];
    arquivo: File;
  }): Promise<any> {
    console.log('🚀 Iniciando upload completo:', data);
    
    try {
      // 1. Buscar ou criar categoria
      const categoriaId = await this.buscarOuCriarCategoria(data.categoriaNome, data.departamento);
      
      // 2. Buscar ou criar tipo
      const tipoId = await this.buscarOuCriarTipo(data.tipoNome);
      
      // 3. Criar documento com IDs obtidos
      const documentoData: DocumentoCreateData = {
        titulo: data.titulo,
        descricao: data.descricao,
        categoria: categoriaId,
        tipo: tipoId,
        departamento: data.departamento,
        usuario: data.usuario,
        tipoMovimento: data.tipoMovimento,
        remetente: data.remetente,
        destinatario: data.destinatario,
        responsavel: data.responsavel,
        dataEnvio: data.dataEnvio,
        dataRecebimento: data.dataRecebimento,
        tags: data.tags,
        arquivo: data.arquivo
      };
      
      console.log('📄 Criando documento com dados:', documentoData);
      console.log('👤 Responsável recebido:', data.responsavel);
      console.log('👤 Usuário recebido:', data.usuario);
      console.log('📋 Tipo de movimento:', data.tipoMovimento);
      console.log('🔍 Verificando campos obrigatórios:');
      console.log('- titulo:', documentoData.titulo);
      console.log('- categoria ID:', documentoData.categoria);
      console.log('- tipo ID:', documentoData.tipo);
      console.log('- departamento ID:', documentoData.departamento);
      console.log('- usuario ID:', documentoData.usuario);
      console.log('- responsavel:', documentoData.responsavel);
      console.log('- tipoMovimento:', documentoData.tipoMovimento);
      console.log('- arquivo:', documentoData.arquivo ? 'presente' : 'ausente');
      
      const documento = await DocumentosService.criar(documentoData);
      
      console.log('✅ Documento criado com sucesso:', documento);
      return documento;
      
    } catch (error) {
      console.error('❌ Erro no upload completo:', error);
      throw error;
    }
  }
}
