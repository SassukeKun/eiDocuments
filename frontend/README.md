# eiDocuments - Frontend

Frontend moderno e responsivo para a plataforma inteligente de armazenamento digital de documentos, construído com Next.js 15, React 19, TypeScript e Tailwind CSS.

## 🚀 Características

- **Design Moderno**: Interface elegante com gradientes, sombras e efeitos visuais
- **Totalmente Responsivo**: Funciona perfeitamente em todos os dispositivos
- **Validação em Tempo Real**: Formulários com validação instantânea
- **Animações Suaves**: Transições e animações CSS personalizadas
- **Sistema de Notificações**: Notificações elegantes para feedback do usuário
- **Tema Escuro**: Suporte completo para modo escuro
- **Componentes Reutilizáveis**: Biblioteca de componentes UI modernos

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface do usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS 4** - Framework CSS utilitário
- **Lucide React** - Ícones modernos e consistentes
- **tw-animate-css** - Animações CSS adicionais

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # Páginas da aplicação
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de registro
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes reutilizáveis
│   │   └── ui/               # Componentes de interface
│   │       ├── ModernInput.tsx
│   │       ├── ModernButton.tsx
│   │       ├── AuthCard.tsx
│   │       ├── AuthLink.tsx
│   │       ├── Notification.tsx
│   │       └── NotificationContainer.tsx
│   ├── hooks/                 # Hooks personalizados
│   │   ├── useAuthForm.ts
│   │   └── useNotification.ts
│   └── styles/                # Estilos globais
└── package.json
```

## 🎨 Componentes Principais

### ModernInput
Input moderno com validação, ícones e estados visuais.

```tsx
<ModernInput
  type="email"
  placeholder="Digite seu email"
  label="Email"
  required
  icon={<Mail className="h-5 w-5" />}
  error={error}
  success={isValid}
/>
```

### ModernButton
Botão com múltiplas variantes, estados de loading e animações.

```tsx
<ModernButton
  variant="primary"
  size="lg"
  loading={isLoading}
  fullWidth
  onClick={handleClick}
>
  Clique aqui
</ModernButton>
```

### AuthCard
Card elegante para páginas de autenticação com gradientes e efeitos.

```tsx
<AuthCard
  title="Bem-vindo de volta"
  subtitle="Entre na sua conta"
  type="login"
>
  {/* Conteúdo do formulário */}
</AuthCard>
```

### Notification
Sistema de notificações elegante com diferentes tipos.

```tsx
const { success, error, warning, info } = useNotification();

// Uso
success("Sucesso!", "Operação realizada com sucesso!");
error("Erro!", "Algo deu errado");
warning("Atenção!", "Ação requer confirmação");
info("Informação", "Dados atualizados");
```

## 🔧 Hooks Personalizados

### useAuthForm
Hook para gerenciar formulários de autenticação com validação.

```tsx
const { fields, errors, isValid, getFieldProps } = useAuthForm(
  { email: "", password: "" },
  {
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, minLength: 6 }
  }
);
```

### useNotification
Hook para gerenciar notificações de forma centralizada.

```tsx
const { success, error, warning, info } = useNotification();
```

## 🎭 Animações CSS

O projeto inclui animações CSS personalizadas:

- `animate-fade-in` - Fade in suave
- `animate-slide-in-left` - Deslizar da esquerda
- `animate-slide-in-right` - Deslizar da direita
- `animate-scale-in` - Escalar suavemente
- `animate-bounce-in` - Bounce elegante

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Construir para produção**:
   ```bash
   npm run build
   ```

4. **Executar em produção**:
   ```bash
   npm start
   ```

## 📱 Responsividade

O design é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🎨 Paleta de Cores

- **Primária**: Azul (#3B82F6)
- **Secundária**: Cinza (#6B7280)
- **Sucesso**: Verde (#10B981)
- **Erro**: Vermelho (#EF4444)
- **Aviso**: Amarelo (#F59E0B)
- **Info**: Azul (#3B82F6)

## 🔒 Validação de Formulários

- **Email**: Formato válido de email
- **Senha**: Mínimo 8 caracteres, letras maiúsculas/minúsculas, números
- **Nome**: Mínimo 2 caracteres, máximo 50
- **Confirmação de senha**: Deve coincidir com a senha

## 🌟 Funcionalidades Avançadas

- **Indicador de força da senha** em tempo real
- **Validação em tempo real** com feedback visual
- **Estados de loading** com spinners animados
- **Sistema de notificações** persistente
- **Animações de entrada** para todos os elementos
- **Efeitos de hover** interativos
- **Suporte a tema escuro** nativo

## 📝 Próximos Passos

- [ ] Integração com backend
- [ ] Sistema de autenticação real
- [ ] Páginas de dashboard
- [ ] Sistema de upload de documentos
- [ ] Busca e filtros avançados
- [ ] Histórico de atividades
- [ ] Configurações do usuário

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através de:
- 📧 Email: suporte@eidocuments.com
- 💬 Discord: [Link do servidor]
- 📱 WhatsApp: [Número de contato]

---

**Desenvolvido com ❤️ pela equipe eiDocuments**
