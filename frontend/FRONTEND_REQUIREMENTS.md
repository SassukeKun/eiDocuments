# 📋 Requisitos do Frontend - EiDocs

## 🎯 **Resumo Executivo**
Frontend Next.js 15 + React 19 + TypeScript **100% funcional** aguardando integração com backend.

---

## 📊 **Modelos de Dados Esperados**

### **Departamento**
```typescript
interface Departamento {
  _id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

### **Categoria (por Departamento)**
```typescript
interface CategoriaDocumento {
  _id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  departamento: string; // ID do departamento
  cor?: string;         // Código hexadecimal (#RRGGBB)
  icone?: string;       // Nome do ícone
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

### **Tipo de Documento**
```typescript
interface TipoDocumento {
  _id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

### **Documento**
```typescript
interface Documento {
  _id: string;
  titulo: string;
  descricao?: string;
  categoria: string;     // ID da categoria
  tipo: string;          // ID do tipo
  departamento: string;  // ID do departamento
  usuario: string;       // ID do usuário
  tipoMovimento: 'enviado' | 'recebido' | 'interno';
  remetente?: string;    // Para documentos recebidos
  destinatario?: string; // Para documentos enviados
  dataEnvio?: string;    // Para documentos enviados
  dataRecebimento?: string; // Para documentos recebidos
  arquivo: {
    cloudinaryId: string;
    url: string;
    secureUrl: string;
    originalName: string;
    format: string;
    size: number;
  };
  status: 'ativo' | 'arquivado';
  tags: string[];
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

---

## 🔗 **Endpoints Necessários**

### **Base URL**
```
http://localhost:3000/api
```

### **Departamentos**
```
GET    /departamentos          - Listar todos
GET    /departamentos/:id      - Buscar por ID
POST   /departamentos          - Criar
PUT    /departamentos/:id      - Atualizar
DELETE /departamentos/:id      - Remover
```

### **Categorias**
```
GET    /categorias             - Listar (com filtro por departamento)
GET    /categorias/:id         - Buscar por ID
POST   /categorias             - Criar
PUT    /categorias/:id         - Atualizar
DELETE /categorias/:id         - Remover
```

### **Tipos**
```
GET    /tipos                  - Listar todos
GET    /tipos/:id              - Buscar por ID
POST   /tipos                  - Criar
PUT    /tipos/:id              - Atualizar
DELETE /tipos/:id              - Remover
```

### **Documentos**
```
GET    /documentos             - Listar (com filtros)
GET    /documentos/:id         - Buscar por ID
POST   /documentos             - Criar
PUT    /documentos/:id         - Atualizar
DELETE /documentos/:id         - Remover
```

---

## 📋 **Padrão de Resposta Esperado**

### **Resposta de Sucesso**
```typescript
{
  "success": true,
  "data": any,
  "meta"?: any
}
```

### **Resposta Paginada**
```typescript
{
  "success": true,
  "data": any[],
  "page": number,
  "limit": number,
  "total": number
}
```

### **Resposta de Erro**
```typescript
{
  "success": false,
  "message": string,
  "details"?: any
}
```

---

## 🔍 **Parâmetros de Query**

### **Paginação (Padrão)**
```typescript
{
  page?: number;   // Página (padrão: 1)
  limit?: number;  // Limite por página (padrão: 10, máx: 100)
}
```

### **Filtros Específicos**
```typescript
// Departamentos
{
  q?: string;      // Busca por texto
  ativo?: boolean; // Filtrar por status
}

// Categorias
{
  q?: string;         // Busca por texto
  ativo?: boolean;    // Filtrar por status
  departamento?: string; // Filtrar por departamento (ID)
}

// Documentos
{
  q?: string;         // Busca por texto
  ativo?: boolean;    // Filtrar por status
  departamento?: string; // Filtrar por departamento
  categoria?: string;    // Filtrar por categoria
  tipo?: string;         // Filtrar por tipo
  tipoMovimento?: string; // Filtrar por movimento
  status?: string;        // Filtrar por status
}
```

---

## 🚀 **Funcionalidades do Frontend**

### **Dashboard Principal**
- Lista de departamentos na sidebar
- Categorias organizadas por departamento
- Tipos de documentos
- Lista de documentos com filtros

### **CRUD Completo**
- Criar, editar, visualizar, remover todas as entidades
- Validação em tempo real
- Confirmações antes de deletar

### **Filtros e Busca**
- Busca por texto em todos os campos
- Filtros por departamento, status, tipo
- Paginação automática

### **Upload de Arquivos**
- Drag & drop de documentos
- Validação de tipos e tamanhos
- Progresso em tempo real

---

## ⚠️ **IMPORTANTE**

1. **Respeitar a estrutura hierárquica**: Categorias pertencem a Departamentos
2. **Manter padrão de resposta**: Sempre incluir `success: boolean`
3. **Implementar paginação**: Para listas grandes
4. **Validação de dados**: No backend antes de salvar
5. **Tratamento de erros**: Mensagens claras para o usuário

---

## 📅 **Status**
- **Frontend**: ✅ 100% Concluído
- **Backend**: ✅ Disponível
- **Integração**: 🔄 Pendente
- **Próximo**: Implementar services e conectar APIs
