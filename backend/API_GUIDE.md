# API de Sistema de Documentos - Guia de Uso

## Estrutura da API

A API foi projetada com os seguintes princípios:

### 1. **Tratamento Centralizado de Erros**
- Todos os erros são capturados e formatados consistentemente
- Usa códigos de erro padronizados
- Retorna sempre no formato JSON estruturado

### 2. **Respostas Padronizadas**
Todas as respostas seguem o formato:
```json
{
  "success": true|false,
  "data": {...},
  "message": "string",
  "error": {
    "code": "ERROR_CODE",
    "message": "string",
    "details": {...}
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. **Autenticação e Autorização**
- Todas as rotas da API requerem autenticação
- Sistema de roles: `admin`, `editor`, `user`
- Sistema de permissões granulares

### 4. **Validação com Zod**
- Validação de entrada robusta
- Mensagens de erro claras e específicas
- Validação de tipos TypeScript em runtime

### 5. **Paginação e Filtros**
- Paginação automática em todas as listagens
- Suporte a busca textual
- Filtros por campos específicos
- Ordenação customizável

## Endpoints Disponíveis

### Departamentos
- `GET /api/departamentos` - Listar departamentos
- `GET /api/departamentos/:id` - Buscar departamento por ID
- `POST /api/departamentos` - Criar departamento (admin)
- `PUT /api/departamentos/:id` - Atualizar departamento (admin)
- `DELETE /api/departamentos/:id` - Deletar departamento (admin)

### Tipos de Documento
- `GET /api/tipos-documento` - Listar tipos
- `GET /api/tipos-documento/:id` - Buscar tipo por ID
- `POST /api/tipos-documento` - Criar tipo (admin)
- `PUT /api/tipos-documento/:id` - Atualizar tipo (admin)
- `DELETE /api/tipos-documento/:id` - Deletar tipo (admin)

### Categorias de Documento
- `GET /api/categorias-documento` - Listar categorias
- `GET /api/categorias-documento/:id` - Buscar categoria por ID
- `POST /api/categorias-documento` - Criar categoria (admin)
- `PUT /api/categorias-documento/:id` - Atualizar categoria (admin)
- `DELETE /api/categorias-documento/:id` - Deletar categoria (admin)

### Documentos
- `GET /api/documentos` - Listar documentos
- `GET /api/documentos/:id` - Buscar documento por ID
- `GET /api/documentos/departamento/:departamentoId` - Buscar por departamento
- `GET /api/documentos/tipo/:tipoId` - Buscar por tipo
- `POST /api/documentos` - Criar documento (admin/editor)
- `PUT /api/documentos/:id` - Atualizar documento (admin/editor)
- `POST /api/documentos/:id/upload` - Upload de arquivo (permissão específica)
- `DELETE /api/documentos/:id` - Deletar documento (admin)

## Parâmetros de Query

Para listagens, você pode usar:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)
- `search`: Busca textual
- `sortBy`: Campo para ordenação
- `sortOrder`: `asc` ou `desc` (padrão: desc)
- Filtros específicos por recurso

## Exemplo de Uso

```bash
# Listar documentos com filtros
GET /api/documentos?page=1&limit=20&search=contrato&departamento=507f1f77bcf86cd799439011&status=aprovado

# Criar um documento
POST /api/documentos
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "Contrato de Prestação de Serviços",
  "descricao": "Contrato com fornecedor XYZ",
  "departamento": "507f1f77bcf86cd799439011",
  "tipoDocumento": "507f1f77bcf86cd799439012",
  "categoriaDocumento": "507f1f77bcf86cd799439013",
  "numeroProtocolo": "2025/001",
  "assunto": "Prestação de serviços",
  "tags": ["contrato", "fornecedor", "xyz"]
}
```

## Roles e Permissões

### Roles:
- `admin`: Acesso total ao sistema
- `editor`: Pode criar/editar documentos
- `user`: Apenas visualização

### Permissões:
- `document:upload`: Pode fazer upload de arquivos
- `document:delete`: Pode deletar documentos
- `admin:manage`: Gerenciar configurações do sistema

## Validações

### Documento:
- Título: obrigatório, máximo 200 caracteres
- Departamento: obrigatório
- Tipo de documento: obrigatório
- Categoria: obrigatória
- Não pode ter data de recebimento e envio simultaneamente
- Máximo 10 tags, cada uma com 30 caracteres

### Upload de Arquivos:
- Tipos permitidos: PDF, Word, Excel, PowerPoint, imagens, texto
- Tamanho máximo: 10MB
- Armazenamento no Cloudinary
