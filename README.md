# Gestão MVP 🚀

O **Gestão MVP** é uma plataforma web completa para administração de projetos sociais, focada na gestão de alunos, oficinas, e controle administrativo. Desenvolvido com tecnologias modernas, oferece uma experiência de usuário fluida, segura e responsiva.

## 📋 Funcionalidades Principais

### 🔒 Autenticação e Segurança
- **Login Seguro**: Autenticação via Email/Senha utilizando Firebase Auth.
- **Controle de Acesso (RBAC)**: Diferenciação clara entre **Administradores** e **Usuários** comuns.
- **Proteção de Rotas**: Redirecionamento inteligente baseado em permissões.
- **Recuperação de Senha**: Fluxo automatizado de redefinição de senha via e-mail.

### 👥 Gestão de Usuários (Painel Admin)
- **Dashboard Administrativo**: Visão geral com atalhos rápidos.
- **CRUD de Usuários**: Criação, Listagem, Edição e Bloqueio de usuários.
- **Criação Automatizada**: Criação de contas de sistema com sincronização automática entre Auth e Database via Cloud Functions.

### 🎓 Gestão de Alunos e Oficinas
- **Cadastro Completo**: Registro detalhado de alunos com dados pessoais e de contato.
- **Matrícula em Oficinas**: Associação de alunos a atividades (ex: Vôlei, Futsal, Dança).
- **Lista de Chamada**: (Em desenvolvimento) Controle de frequência.

### ⚙️ Configurações Dinâmicas
- **Personalização**: O administrador pode definir quais oficinas e níveis estão disponíveis no sistema.
- **Arraste e Solte (Drag & Drop)**: Interface intuitiva para reordenar listas de oficinas e níveis.


### 📊 Relatórios
- **Visualização de Dados**: Gráficos e indicadores sobre a distribuição de alunos por oficina.
- **Relatórios PDF**: Geração de listas de professores e alunos em formato PDF para impressão ou arquivamento.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/) (Estilização)
- [React Router DOM](https://reactrouter.com/) (Navegação)
- [React Toastify](https://fkhadra.github.io/react-toastify/) (Notificações)
- [React Icons](https://react-icons.github.io/react-icons/) (Ícones)
- [Recharts](https://recharts.org/) (Gráficos)
- [Dnd Kit](https://dndkit.com/) (Drag and Drop)
- [jsPDF](https://github.com/parallax/jsPDF) (Geração de PDF)

**Backend & Infraestrutura (Serverless):**
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore) (Banco de dados NoSQL)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Conta no Google Firebase

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/DevGabriel0402/gestao-mvp.git
   cd gestao-mvp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   - Crie um projeto no [Console do Firebase](https://console.firebase.google.com/).
   - Crie um app Web e copie as configurações (`apiKey`, `authDomain`, etc).
   - Cole as configurações no arquivo `src/servicos/firebase.ts`.

4. **Execute localmente**
   ```bash
   npm run dev
   ```
   O projeto estará rodando em `http://localhost:5173`.

## ☁️ Cloud Functions (Backend)

O backend do sistema reside na pasta `/functions`. Para fazer o deploy das funções:

1. Entre na pasta:
   ```bash
   cd functions
   npm install
   ```
2. Faça o deploy (necessário ter o `firebase-tools` instalado globalmente):
   ```bash
   firebase deploy --only functions
   ```

## 🔐 Regras e Permissões

O sistema utiliza Custom Claims para definir o papel do usuário (`administrador` ou `usuario`). As regras de segurança do Firestore (`firestore.rules`) garantem que apenas administradores possam gerenciar usuários do sistema, enquanto usuários comuns gerenciam apenas os dados dos alunos.

## 📱 PWA (Progressive Web App)

O projeto inclui um manifesto web (`manifest.json`) e ícones configurados, permitindo que seja instalado como um aplicativo nativo em dispositivos móveis e desktop.

---

Desenvolvido com 💙 por [Gabriel](https://github.com/DevGabriel0402)
