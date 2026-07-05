# Arquitetura do Sistema - Leve Chopp

## 1. Visão Geral

O Leve Chopp é um sistema de gestão completo para distribuição de chopp, construído com arquitetura modular de monorepo utilizando:

- **Frontend**: Next.js 14 com React 18
- **Backend**: Fastify com Prisma ORM
- **Database**: PostgreSQL 15 com PostGIS
- **Cache**: Redis 7
- **Real-time**: Socket.io
- **Jobs**: BullMQ

## 2. Camadas da Aplicação

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Next.js Components, Pages, API)       │
├─────────────────────────────────────────┤
│      Application Layer                  │
│  (Services, Controllers, Business Logic)│
├─────────────────────────────────────────┤
│       Data Access Layer                 │
│  (Repositories, Prisma ORM)             │
├─────────────────────────────────────────┤
│      Database Layer                     │
│  (PostgreSQL + PostGIS)                 │
└─────────────────────────────────────────┘
```

## 3. Frontend Architecture

### 3.1 Estrutura de Diretórios

```
apps/web/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Home
│   │   ├── auth/           # Auth pages
│   │   ├── dashboard/      # Protected routes
│   │   └── api/            # API routes
│   ├── components/          # React components
│   │   ├── common/         # Reusable components
│   │   ├── dashboard/      # Dashboard specific
│   │   ├── clientes/       # Customer related
│   │   ├── pedidos/        # Order related
│   │   └── rotas/          # Routes related
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API client
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilities
│   └── styles/             # CSS files
└── public/                 # Static assets
```

### 3.2 State Management

**Zustand** para state global simples:
- UI state (sidebar, theme, modals)
- Auth state (usuário logado)

**React Query** para server state:
- Caching automático
- Sincronização em background
- Revalidação inteligente

### 3.3 Fluxo de Dados

```
User Interaction
     ↓
React Component
     ↓
Zustand Hook / React Query
     ↓
API Client (Axios)
     ↓
Backend (Fastify)
```

## 4. Backend Architecture

### 4.1 Estrutura de Diretórios

```
services/api/
├── src/
│   ├── main.ts              # Entry point
│   ├── app.ts               # Fastify setup
│   ├── config/              # Configuration
│   ├── routes/              # API routes
│   ├── controllers/          # Request handlers
│   ├── services/            # Business logic
│   ├── repositories/        # Data access
│   ├── models/              # Validation schemas
│   ├── middleware/          # Fastify plugins
│   ├── jobs/                # Background jobs
│   ├── crons/               # Scheduled tasks
│   ├── utils/               # Utilities
│   ├── types/               # TypeScript types
│   ├── config/              # Environment config
│   └── websocket/           # WebSocket handlers
├── prisma/
│   └── schema.prisma        # Database schema
└── tests/                   # Test files
```

### 4.2 Padrão de Requisição

```
HTTP Request
    ↓
Middleware (auth, validation)
    ↓
Routes
    ↓
Controllers
    ↓
Services (business logic)
    ↓
Repositories (data access)
    ↓
Prisma ORM
    ↓
PostgreSQL
    ↓
[Response]
```

### 4.3 Autenticação

- **Método**: JWT (JSON Web Tokens)
- **Armazenamento**: Cookie seguro + localStorage
- **Refresh**: Token refresh automático com rotação
- **Proteção**: CSRF, HTTPOnly cookies, HTTPS obrigatório

## 5. Database Architecture

### 5.1 Principais Entidades

```
Empresa (raiz)
  ├── Usuários
  ├── Clientes
  │   ├── Pedidos
  │   ├── Faturas
  │   ├── Devoluções
  │   └── Mensagens WhatsApp
  ├── Produtos
  │   ├── Estoque
  │   └── Movimentações
  ├── Rotas
  │   └── Paradas
  ├── Campanhas Marketing
  └── Relatórios
```

### 5.2 Indexação

Índices criados em:
- `clientes.empresa_id`
- `clientes.cpf_cnpj`
- `clientes.status`
- `pedidos.cliente_id`
- `pedidos.status`
- `rotas.entregador_id`
- `rotas.data_rota`
- `faturas.cliente_id`
- `faturas.status`
- `estoques.quantidade` (para alertas)
- Índices geoespaciais (PostGIS) para mapas

## 6. Fluxos Críticos

### 6.1 Criação de Pedido

```
1. Vendedor acessa dashboard/pedidos/novo
2. Seleciona cliente e produtos
3. Sistema calcula valores (validar estoque)
4. Confirma pedido (status CONFIRMADO)
5. Job: Envia WhatsApp ao cliente
6. Job: Envia email de confirmação
7. Aguarda atribuição a rota
```

### 6.2 Execução de Entrega

```
1. Entregador inicia rota (status EM_EXECUCAO)
2. Sistema registra GPS em tempo real (WebSocket)
3. Cliente vê mapa atualizado em real-time
4. Entregador chega na parada
5. Captura foto + assinatura
6. Sistema atualiza pedido (ENTREGUE)
7. Job: Gera fatura automaticamente
8. Job: Envia boleto/PIX
9. Notifica cliente (WhatsApp)
```

### 6.3 Recebimento de Pagamento

```
1. Cliente efetua pagamento (PIX/Boleto)
2. Webhook recebe confirmação (banco/Stripe)
3. Sistema registra recebimento
4. Fatura marcada como PAGA
5. Fluxo de caixa atualizado
6. Job: Envia comprovante ao cliente
```

## 7. Integrações Externas

### 7.1 Twilio (WhatsApp)

- Webhook para mensagens entrantes
- Template management
- Envio assíncrono via Bull queue
- Fallback para SMS

### 7.2 Google Maps

- Geocoding (endereço → lat/lng)
- Directions (cálculo de rotas)
- Distance Matrix (distâncias)
- Maps SDK (visualização)

### 7.3 Pagamento

- Stripe / PagSeguro (cartão)
- PIX (via banco direto)
- Boleto (via integrador)

### 7.4 Email

- SendGrid (campanhas)
- Nodemailer (transacional)
- MailHog (desenvolvimento)

## 8. Performance & Escalabilidade

### 8.1 Caching Strategy

```
L1: Browser Cache (static assets, 1 ano)
L2: Redis Cache (dados quentes, 5 min)
L3: Database Indexes (queries otimizadas)
L4: CDN (imagens, 24 horas)
```

### 8.2 Background Jobs

BullMQ processa:
- Envios WhatsApp (async)
- Envios Email
- SMS
- Geração de relatórios
- Sincronização de estoque
- Backups

### 8.3 Real-time Communication

Socket.io mantém conexão aberta para:
- Atualização de localização (GPS)
- Notificações de pedido
- Chat WhatsApp
- Dashboard em tempo real

## 9. Segurança

### 9.1 Frontend

- HTTPS obrigatório
- CSP (Content Security Policy)
- XSS protection
- CSRF tokens
- Input validation com Zod

### 9.2 Backend

- Rate limiting (10 req/min por IP)
- SQL Injection protection (ORM)
- CORS whitelist
- JWT validation
- Request logging
- Audit logs

### 9.3 Database

- Encrypted connections
- Backups automáticos
- Read replicas
- User permission management
- Encryption at rest (opcional)

## 10. Deployment

### 10.1 Development

```bash
docker-compose up          # Local environment
npm run dev               # Hot reload
npm run db:migrate        # Database migrations
```

### 10.2 Production

```
GitHub Actions CI/CD
    ↓
Build Docker images
    ↓
Run tests
    ↓
Push to registry
    ↓
Deploy to AWS/DigitalOcean
    ↓
Database migrations
    ↓
Health checks
```

### 10.3 Monitoring

- Sentry (error tracking)
- DataDog/New Relic (APM)
- ELK Stack (logs)
- Prometheus (metrics)

## 11. Escalabilidade Futura

### Fase 2+

- Load balancing com nginx/HAProxy
- Database replication
- Redis cluster
- Message queue (RabbitMQ)
- API Gateway
- Microservices (por domínio)
- GraphQL API

---

Documento atualizado: 2026-07-05
