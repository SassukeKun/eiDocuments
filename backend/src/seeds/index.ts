import { connectDatabase, disconnectDatabase } from '../config/database';
import { 
  Departamento, 
  TipoDocumento, 
  CategoriaDocumento, 
  Documento,
  Usuario
} from '../models';

const seedDatabase = async () => {
  try {
    await connectDatabase();
    
    console.log('🌱 Iniciando seed do banco de dados...');

    // Limpar dados existentes
    await Promise.all([
      Documento.deleteMany({}),
      CategoriaDocumento.deleteMany({}),
      TipoDocumento.deleteMany({}),
      Departamento.deleteMany({}),
      Usuario.deleteMany({})
    ]);

    // Criar Usuários
    const usuarios = await Usuario.insertMany([
      {
        nome: 'Administrador',
        email: 'admin@empresa.com',
        senha: 'admin123',
        ativo: true
      },
      {
        nome: 'Gestor RH',
        email: 'rh@empresa.com',
        senha: 'rh123',
        ativo: true
      },
      {
        nome: 'Gestor Financeiro',
        email: 'financeiro@empresa.com',
        senha: 'fin123',
        ativo: true
      },
      {
        nome: 'Gestor Jurídico',
        email: 'juridico@empresa.com',
        senha: 'jur123',
        ativo: true
      },
      {
        nome: 'Gestor TI',
        email: 'ti@empresa.com',
        senha: 'ti123',
        ativo: true
      },
      {
        nome: 'Gestor Comercial',
        email: 'comercial@empresa.com',
        senha: 'com123',
        ativo: true
      }
    ]);

    console.log(`✅ Criados ${usuarios.length} usuários`);

    // Criar Departamentos
    const departamentos = await Departamento.insertMany([
      {
        nome: 'Recursos Humanos',
        codigo: 'RH',
        descricao: 'Departamento responsável pela gestão de pessoal'
      },
      {
        nome: 'Financeiro',
        codigo: 'FIN',
        descricao: 'Departamento responsável pela gestão financeira'
      },
      {
        nome: 'Jurídico',
        codigo: 'JUR',
        descricao: 'Departamento responsável por questões legais'
      },
      {
        nome: 'Tecnologia da Informação',
        codigo: 'TI',
        descricao: 'Departamento responsável pela infraestrutura tecnológica'
      },
      {
        nome: 'Comercial',
        codigo: 'COM',
        descricao: 'Departamento responsável por vendas e relacionamento com clientes'
      }
    ]);

    console.log(`✅ Criados ${departamentos.length} departamentos`);

    // Criar Tipos de Documento
    const tiposDocumento = await TipoDocumento.insertMany([
      {
        nome: 'Carta Recebida',
        codigo: 'CARTA_REC',
        descricao: 'Correspondências recebidas',
        cor: '#3B82F6',
        icone: 'mail'
      },
      {
        nome: 'Carta Enviada',
        codigo: 'CARTA_ENV',
        descricao: 'Correspondências enviadas',
        cor: '#10B981',
        icone: 'mail-send'
      },
      {
        nome: 'Relatório',
        codigo: 'RELATORIO',
        descricao: 'Relatórios e documentos informativos',
        cor: '#8B5CF6',
        icone: 'file-text'
      },
      {
        nome: 'Contrato',
        codigo: 'CONTRATO',
        descricao: 'Contratos e acordos',
        cor: '#F59E0B',
        icone: 'file-signature'
      },
      {
        nome: 'Fatura',
        codigo: 'FATURA',
        descricao: 'Faturas e documentos fiscais',
        cor: '#EF4444',
        icone: 'receipt'
      },
      {
        nome: 'Memorando',
        codigo: 'MEMORANDO',
        descricao: 'Comunicações internas',
        cor: '#6B7280',
        icone: 'file'
      }
    ]);

    console.log(`✅ Criados ${tiposDocumento.length} tipos de documento`);

    // Criar Categorias de Documento
    const categoriasDocumento = await CategoriaDocumento.insertMany([
      // RH
      {
        nome: 'Documentos de Pessoal',
        codigo: 'PESSOAL',
        descricao: 'Contratos, folhas de ponto, etc.',
        departamento: departamentos[0]._id,
        cor: '#EC4899'
      },
      {
        nome: 'Documentos Legais RH',
        codigo: 'LEGAL_RH',
        descricao: 'Documentos legais relacionados a RH',
        departamento: departamentos[0]._id,
        cor: '#F97316'
      },
      // Financeiro
      {
        nome: 'Documentos Contabilísticos',
        codigo: 'CONTAB',
        descricao: 'Balanços, demonstrações, etc.',
        departamento: departamentos[1]._id,
        cor: '#059669'
      },
      {
        nome: 'Documentos Fiscais',
        codigo: 'FISCAL',
        descricao: 'Faturas, recibos, etc.',
        departamento: departamentos[1]._id,
        cor: '#DC2626'
      },
      // Jurídico
      {
        nome: 'Documentos Legais',
        codigo: 'LEGAL',
        descricao: 'Contratos, processos, etc.',
        departamento: departamentos[2]._id,
        cor: '#7C2D12'
      },
      {
        nome: 'Documentos Regulamentares',
        codigo: 'REGULAM',
        descricao: 'Licenças, autorizações, etc.',
        departamento: departamentos[2]._id,
        cor: '#1D4ED8'
      },
      // TI
      {
        nome: 'Documentos Técnicos',
        codigo: 'TECNICO',
        descricao: 'Especificações, manuais, etc.',
        departamento: departamentos[3]._id,
        cor: '#7C3AED'
      },
      // Comercial
      {
        nome: 'Documentos de Vendas',
        codigo: 'VENDAS',
        descricao: 'Propostas, contratos de venda, etc.',
        departamento: departamentos[4]._id,
        cor: '#0891B2'
      }
    ]);

    console.log(`✅ Criadas ${categoriasDocumento.length} categorias de documento`);

    // Criar alguns documentos de exemplo
    const documentos = await Documento.insertMany([
      {
        titulo: 'Contrato de Trabalho - João Silva',
        descricao: 'Contrato de trabalho do novo funcionário João Silva',
        departamento: departamentos[0]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'CONTRATO')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'PESSOAL')?._id,
        dataCriacao: new Date('2025-01-15'),
        status: 'aprovado',
        arquivo: {
          cloudinaryId: 'docs/contrato_joao_silva_001',
          url: 'https://res.cloudinary.com/empresa/raw/upload/v1234567890/docs/contrato_joao_silva_001.pdf',
          secureUrl: 'https://res.cloudinary.com/empresa/raw/upload/v1234567890/docs/contrato_joao_silva_001.pdf',
          originalName: 'contrato_joao_silva.pdf',
          format: 'pdf',
          size: 245760,
          uploadedAt: new Date('2025-01-15')
        },
        numeroProtocolo: 'RH/2025/0001',
        assunto: 'Admissão de novo funcionário',
        criadoPor: usuarios[1]._id, // Gestor RH
        tags: ['contrato', 'admissão', 'joão silva'],
        versao: 1
      },
      {
        titulo: 'Fatura Fornecedor ABC Ltda',
        descricao: 'Fatura de materiais de escritório',
        departamento: departamentos[1]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'FATURA')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'FISCAL')?._id,
        dataCriacao: new Date('2025-01-20'),
        dataRecebimento: new Date('2025-01-21'),
        dataVencimento: new Date('2025-02-20'),
        status: 'pendente',
        arquivo: {
          cloudinaryId: 'docs/fatura_abc_ltda_001',
          url: 'https://res.cloudinary.com/empresa/raw/upload/v1234567891/docs/fatura_abc_ltda_001.pdf',
          secureUrl: 'https://res.cloudinary.com/empresa/raw/upload/v1234567891/docs/fatura_abc_ltda_001.pdf',
          originalName: 'fatura_abc_janeiro_2025.pdf',
          format: 'pdf',
          size: 156890,
          uploadedAt: new Date('2025-01-21')
        },
        numeroProtocolo: 'FIN/2025/0001',
        numeroReferencia: 'ABC-2025-001',
        assunto: 'Fornecimento de materiais de escritório',
        remetente: 'ABC Ltda',
        criadoPor: usuarios[2]._id, // Gestor Financeiro
        tags: ['fatura', 'fornecedor', 'materiais'],
        versao: 1
      },
      {
        titulo: 'Proposta Comercial - Empresa XYZ',
        descricao: 'Proposta comercial enviada para cliente XYZ',
        departamento: departamentos[4]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'CARTA_ENV')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'VENDAS')?._id,
        dataCriacao: new Date('2025-01-18'),
        dataEnvio: new Date('2025-01-18'),
        status: 'aprovado',
        arquivo: {
          cloudinaryId: 'docs/proposta_xyz_001',
          url: 'https://res.cloudinary.com/empresa/raw/upload/v1234567892/docs/proposta_xyz_001.pdf',
          secureUrl: 'https://res.cloudinary.com/empresa/raw/upload/v1234567892/docs/proposta_xyz_001.pdf',
          originalName: 'proposta_comercial_xyz.pdf',
          format: 'pdf',
          size: 892456,
          uploadedAt: new Date('2025-01-18')
        },
        numeroProtocolo: 'COM/2025/0001',
        numeroReferencia: 'PROP-XYZ-2025-001',
        assunto: 'Proposta de fornecimento de serviços',
        destinatario: 'Empresa XYZ Lda',
        criadoPor: usuarios[5]._id, // Gestor Comercial
        tags: ['proposta', 'cliente', 'xyz'],
        versao: 1
      },
      {
        titulo: 'Relatório Mensal de Atividades TI',
        descricao: 'Relatório mensal das atividades do departamento de TI',
        departamento: departamentos[3]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'RELATORIO')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'TECNICO')?._id,
        dataCriacao: new Date('2025-01-31'),
        status: 'rascunho',
        arquivo: {
          cloudinaryId: 'docs/relatorio_ti_jan_2025',
          url: 'https://res.cloudinary.com/empresa/raw/upload/v1234567893/docs/relatorio_ti_jan_2025.docx',
          secureUrl: 'https://res.cloudinary.com/empresa/raw/upload/v1234567893/docs/relatorio_ti_jan_2025.docx',
          originalName: 'relatorio_atividades_ti_janeiro_2025.docx',
          format: 'docx',
          size: 445670,
          uploadedAt: new Date('2025-01-31')
        },
        numeroProtocolo: 'TI/2025/0001',
        assunto: 'Relatório mensal de atividades e projetos',
        criadoPor: usuarios[4]._id, // Gestor TI
        tags: ['relatório', 'atividades', 'mensal', 'ti'],
        versao: 1
      },
      {
        titulo: 'Memorando - Alteração de Horário',
        descricao: 'Memorando interno sobre alteração de horário de funcionamento',
        departamento: departamentos[0]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'MEMORANDO')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'PESSOAL')?._id,
        dataCriacao: new Date('2025-01-25'),
        status: 'aprovado',
        arquivo: {
          cloudinaryId: 'docs/memorando_horario_001',
          url: 'https://res.cloudinary.com/empresa/raw/upload/v1234567894/docs/memorando_horario_001.pdf',
          secureUrl: 'https://res.cloudinary.com/empresa/raw/upload/v1234567894/docs/memorando_horario_001.pdf',
          originalName: 'memorando_alteracao_horario.pdf',
          format: 'pdf',
          size: 123450,
          uploadedAt: new Date('2025-01-25')
        },
        numeroProtocolo: 'RH/2025/0002',
        assunto: 'Alteração de horário de funcionamento',
        criadoPor: usuarios[1]._id, // Gestor RH
        atualizadoPor: usuarios[0]._id, // Aprovado pelo Admin
        tags: ['memorando', 'horário', 'funcionamento'],
        versao: 2
      }
    ]);

    console.log(`✅ Criados ${documentos.length} documentos de exemplo`);

    console.log('🎉 Seed concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await disconnectDatabase();
  }
};

// Executar seed se o arquivo for chamado diretamente
if (import.meta.main) {
  seedDatabase();
}

export default seedDatabase;
