import { connectDatabase, disconnectDatabase } from '../config/database';
import { 
  Departamento, 
  TipoDocumento, 
  CategoriaDocumento, 
  Documento,
  StatusDocumento,
  DirecaoDocumento,
  PrioridadeDocumento 
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
      Departamento.deleteMany({})
    ]);

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
        numero: 'RH/2025/0001',
        titulo: 'Contrato de Trabalho - João Silva',
        descricao: 'Contrato de trabalho do novo funcionário João Silva',
        departamento: departamentos[0]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'CONTRATO')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'PESSOAL')?._id,
        dataDocumento: new Date('2025-01-15'),
        status: StatusDocumento.APROVADO,
        direcao: DirecaoDocumento.INTERNO,
        prioridade: PrioridadeDocumento.ALTA,
        usuarioCriador: 'admin',
        usuarioResponsavel: 'rh_manager',
        tags: ['contrato', 'admissão', 'joão silva']
      },
      {
        numero: 'FIN/2025/0001',
        titulo: 'Fatura Fornecedor ABC Ltda',
        descricao: 'Fatura de materiais de escritório',
        departamento: departamentos[1]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'FATURA')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'FISCAL')?._id,
        dataDocumento: new Date('2025-01-20'),
        dataRecebimento: new Date('2025-01-21'),
        dataVencimento: new Date('2025-02-20'),
        status: StatusDocumento.PENDENTE,
        direcao: DirecaoDocumento.RECEBIDO,
        prioridade: PrioridadeDocumento.MEDIA,
        remetente: 'ABC Ltda',
        enderecoRemetente: 'Rua das Empresas, 123 - Lisboa',
        usuarioCriador: 'admin',
        usuarioResponsavel: 'fin_manager',
        tags: ['fatura', 'fornecedor', 'materiais']
      },
      {
        numero: 'COM/2025/0001',
        titulo: 'Carta Enviada - Proposta Comercial XYZ',
        descricao: 'Proposta comercial enviada para cliente XYZ',
        departamento: departamentos[4]._id,
        tipoDocumento: tiposDocumento.find(t => t.codigo === 'CARTA_ENV')?._id,
        categoriaDocumento: categoriasDocumento.find(c => c.codigo === 'VENDAS')?._id,
        dataDocumento: new Date('2025-01-18'),
        dataEnvio: new Date('2025-01-18'),
        status: StatusDocumento.APROVADO,
        direcao: DirecaoDocumento.ENVIADO,
        prioridade: PrioridadeDocumento.ALTA,
        destinatario: 'Empresa XYZ Lda',
        enderecoDestinatario: 'Avenida Central, 456 - Porto',
        usuarioCriador: 'admin',
        usuarioResponsavel: 'com_manager',
        tags: ['proposta', 'cliente', 'xyz'],
        confidencial: true
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
