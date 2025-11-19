# Aura+ 💙

> Conectando pessoas e fortalecendo equipes através do bem-estar e reconhecimento

## 📱 Sobre o Projeto

O **Aura+** é um aplicativo mobile desenvolvido para fortalecer a cultura organizacional, mantendo os colaboradores conectados e engajados. A plataforma permite que os funcionários compartilhem seus sentimentos diários, reconheçam colegas de equipe e acompanhem o clima emocional do ambiente de trabalho.

Este projeto foi desenvolvido como parte da **Global Solution 2025-2** da FIAP, aplicando as melhores práticas de desenvolvimento mobile moderno.

## 👨‍💻 Desenvolvedores

Este projeto foi desenvolvido por:

- **Arthur Spedine** - RM 554489

  - GitHub: [@arthurspedine](https://github.com/arthurspedine)

- **Gabriel Falanga** - RM 555061

  - GitHub: [@gabrielfalanga](https://github.com/gabrielfalanga)

- **Matheus Esteves** - RM 554769
  - GitHub: [@matheus-esteves10](https://github.com/matheus-esteves10)

## 🎯 Nossa Missão

O Aura+ nasceu da observação de um problema real nas empresas: a dificuldade em manter os colaboradores engajados e conectados com a cultura organizacional. Queremos criar um ambiente onde cada colaborador se sinta valorizado e ouvido, contribuindo para equipes mais unidas e produtivas.

## ✨ Funcionalidades

### 🎭 Registro de Sentimentos

- Registre como você está se sentindo diariamente
- 5 opções de humor: Muito Triste, Triste, Neutro, Feliz, Muito Feliz
- Adicione descrições opcionais sobre seu dia
- Histórico de sentimentos registrados
- Limitação de um registro por dia

### 👥 Gestão de Equipes

- Visualize todos os membros da sua equipe
- Lista paginada com informações de cada colaborador
- Navegação rápida para a equipe através do perfil
- Informações detalhadas: nome, email, cargo

### 🏆 Reconhecimentos

- Reconheça colegas de equipe pelo bom trabalho
- Envie reconhecimentos com título e descrição
- Interface intuitiva com modal dedicado
- Validação de campos obrigatórios

### 👤 Perfil do Usuário

- Visualize suas informações pessoais
- Altere sua senha de forma segura
- Veja seu cargo e equipe
- Interface elegante e moderna

### 🔐 Autenticação Segura

- Login com email e senha
- Registro de novos usuários
- Tokens JWT para segurança
- Persistência de sessão com AsyncStorage

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** (~54.0.25) - Plataforma de desenvolvimento
- **Expo Router** (~6.0.15) - Roteamento baseado em arquivos
- **TypeScript** - Tipagem estática
- **NativeWind** - TailwindCSS para React Native
- **Expo Asset** - Gerenciamento de assets
- **AsyncStorage** - Persistência local de dados

## 🎨 Design System

### Paleta de Cores

- **Background**: `#111111`
- **Card**: `#222222`
- **Primary**: `#1F89DA` (Azul)
- **Text**: Branco/Cinza claro
- **Muted**: `#999999`

### Componentes

- Cards com bordas arredondadas (`rounded-2xl`, `rounded-3xl`)
- Tema escuro consistente
- Ícones do Ionicons
- Tipografia clara e legível
- Feedback visual em todas as interações

## 🔌 API Backend

O aplicativo se conecta a uma API REST que gerencia:

- Autenticação de usuários
- Gerenciamento de sentimentos
- Gestão de equipes
- Sistema de reconhecimentos

### Endpoints Principais

- `POST /login` - Autenticação
- `POST /register` - Registro de usuário
- `GET /usuario/me` - Dados do usuário logado
- `POST /sentimento` - Registrar sentimento
- `GET /sentimento` - Buscar sentimento do dia
- `GET /equipe/usuarios` - Listar membros da equipe
- `POST /reconhecimento/{id}` - Enviar reconhecimento

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da Global Solution 2025-2 da FIAP.

---

**© 2025 Aura+. Todos os direitos reservados.**

Desenvolvido com 💙 por Arthur Spedine, Gabriel Falanga e Matheus Esteves
