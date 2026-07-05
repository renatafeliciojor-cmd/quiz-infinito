# Roadmap do Projeto - Leve Chopp

## Status Atual: MVP - Fase 1 (Sprint 0-2/16)

### ✅ Concluído (Sprint 0)

#### Backend
- [x] Setup Fastify + TypeScript
- [x] Configuração Prisma ORM
- [x] Schema completo do banco (20+ modelos)
- [x] Autenticação JWT
- [x] AuthService (registro, login, refresh token)
- [x] AuthController com validação Zod
- [x] Rotas de autenticação
- [x] Logging com Pino

#### Frontend
- [x] Setup Next.js 14 + TypeScript
- [x] Tailwind CSS e PostCSS
- [x] Landing page com features
- [x] Login e Register pages
- [x] Dashboard layout com sidebar
- [x] Dashboard home com KPIs e gráficos
- [x] Stubs de todas as principais páginas
- [x] Recharts integration

#### DevOps & Config
- [x] Docker Compose (PostgreSQL, Redis, pgAdmin, MailHog)
- [x] Turbo monorepo setup
- [x] ESLint e Prettier
- [x] .env.example files
- [x] Documentação inicial (README, ARCHITECTURE)

---

## 📋 Próximas Etapas (Sprint 1-16)

### Sprint 1-2: Setup Avançado & Permissões (Semanas 3-4)

#### Backend
- [ ] Middleware de autenticação JWT
- [ ] Sistema de permissões por cargo
- [ ] Rate limiter
- [ ] Request logger
- [ ] Error handler global
- [ ] CORS configuration
- [ ] Health check melhorado

#### Frontend
- [ ] NextAuth.js integration
- [ ] Token refresh automático
- [ ] Protected routes
- [ ] Layout de auth
- [ ] Error boundaries
- [ ] Loading states
- [ ] Toast notifications

#### Database
- [ ] Primeira migração Prisma
- [ ] Seed data para desenvolvimento
- [ ] Índices otimizados

---

### Sprint 3-4: Gestão de Clientes (Semanas 5-6)

#### Backend
- [ ] Modelo Cliente (criar, ler, atualizar, deletar)
- [ ] ClienteService (lógica de negócio)
- [ ] ClienteRepository (acesso a dados)
- [ ] ClienteController com validações
- [ ] Rotas CRUD de clientes
- [ ] Busca e filtros
- [ ] Geolocalização (Google Maps Geocoding)

#### Frontend
- [ ] Página de listagem de clientes
- [ ] Formulário de novo cliente
- [ ] Página de detalhes do cliente
- [ ] Mapa com localização de clientes
- [ ] Search e filtros
- [ ] Edição inline
- [ ] Deleção com confirmação

#### Integrações
- [ ] Google Maps API (geocoding)
- [ ] Validação de CNPJ/CPF

---

### Sprint 5-6: Controle de Produtos & Estoque (Semanas 7-8)

#### Backend
- [ ] Modelo Produto
- [ ] Modelo Estoque
- [ ] MovimentacaoEstoque (auditoria)
- [ ] ProductoService e EstoqueService
- [ ] Validações de quantidade
- [ ] Alertas de estoque baixo
- [ ] Histórico de movimentação

#### Frontend
- [ ] Página de produtos
- [ ] Tabela de estoque por local
- [ ] Formulário de novo produto
- [ ] Movimentação de estoque (entrada/saída)
- [ ] Alertas visuais
- [ ] Histórico de movimentações

---

### Sprint 7-8: Controle de Pedidos (Semanas 9-10)

#### Backend
- [ ] Modelo Pedido e PedidoItem
- [ ] PedidoService
- [ ] Cálculo automático de valores
- [ ] Validação de estoque ao confirmar
- [ ] Status flow (rascunho → confirmado → entregue)
- [ ] Geração de número de pedido

#### Frontend
- [ ] Página de pedidos com filtros
- [ ] Formulário de novo pedido
- [ ] Seletor de cliente (autocomplete)
- [ ] Seletor de produtos
- [ ] Cálculo de valores em tempo real
- [ ] Rascunho auto-salvável
- [ ] Timeline de status

#### Jobs
- [ ] Enfileirar notificação WhatsApp ao confirmar
- [ ] Enfileirar email de confirmação

---

### Sprint 9-10: Sistema de Rotas & GPS (Semanas 11-12)

#### Backend
- [ ] Modelo Rota e RotaParada
- [ ] RotaService
- [ ] WebSocket para GPS em tempo real
- [ ] Otimização de rotas (OSRM ou Google)
- [ ] Registrar parada (foto, assinatura)
- [ ] Atualizar pedido status ao entregar

#### Frontend (Web)
- [ ] Página de rotas
- [ ] Mapa com paradas (Leaflet)
- [ ] Timeline de entregas
- [ ] Atribuição de pedidos a rotas
- [ ] Otimizador visual de rotas

#### Frontend (Mobile - React Native)
- [ ] App básico com autenticação
- [ ] GPS em tempo real
- [ ] Lista de paradas do dia
- [ ] Mapa com paradas
- [ ] Captura de foto + assinatura
- [ ] Registrar entrega

#### Rastreamento Público
- [ ] Página de rastreamento (sem login)
- [ ] Mapa com entregador em tempo real
- [ ] ETA dinâmica
- [ ] Histórico de paradas

---

### Sprint 11-12: Controle Financeiro (Semanas 13-14)

#### Backend
- [ ] Modelo Fatura e Recebimento
- [ ] FaturaService
- [ ] Geração automática de NF
- [ ] Integração com PIX/Boleto
- [ ] Cálculo de juros e multa
- [ ] Fluxo de caixa

#### Frontend
- [ ] Dashboard financeiro com KPIs
- [ ] Listagem de faturas
- [ ] Envio de boleto/PIX por WhatsApp
- [ ] Registrar recebimento
- [ ] Histórico de recebimentos
- [ ] Gráficos de fluxo de caixa

#### Integrações
- [ ] Stripe / PagSeguro (cartão)
- [ ] PIX (via banco)
- [ ] Boleto (via integrador)

---

### Sprint 13-14: WhatsApp & Marketing (Semanas 15-16)

#### Backend
- [ ] WhatsApp API Integration (Twilio/Evolution)
- [ ] MensagemWhatsapp model
- [ ] EnvioComunicacao model
- [ ] CampanhaMarketing model
- [ ] WhatsApp job queue
- [ ] Webhook para mensagens entrantes
- [ ] Templates de resposta rápida
- [ ] Histórico de conversas

#### Frontend
- [ ] Chat interface com clientes
- [ ] Listagem de conversas
- [ ] Envio de mensagens
- [ ] Templates rápidos
- [ ] Status de mensagem

#### Marketing
- [ ] Página de campanhas
- [ ] Criador de campanha (email, WhatsApp, SMS)
- [ ] Segmentação de público
- [ ] Agendamento
- [ ] Métricas de campanha

#### Jobs
- [ ] Envio assíncrono de WhatsApp
- [ ] Envio assíncrono de Email
- [ ] Envio assíncrono de SMS

---

### Sprint 15-16: Relatórios & Testes (Semanas 17-18)

#### Backend
- [ ] RelatorioService
- [ ] Queries otimizadas para relatórios
- [ ] Cache de relatórios
- [ ] Agendamento de relatórios

#### Frontend
- [ ] Dashboard de relatórios
- [ ] Filtros por período
- [ ] Exportação (PDF, Excel)
- [ ] Gráficos customizáveis
- [ ] Análise por cliente
- [ ] Análise por entregador
- [ ] Análise de estoque
- [ ] Análise financeira

#### Testes
- [ ] Testes unitários backend (70%+ coverage)
- [ ] Testes de API (e2e básicos)
- [ ] Testes de autenticação
- [ ] Testes de formulários frontend
- [ ] QA manual completo

#### Deploy
- [ ] Docker image para produção
- [ ] GitHub Actions CI/CD
- [ ] Variáveis de ambiente produção
- [ ] Backup automático
- [ ] Monitoramento (Sentry)
- [ ] Health checks
- [ ] Rollback strategy

---

## 📦 Fase 2 (Semanas 19-26) - Melhorias & CRM Avançado

### Funcionalidades
- [ ] CRM Avançado (scoring, pipeline, previsão de churn)
- [ ] Segmentação inteligente de clientes
- [ ] Relatórios com BI (Power BI/Metabase)
- [ ] Integração com ERP legacy
- [ ] API pública para parceiros
- [ ] Multi-currency support
- [ ] Dois fatores de autenticação
- [ ] Offline mode (PWA)
- [ ] Inteligência artificial (recomendações)

---

## 🎯 Milestones Principais

| Milestone | Data | Status |
|-----------|------|--------|
| Setup completo | 2026-07-19 | 🔄 Em Andamento |
| MVP Funcional | 2026-10-15 | ⏳ Planejado |
| Deploy Produção | 2026-11-01 | ⏳ Planejado |
| Fase 2 Beta | 2027-01-15 | ⏳ Planejado |

---

## 📊 Métricas de Sucesso

### Performance
- [ ] Response time < 200ms para APIs
- [ ] Page load < 3s
- [ ] 99.5% uptime
- [ ] < 0.1% taxa de erro

### Cobertura
- [ ] 70%+ testes unitários
- [ ] 50%+ testes integração
- [ ] 90%+ cobertura crítica

### UX
- [ ] 95%+ lighthouse score
- [ ] WCAG 2.1 AA compliance
- [ ] Mobile responsiveness 100%

---

## 🚀 Como Usar Este Roadmap

1. **Sprint Planning**: Use como referência para planning meetings
2. **Priorização**: Itens no topo têm maior prioridade
3. **Tracking**: Marque como concluído conforme progride
4. **Feedback**: Ajuste baseado em aprendizados

---

## 📝 Notas Importantes

- Datas são estimativas (podem variar ±20%)
- Cada sprint inclui 20% de buffer para bugs/refactoring
- Feedback de usuários pode mudar prioridades
- Performance é crítico em cada etapa (não deixar para depois)
- Testes devem ser implementados durante desenvolvimento, não depois

---

Última atualização: 2026-07-05
Versão: 0.1.0
