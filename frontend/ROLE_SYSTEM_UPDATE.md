# Atualização do Sistema de Roles - Frontend

## 📋 Resumo das Mudanças

Este documento descreve as atualizações realizadas no frontend para suportar o novo sistema hierárquico de roles implementado no backend.

## 🔄 Mudanças Principais

### 1. **Sistema de Roles Hierárquico**

**Antes:** Array de roles (`roles: string[]`)
```typescript
{
  roles: ['admin', 'editor', 'user'] // Múltiplos roles
}
```

**Depois:** Role único (`role: 'admin' | 'editor' | 'user'`)
```typescript
{
  role: 'admin' // Um único role por usuário
}
```

### 2. **Hierarquia de Permissões**

- **Admin**: Único no sistema, acesso total a todos os departamentos e funcionalidades
- **Editor**: Gerente departamental, acesso restrito ao seu departamento
- **User**: Nível básico, acesso de visualização e criação

## 📁 Arquivos Modificados

### **1. Types (`src/types/index.ts`)**

✅ **Mudanças:**
- `Usuario.roles: string[]` → `Usuario.role: 'admin' | 'editor' | 'user'`
- `CreateUsuario.roles?: string[]` → `CreateUsuario.role?: 'admin' | 'editor' | 'user'`
- `UsuarioQueryParams.roles?: string[]` → `UsuarioQueryParams.role?: 'admin' | 'editor' | 'user'`

### **2. Auth Service (`src/services/authService.ts`)**

✅ **Novos Métodos:**
```typescript
// Verificações básicas
isAdmin(user: User): boolean
isEditor(user: User): boolean
isUser(user: User): boolean

// Permissões específicas
canEdit(user: User): boolean                    // Admin e Editor
canManageUsers(user: User): boolean             // Apenas Admin
canDeleteDocuments(user: User): boolean         // Admin e Editor
canAccessAllDepartments(user: User): boolean    // Apenas Admin
canAccessDepartment(user: User, deptId: string): boolean

// Utilitários
hasRole(user: User, role: string): boolean
hasAnyRole(user: User, roles: string[]): boolean
hasMinimumRole(user: User, minRole: string): boolean  // Hierarquia
```

### **3. Auth Context (`src/contexts/AuthContext.tsx`)**

✅ **Métodos Adicionados:**
- `isEditor()`
- `canAccessAllDepartments()`
- `canAccessDepartment(departmentId: string)`
- `hasMinimumRole(minRole: string)`

✅ **Métodos Removidos:**
- `hasAllRoles()` (não é mais necessário com role único)

### **4. Formulário de Usuário (`src/components/forms/UsuarioForm.tsx`)**

✅ **Mudanças na UI:**
- **Antes:** Checkboxes múltiplas para selecionar várias roles
- **Depois:** Select único com opções:
  - Usuário (Nível Básico)
  - Editor (Gerente Departamental)
  - Administrador (Acesso Total - Único)

✅ **Validação:**
- Removida validação de "pelo menos uma role"
- Adicionada validação de role obrigatória
- Removido método `handleRoleChange()`

✅ **Descrições contextuais:**
```typescript
⚠️ Admin tem acesso total ao sistema e deve ser único
Editor gerencia documentos e categorias do seu departamento
Usuário tem acesso básico de visualização e criação
```

### **5. Listagem de Usuários (`src/app/manage/usuarios/page.tsx`)**

✅ **Controle de Acesso:**
- Página protegida: redirecionamento se não for admin
```typescript
useEffect(() => {
  if (!authLoading && !canManageUsers()) {
    router.push('/dashboard');
  }
}, [authLoading, canManageUsers, router]);
```

✅ **Exibição:**
- Coluna `roles` (plural) → `role` (singular)
- Badge único em vez de múltiplos badges
- Labels atualizados:
  - "Administrador"
  - "Editor (Gerente)"
  - "Usuário"

✅ **Ações:**
- Botões Edit/Delete disponíveis apenas para admin

### **6. Detalhes do Usuário (`src/components/details/UsuarioDetail.tsx`)**

✅ **Exibição:**
- "Permissões" → "Função"
- Badge único em vez de lista de badges
- Método `getRoleBadges()` → `getRoleBadge()`

### **7. Gerenciamento de Departamentos (`src/app/manage/departamentos/page.tsx`)**

✅ **Proteções Adicionadas:**
- Botão "Novo Departamento" visível apenas para admin
- Ações de editar/deletar disponíveis apenas para admin
```typescript
onAdd={isAdmin() ? handleAdd : undefined}

const actions = [
  { key: 'view', ... }, // Todos podem ver
  ...(isAdmin() ? [    // Apenas admin pode editar/deletar
    { key: 'edit', ... },
    { key: 'delete', ... }
  ] : [])
]
```

### **8. Dashboard Principal (`src/app/dashboard/page.tsx`)**

✅ **Correção de Bug:**
- **Erro**: `Cannot read properties of undefined (reading 'includes')`
- **Causa**: Uso de `user.roles.includes()` em vez de `user.role`

✅ **Antes:**
```typescript
if (user.roles.includes('admin') || user.roles.includes('editor')) {
  router.push('/dashboard/admin');
}
```

✅ **Depois:**
```typescript
if (user.role === 'admin' || user.role === 'editor') {
  router.push('/dashboard/admin');
}
```

## 🔒 Regras de Permissão Implementadas

| Funcionalidade | Admin | Editor | User |
|----------------|-------|--------|------|
| Ver usuários | ✅ | ❌ | ❌ |
| Criar/Editar usuários | ✅ | ❌ | ❌ |
| Deletar usuários | ✅ | ❌ | ❌ |
| Ver departamentos | ✅ | ✅ | ✅ |
| Criar/Editar departamentos | ✅ | ❌ | ❌ |
| Deletar departamentos | ✅ | ❌ | ❌ |
| Acessar todos departamentos | ✅ | ❌ | ❌ |
| Acessar seu departamento | ✅ | ✅ | ✅ |
| Editar documentos | ✅ | ✅ (próprio dept) | ❌ |
| Deletar documentos | ✅ | ✅ (próprio dept) | ❌ |

## 🧪 Testes Necessários

1. ✅ Criar usuário com cada tipo de role
2. ✅ Editar role de um usuário existente
3. ✅ Verificar que apenas 1 admin pode existir
4. ✅ Testar login com cada tipo de role
5. ⏳ Verificar redirecionamentos baseados em permissões
6. ⏳ Testar acesso a departamentos (admin vs editor vs user)
7. ⏳ Verificar controles de UI (botões visíveis/ocultos)
8. ⏳ Testar formulários com validação de role

## 🚀 Próximos Passos

1. **Documentos**: Adicionar filtros de departamento baseados no role
2. **Categorias**: Restringir edição ao departamento do editor
3. **Dashboard**: Criar visualizações específicas por role
4. **Auditoria**: Implementar logs de mudanças de role
5. **Notificações**: Alertar quando admin mudar role de usuário

## 📝 Notas Importantes

- ⚠️ **Admin Único**: O sistema permite apenas 1 usuário com role `admin`
- 🔄 **Migração**: Usuários existentes foram migrados automaticamente
- 🔐 **Segurança**: Validações estão no backend E frontend
- 📊 **Hierarquia**: Admin > Editor > User (para comparações de nível)

## 🐛 Problemas Conhecidos

- ✅ **TODOS RESOLVIDOS**: Todos os erros de `user.roles` foram corrigidos

## 🔧 Bugs Corrigidos

### **1. TypeError no Dashboard**
- **Erro**: `Cannot read properties of undefined (reading 'includes')`
- **Arquivo**: `src/app/dashboard/page.tsx:14`
- **Causa**: Código antigo usando `user.roles` (array) em vez de `user.role` (string)
- **Correção**: Substituído verificação de array por comparação de string
- **Status**: ✅ Resolvido

### **2. TypeError no Sidebar**
- **Erro**: `Cannot read properties of undefined (reading 'includes')`
- **Arquivo**: `src/components/ui/Sidebar.tsx:108`
- **Causa**: Mesmo problema - usando `user.roles.includes()` no menu
- **Correção**: Atualizado para `user.role === 'admin' || user.role === 'editor'`
- **Status**: ✅ Resolvido
- **Impacto**: Menu lateral agora renderiza corretamente baseado no role único

## 📚 Documentação Relacionada

- Backend: `/server-eidocs/ROLE_MIGRATION.md`
- API: `/server-eidocs/API_EXAMPLES.md`
- Frontend Requirements: `/frontend/FRONTEND_REQUIREMENTS.md`
