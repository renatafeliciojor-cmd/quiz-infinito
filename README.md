# 🍺 LEVE CHOPP - Sistema de Gestão de Distribuição

Sistema completo e moderno de gestão para empresas de distribuição de chopp em Belo Horizonte e região.

## 📋 Funcionalidades

- ✅ **Gestão de Clientes** - CRM com prospecção e histórico de compras
- ✅ **Controle de Pedidos** - Criação, confirmação e rastreamento
- ✅ **Sistema de Rotas** - Otimização com GPS em tempo real
- ✅ **Controle de Estoque** - Gerenciamento por local, alertas automáticos
- ✅ **Financeiro** - Faturas, PIX, boleto e controle de fluxo de caixa
- ✅ **WhatsApp API** - Comunicação direta com clientes
- ✅ **Relatórios** - Dashboards e análises em tempo real
- ✅ **Marketing** - Campanhas por email, SMS e WhatsApp
- ✅ **App Móvel** - Entregador + rastreamento de cliente

## 🏗️ Arquitetura

```
leve-chopp/
├── apps/
│   ├── web/              # Frontend (Next.js)
│   └── mobile/           # App Móvel (React Native)
├── services/
│   └── api/              # Backend (Fastify + Prisma)
├── packages/
│   ├── types/            # Types compartilhadas
│   └── utils/            # Utilitários compartilhados
└── docs/                 # Documentação
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/renatafeliciojor-cmd/quiz-infinito.git
cd quiz-infinito
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cd services/api && cp .env.example .env
cd ../../apps/web && cp .env.example .env
```

4. **Inicie os serviços com Docker**
```bash
docker-compose up -d
```

5. **Execute migrações do banco de dados**
```bash
npm run db:migrate
```

6. **Inicie o desenvolvimento**
```bash
npm run dev
```

### URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Banco de Dados**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050

## 📦 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18 + Tailwind CSS
- **State Management**: Zustand + React Query
- **Autenticação**: NextAuth.js
- **Validação**: React Hook Form + Zod
- **Mapas**: Leaflet + React Leaflet
- **Gráficos**: Recharts
- **Real-time**: Socket.io

### Backend
- **Framework**: Fastify 4
- **ORM**: Prisma 5
- **Database**: PostgreSQL 15 + PostGIS
- **Cache**: Redis 7
- **Jobs**: BullMQ
- **Auth**: JWT + Passport.js
- **Comunicação**: Twilio (WhatsApp)
- **Logging**: Pino

## 🎯 Roadmap (MVP - 16 semanas)

### Sprint 1-2: Setup + Autenticação
- [ ] Infraestrutura e CI/CD
- [ ] Sistema de autenticação JWT
- [ ] Dashboard básico
- [ ] Permissões por cargo

### Sprint 3-4: Gestão de Clientes
- [ ] CRUD de clientes
- [ ] Mapa de clientes
- [ ] Histórico de compras
- [ ] CRM básico

### Sprint 5-6: Controle de Pedidos
- [ ] Criação e confirmação de pedidos
- [ ] Cálculo automático de valores
- [ ] Notificação WhatsApp
- [ ] Status de pedido

### Sprint 7-8: Rotas e Entregas
- [ ] Sistema de rotas
- [ ] GPS em tempo real
- [ ] Assinatura digital
- [ ] Rastreamento público

### Sprint 9-10: Financeiro
- [ ] Geração de faturas
- [ ] Integração PIX/Boleto
- [ ] Controle de recebimentos
- [ ] Fluxo de caixa

### Sprint 11-12: Marketing + WhatsApp
- [ ] Chat WhatsApp
- [ ] Campanhas de email
- [ ] Templates de mensagem
- [ ] Histórico de comunicações

### Sprint 13-14: Mobile App
- [ ] App React Native
- [ ] GPS do entregador
- [ ] Offline mode
- [ ] Notificações push

### Sprint 15-16: Testes + Deploy
- [ ] Testes unitários e integração
- [ ] QA e bug fixes
- [ ] Documentação
- [ ] Deploy em produção

## 📖 Documentação

- [Architecture](./docs/ARCHITECTURE.md) - Detalhes técnicos
- [API](./docs/API.md) - Documentação de endpoints
- [Database](./docs/DATABASE.md) - Schema e migrações
- [Deployment](./docs/DEPLOYMENT.md) - Guia de deploy

## 🔒 Segurança

- HTTPS/TLS obrigatório
- Validação de input com Zod
- Proteção contra XSS, CSRF, SQL Injection
- Rate limiting
- Autenticação JWT com refresh tokens
- Criptografia de dados sensíveis
- Audit logs
- LGPD compliance

## 📊 Performance

- Cache com Redis
- Índices otimizados no banco
- Lazy loading de componentes
- Code splitting automático
- WebSockets para real-time
- Job queue para processamento assíncrono
- Compressão Gzip/Brotli

## 🧪 Testes

```bash
# Testes backend
cd services/api
npm test

# Testes frontend
cd apps/web
npm test

# E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Contribuindo

1. Crie uma branch `feature/sua-feature`
2. Commit com mensagens claras
3. Push e abra um Pull Request
4. Aguarde review

## 🐛 Reportar Bugs

Abra uma issue com:
- Descrição do bug
- Passos para reproduzir
- Comportamento esperado vs. atual
- Prints/logs se aplicável

## 📄 Licença

Proprietário - Leve Chopp

## 👥 Time

- **Arquitetura**: Claude AI
- **Coordenação**: Renata Felício

## 📞 Suporte

- Email: suporte@levechopp.com.br
- WhatsApp: [configurar]
- Documentação: https://docs.levechopp.com.br

---

**Versão**: 0.1.0  
**Status**: Em Desenvolvimento  
**Data de Início**: 2026-07-05  
**Próximas Milestones**: MVP em 4 meses
