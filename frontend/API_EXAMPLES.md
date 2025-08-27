# Exemplos para Testes da API

## 1. Departamentos (POST /api/departamentos)

```json
{
  "nome": "Recursos Humanos",
  "codigo": "RH", 
  "descricao": "Departamento responsável pela gestão de pessoas e talentos",
  "ativo": true
}
```

```json
{
  "nome": "Tecnologia da Informação",
  "codigo": "TI",
  "descricao": "Departamento de desenvolvimento e infraestrutura tecnológica", 
  "ativo": true
}
```

```json
{
  "nome": "Financeiro",
  "codigo": "FIN",
  "descricao": "Departamento financeiro e contábil",
  "ativo": true
}
```

## 2. Tipos de Documento (POST /api/tipos)

```json
{
  "nome": "Contrato",
  "codigo": "CONT",
  "descricao": "Documentos contratuais diversos",
  "ativo": true
}
```

```json
{
  "nome": "Manual",
  "codigo": "MAN", 
  "descricao": "Manuais e guias de procedimentos",
  "ativo": true
}
```

```json
{
  "nome": "Política Interna",
  "codigo": "POL",
  "descricao": "Políticas e procedimentos internos",
  "ativo": true
}
```

## 3. Categorias (POST /api/categorias)

⚠️ **Importante:** Substitua `DEPARTAMENTO_ID` pelo ID real retornado ao criar departamentos

```json
{
  "nome": "Admissão",
  "codigo": "ADM",
  "descricao": "Documentos relacionados à admissão de funcionários",
  "departamento": "DEPARTAMENTO_ID_AQUI",
  "cor": "#4CAF50",
  "icone": "person_add", 
  "ativo": true
}
```

```json
{
  "nome": "Infraestrutura",
  "codigo": "INF",
  "descricao": "Documentos de infraestrutura e sistemas",
  "departamento": "DEPARTAMENTO_ID_AQUI",
  "cor": "#2196F3",
  "icone": "dns",
  "ativo": true
}
```

## 4. Usuários (POST /api/usuarios)

```json
{
  "auth0Id": "auth0|123456789",
  "nome": "João Silva", 
  "email": "joao.silva@empresa.com",
  "roles": ["admin"],
  "ativo": true
}
```

```json
{
  "auth0Id": "auth0|987654321",
  "nome": "Maria Santos",
  "email": "maria.santos@empresa.com", 
  "roles": ["user", "manager"],
  "ativo": true
}
```

## 5. Documentos (POST /api/documentos)

⚠️ **Importante:** Substitua os IDs pelos valores reais dos registros criados anteriormente

```json
{
  "titulo": "Manual de Integração de Funcionários",
  "categoria": "CATEGORIA_ID_AQUI",
  "tipo": "TIPO_ID_AQUI", 
  "departamento": "DEPARTAMENTO_ID_AQUI",
  "usuario": "USUARIO_ID_AQUI",
  "ativo": true
}
```

```json
{
  "titulo": "Política de Segurança da Informação",
  "categoria": "CATEGORIA_ID_AQUI",
  "tipo": "TIPO_ID_AQUI",
  "departamento": "DEPARTAMENTO_ID_AQUI", 
  "usuario": "USUARIO_ID_AQUI",
  "ativo": true
}
```

---

## Sequência de Testes Recomendada:

1. **Criar Departamentos** primeiro (não têm dependências)
2. **Criar Tipos** (não têm dependências)
3. **Criar Usuários** (não têm dependências)
4. **Criar Categorias** (precisam de departamento_id)
5. **Criar Documentos** (precisam de todos os IDs acima)

## Headers para todas as requisições:

```
Content-Type: application/json
Authorization: Bearer SEU_JWT_TOKEN_AQUI
```

## Endpoints de Teste:

- `GET /health` - Verificar se API está rodando
- `GET /api/departamentos` - Listar departamentos
- `GET /api/tipos` - Listar tipos
- `GET /api/categorias` - Listar categorias
- `GET /api/usuarios` - Listar usuários  
- `GET /api/documentos` - Listar documentos

## Query Parameters de Exemplo:

```
GET /api/documentos?page=1&limit=5&q=manual&ativo=true
GET /api/categorias?departamento=DEPARTAMENTO_ID&ativo=true
```
