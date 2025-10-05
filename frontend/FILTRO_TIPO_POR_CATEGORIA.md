# Filtro de Tipos por Categoria - Implementação

## 📋 Resumo da Funcionalidade

Implementado sistema de **filtro em cascata** onde os tipos de documento são filtrados automaticamente baseado na categoria selecionada.

## 🎯 Hierarquia Implementada

```
Departamento → Categoria → Tipo → Documento
```

### Fluxo de Seleção

1. **Usuário seleciona Departamento** (automático, baseado no usuário logado)
2. **Usuário seleciona Categoria** (apenas do seu departamento)
3. **Tipos são filtrados** (apenas os tipos da categoria selecionada)
4. **Usuário seleciona Tipo** (apenas tipos disponíveis para aquela categoria)
5. **Documento é criado** com categoria e tipo válidos

## 🔄 Componentes Atualizados

### 1. TipoForm.tsx
**Localização**: `frontend/src/components/forms/TipoForm.tsx`

#### Mudanças:
- ✅ Adicionado campo de seleção de **Categoria** (obrigatório)
- ✅ Carregamento automático de categorias ao montar o componente
- ✅ Validação: categoria é obrigatória
- ✅ Exibe nome da categoria e departamento no dropdown
- ✅ Mensagem de alerta se não houver categorias disponíveis

#### Código Importante:
```tsx
// Carregar categorias
useEffect(() => {
  carregarCategorias();
}, [carregarCategorias]);

// Validação
if (!formData.categoria) {
  newErrors.categoria = 'Categoria é obrigatória';
}
```

#### UI:
- Dropdown mostra: `{categoria.nome} ({categoria.codigo}) - {departamento.nome}`
- Desabilitado enquanto categorias estão carregando
- Alerta em amarelo se não houver categorias

---

### 2. Upload Page (user/upload/page.tsx)
**Localização**: `frontend/src/app/user/upload/page.tsx`

#### Mudanças:
- ✅ Adicionado estado `tiposFiltrados`
- ✅ useEffect para filtrar tipos quando categoria muda
- ✅ Dropdown de tipo desabilitado até selecionar categoria
- ✅ Limpa seleção de tipo se não for válido para a nova categoria
- ✅ Mensagens contextuais baseadas no estado

#### Lógica de Filtro:
```tsx
useEffect(() => {
  if (!formData.categoria) {
    setTiposFiltrados([]);
    return;
  }

  const filtrados = tipos.filter(tipo => {
    // Suporta tipo.categoria como string (ID) ou objeto
    if (typeof tipo.categoria === 'string') {
      return tipo.categoria === formData.categoria;
    }
    return tipo.categoria._id === formData.categoria;
  });

  setTiposFiltrados(filtrados);

  // Limpar tipo se não for válido
  if (formData.tipo) {
    const tipoValido = filtrados.find(t => t._id === formData.tipo);
    if (!tipoValido) {
      setFormData(prev => ({ ...prev, tipo: '' }));
    }
  }
}, [formData.categoria, tipos, formData.tipo]);
```

#### UI - Mensagens Dinâmicas:
```tsx
// Select desabilitado até selecionar categoria
disabled={!formData.categoria || loadingTipos}

// Mensagem no placeholder
{!formData.categoria 
  ? 'Selecione uma categoria primeiro...' 
  : 'Selecione um tipo...'}

// Alerta se não houver tipos
{formData.categoria && tiposFiltrados.length === 0 && !loadingTipos && (
  <p className="text-xs text-amber-600 mt-1">
    ⚠️ Nenhum tipo disponível para esta categoria. Crie um tipo primeiro.
  </p>
)}
```

## 📝 Casos de Uso Tratados

### ✅ Caso 1: Categoria sem Tipos
**Situação**: Usuário seleciona categoria que não tem tipos cadastrados

**Comportamento**:
- Select de tipo fica vazio
- Mensagem exibida: *"⚠️ Nenhum tipo disponível para esta categoria. Crie um tipo primeiro."*
- Botão de submit desabilitado (tipo é obrigatório)

**Solução**: Usuário deve ir em **Gerenciar Tipos** e criar um tipo vinculado àquela categoria

---

### ✅ Caso 2: Trocar Categoria com Tipo Selecionado
**Situação**: Usuário seleciona categoria A, escolhe um tipo, depois muda para categoria B

**Comportamento**:
- Tipos são filtrados para categoria B
- Tipo selecionado anteriormente é limpo automaticamente
- Mensagem exibida para selecionar novo tipo

**Lógica**:
```tsx
if (formData.tipo) {
  const tipoValido = filtrados.find(t => t._id === formData.tipo);
  if (!tipoValido) {
    setFormData(prev => ({ ...prev, tipo: '' }));
  }
}
```

---

### ✅ Caso 3: Nenhuma Categoria Disponível
**Situação**: Departamento do usuário não tem categorias cadastradas

**Comportamento** (TipoForm):
- Select de categoria vazio
- Mensagem exibida: *"⚠️ Nenhuma categoria disponível. Crie uma categoria primeiro."*
- Não é possível criar tipo

**Solução**: Administrador deve criar categorias para o departamento

---

### ✅ Caso 4: Edição de Tipo
**Situação**: Usuário está editando um tipo existente

**Comportamento**:
- Categoria atual é pré-selecionada
- Todos os dados são carregados corretamente
- É possível trocar a categoria do tipo

---

### ✅ Caso 5: Carregamento de Dados
**Situação**: Dados ainda estão sendo carregados do backend

**Comportamento**:
- Selects desabilitados enquanto `loadingCategorias` ou `loadingTipos`
- Mensagem: *"Carregando categorias..."* / *"Carregando tipos..."*
- Evita seleção acidental durante o carregamento

## 🚀 Fluxo de Trabalho para o Usuário

### Criar um Novo Documento:

1. **Ir para Upload de Documento**
2. **Selecionar Categoria** → dropdown mostra categorias do departamento
3. **Selecionar Tipo** → dropdown mostra APENAS tipos daquela categoria
4. **Preencher demais campos** e fazer upload

### Criar um Novo Tipo:

1. **Ir para Gerenciar Tipos**
2. **Clicar em "Novo Tipo"**
3. **Selecionar Categoria** (obrigatório)
4. **Preencher nome, código, descrição**
5. **Salvar** → tipo fica disponível apenas para documentos daquela categoria

## 🔍 Exemplo Prático

### Cenário:
- **Departamento**: Financeiro
- **Categorias**: Contratos, Notas Fiscais, Relatórios
- **Tipos**:
  - Contrato de Prestação de Serviço → Categoria: Contratos
  - Contrato de Locação → Categoria: Contratos
  - NF-e → Categoria: Notas Fiscais
  - Relatório Mensal → Categoria: Relatórios

### Fluxo:
1. Usuário seleciona **Categoria: Contratos**
2. Select de tipo mostra apenas:
   - Contrato de Prestação de Serviço ✅
   - Contrato de Locação ✅
3. NF-e e Relatório Mensal **NÃO aparecem** ❌

## 📊 Validações Implementadas

### Backend:
- ✅ Campo `categoria` é obrigatório no schema
- ✅ Validação Zod: categoria deve ser ObjectId válido
- ✅ Populate automático da categoria ao listar/buscar tipos

### Frontend:
- ✅ Campo categoria obrigatório no formulário de tipo
- ✅ Select de tipo desabilitado até selecionar categoria
- ✅ Limpeza automática de tipo inválido ao trocar categoria
- ✅ Mensagens de erro/alerta contextuais

## 🎨 UX - Mensagens e Estados

| Estado | Mensagem | Cor |
|--------|----------|-----|
| Sem categoria selecionada | "Selecione uma categoria primeiro..." | Cinza |
| Categoria sem tipos | "⚠️ Nenhum tipo disponível para esta categoria. Crie um tipo primeiro." | Âmbar |
| Sem categorias disponíveis | "⚠️ Nenhuma categoria disponível. Crie uma categoria primeiro." | Âmbar |
| Carregando | "Carregando categorias..." / "Carregando tipos..." | Azul |
| Sucesso | "Selecione uma categoria para ver os tipos disponíveis" | Cinza |

## 🔄 Próximas Melhorias Possíveis

- [ ] Adicionar filtro por categoria na página de busca de documentos
- [ ] Mostrar estatísticas de tipos por categoria no dashboard
- [ ] Permitir criação rápida de tipo ao fazer upload (modal inline)
- [ ] Adicionar badge com quantidade de tipos por categoria
- [ ] Filtro de tipos na listagem de gerenciar tipos

## 📚 Documentação Relacionada

- [TIPO_CATEGORIA_UPDATE.md](../../server-eidocs/TIPO_CATEGORIA_UPDATE.md) - Detalhes da implementação no backend
- [API_EXAMPLES.md](../../server-eidocs/API_EXAMPLES.md) - Exemplos de uso da API

---

**Status**: ✅ Implementado e Funcional  
**Data**: 6 de Outubro de 2025  
**Versão**: 1.0.0
