# Implementação do Filtro por Departamento

## Resumo das Alterações

Este documento descreve as alterações implementadas para filtrar documentos por departamento do usuário logado.

## Alterações no Backend

**Já existiam endpoints prontos para filtrar por departamento:**
- `GET /documentos/departamento/:departamentoId` - Filtra documentos por departamento específico
- `GET /documentos/usuario/:usuarioId` - Filtra documentos por usuário específico

## Alterações no Frontend

### 1. DocumentosService (`frontend/src/services/documentosService.ts`)

**Adicionados métodos específicos:**
- `buscarPorDepartamento(departamentoId, params)` - Usa endpoint específico do backend
- `buscarPorUsuario(usuarioId, params)` - Usa endpoint específico do backend

```typescript
// Buscar documentos por departamento usando endpoint específico
static async buscarPorDepartamento(departamentoId: string, params?: DocumentoQueryParams): Promise<ApiPaginatedResponse<Documento>> {
  return apiGet<ApiPaginatedResponse<Documento>>(`/documentos/departamento/${departamentoId}`, params as Record<string, string | number | boolean>);
}

// Buscar documentos por usuário usando endpoint específico
static async buscarPorUsuario(usuarioId: string, params?: DocumentoQueryParams): Promise<ApiPaginatedResponse<Documento>> {
  return apiGet<ApiPaginatedResponse<Documento>>(`/documentos/usuario/${usuarioId}`, params as Record<string, string | number | boolean>);
}
```

### 2. Hook useDocumentos (`frontend/src/hooks/useDocumentos.ts`)

**Adicionados métodos para hook:**
- `buscarPorDepartamento(departamentoId, params)` 
- `buscarPorUsuario(usuarioId, params)`
- `buscarPorCategoria(categoriaId, params)`
- `buscarPorTipo(tipoId, params)`

### 3. Página Documentos do Departamento (`frontend/src/app/user/documentos/page.tsx`)

**Principais alterações:**
- Importa `useAuth` para acessar informações do usuário logado
- No `useEffect`, carrega automaticamente documentos do departamento do usuário
- Atualiza a busca para manter o filtro por departamento
- Título dinâmico mostra o nome do departamento

```typescript
const { user } = useAuth();

useEffect(() => {
  // Carregar documentos do departamento do usuário logado
  if (user?.departamento?._id) {
    buscarPorDepartamento(user.departamento._id);
  }
}, [user, buscarPorDepartamento]);

const handleSearch = async (query: string) => {
  setSearchQuery(query);
  if (!query.trim() && user?.departamento?._id) {
    // Se não há busca, volta a mostrar documentos do departamento
    buscarPorDepartamento(user.departamento._id);
    return;
  }
  // Busca por texto mas ainda filtrando pelo departamento
  if (user?.departamento?._id) {
    buscarPorDepartamento(user.departamento._id, { q: query });
  }
};
```

### 4. Página Meus Documentos (`frontend/src/app/user/meus-documentos/page.tsx`)

**Principais alterações:**
- Importa `useAuth` para acessar informações do usuário logado
- No `useEffect`, carrega automaticamente documentos criados pelo usuário
- Atualiza a busca para manter o filtro por usuário
- Atualiza o método de exclusão para recarregar corretamente

```typescript
const { user } = useAuth();

useEffect(() => {
  // Carregar documentos do usuário logado
  if (user?._id) {
    buscarPorUsuario(user._id);
  }
}, [user, buscarPorUsuario]);
```

## Fluxo de Funcionamento

### Para Documentos do Departamento:
1. Usuário faz login
2. Sistema obtém informações do usuário incluindo departamento
3. Página `/user/documentos` carrega automaticamente documentos do departamento do usuário
4. Pesquisas mantêm o filtro por departamento

### Para Meus Documentos:
1. Usuário faz login  
2. Sistema obtém ID do usuário
3. Página `/user/meus-documentos` carrega automaticamente documentos criados pelo usuário
4. Pesquisas mantêm o filtro por usuário

## Cenário de Uso

**Exemplo: José dos Recursos Humanos**
1. José faz login na plataforma
2. Sistema identifica que José pertence ao departamento "Recursos Humanos"
3. Quando José acessa "Documentos", vê apenas documentos do departamento RH
4. Quando José acessa "Meus Documentos", vê apenas documentos que ele criou
5. Todas as pesquisas respeitam esses filtros automaticamente

## Estrutura de Dados do Usuário

O contexto de autenticação fornece:
```typescript
user: {
  _id: string;
  username: string;
  nome: string;
  departamento: {
    _id: string;
    nome: string;
    codigo: string;
  };
  roles: string[];
}
```

## Benefícios

1. **Segurança**: Usuários só veem documentos do seu departamento
2. **Performance**: Queries otimizadas com filtros no backend
3. **UX**: Interface intuitiva que automaticamente filtra conteúdo relevante
4. **Escalabilidade**: Usa endpoints específicos que são mais eficientes


