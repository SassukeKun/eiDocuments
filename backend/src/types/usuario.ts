export enum UsuarioRole {
  ADMIN = 'admin',
  GESTOR = 'gestor',
  FUNCIONARIO = 'funcionario',
  CONSULTOR = 'consultor'
}

export enum UsuarioPermissao {
  CRIAR_DOCUMENTO = 'criar_documento',
  EDITAR_DOCUMENTO = 'editar_documento',
  EXCLUIR_DOCUMENTO = 'excluir_documento',
  VISUALIZAR_DOCUMENTO = 'visualizar_documento',
  GERENCIAR_USUARIOS = 'gerenciar_usuarios',
  GERENCIAR_DEPARTAMENTOS = 'gerenciar_departamentos',
  GERENCIAR_CATEGORIAS = 'gerenciar_categorias',
  GERENCIAR_TIPOS = 'gerenciar_tipos'
}
