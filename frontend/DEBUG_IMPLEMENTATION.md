# Debug da Implementação do Filtro por Departamento

## Problemas Identificados e Corrigidos

### 1. ✅ Estrutura de Resposta da API
**Problema:** Os tipos de resposta paginada não correspondiam à estrutura real do backend.

**Backend retorna:**
```json
{
  "success": true,
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 20
}
```

**Frontend esperava:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20
  }
}
```

**Correção:** Atualizados os tipos `ApiPaginatedResponse` em `lib/api.ts` para corresponder à estrutura real.

### 2. ✅ Configuração de Portas
- **Backend:** Porta 3000 (`http://localhost:3000/api`)
- **Frontend:** Porta 3001 (`http://localhost:3001`)
- **CORS:** Configurado corretamente no backend para aceitar origem `localhost:3001`

### 3. ✅ Logs de Debug Adicionados

**Locais com logs:**
- `AuthService.getCurrentUser()` - Para verificar dados do usuário
- `DocumentosService.buscarPorDepartamento()` - Para verificar chamadas à API
- `useDocumentos.buscarPorDepartamento()` - Para verificar hook
- `DocumentosPage.useEffect()` - Para verificar se o usuário tem departamento
- `api.ts.apiRequest()` - Para verificar todas as requisições HTTP

## Como Testar

### 1. Iniciar os Servidores
```bash
# Terminal 1 - Backend
cd server-eidocs
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. Verificar Logs no Browser
1. Abrir `http://localhost:3001`
2. Fazer login na aplicação
3. Navegar para `/user/documentos`
4. Abrir DevTools (F12) → Console
5. Verificar os logs com emojis:

**Logs esperados:**
```
🔑 AuthService - getCurrentUser chamado
👤 Resposta getCurrentUser: {...}
🏢 Departamento do usuário: {...}
🔍 DocumentosPage - useEffect chamado
👤 User: {...}
🏢 Departamento ID: 507f1f77bcf86cd799439011
📋 Chamando buscarPorDepartamento com ID: 507f1f77bcf86cd799439011
🔄 Hook useDocumentos - buscarPorDepartamento iniciado
🌐 DocumentosService - buscarPorDepartamento
🔗 URL será: /documentos/departamento/507f1f77bcf86cd799439011
🌐 Fazendo requisição: GET http://localhost:3000/api/documentos/departamento/507f1f77bcf86cd799439011
📡 API Response: 200 - GET http://localhost:3000/api/documentos/departamento/507f1f77bcf86cd799439011
📨 Resposta da API: {...}
✅ Resposta recebida: {...}
📋 Documentos encontrados: 5
```

### 3. Verificar Possíveis Problemas

**Se não aparecerem documentos:**

#### A. Verificar se o usuário tem departamento
```javascript
// No console do browser
console.log('User:', localStorage.getItem('user'));
```

#### B. Verificar se a API está respondendo
```javascript
// No console do browser
fetch('http://localhost:3000/api/documentos/departamento/SEU_DEPARTAMENTO_ID')
  .then(r => r.json())
  .then(console.log);
```

#### C. Verificar se há documentos no departamento
- Acessar `/manage/documentos` (como admin)
- Verificar se existem documentos criados
- Verificar se os documentos têm o campo `departamento` preenchido

#### D. Verificar autenticação
- Abrir Network tab no DevTools
- Ver se as requisições incluem cookies de autenticação
- Verificar se não há erros 401/403

## Estrutura do Fluxo

1. **Login** → `AuthContext` → `authService.getCurrentUser()`
2. **User Data** → Inclui `departamento._id`
3. **useEffect** → Detecta usuário logado
4. **Hook** → `useDocumentos.buscarPorDepartamento(departamentoId)`
5. **Service** → `DocumentosService.buscarPorDepartamento()`
6. **API** → `GET /api/documentos/departamento/:id`
7. **Backend** → Filtra documentos por departamento
8. **Response** → Atualiza estado dos documentos
9. **UI** → Renderiza lista filtrada

## Próximos Passos se Ainda Não Funcionar

1. Verificar se o backend está rodando corretamente
2. Verificar se há documentos na base de dados
3. Verificar se a autenticação está funcionando
4. Verificar se o middleware de auth está desabilitado (está comentado)
5. Testar endpoint diretamente no Postman/Thunder Client

## Remover Logs de Debug

Quando tudo estiver funcionando, remover todos os `console.log` adicionados nos arquivos:
- `frontend/src/services/authService.ts`
- `frontend/src/services/documentosService.ts`
- `frontend/src/hooks/useDocumentos.ts`
- `frontend/src/app/user/documentos/page.tsx`
- `frontend/src/lib/api.ts`
