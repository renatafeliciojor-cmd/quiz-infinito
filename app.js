/* ============================================================
   Leve Chopp — Aplicação (SPA)
   ============================================================ */

/* ---------- Utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const money = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const num = (n) => (n || 0).toLocaleString('pt-BR');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const fmtData = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
const hoje = () => new Date().toISOString().slice(0, 10);
const mesAtual = () => hoje().slice(0, 7);

function toast(msg, type = '') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    clearTimeout(t._t);
    t._t = setTimeout(() => (t.className = 'toast'), 2600);
}

/* ---------- Modal ---------- */
const Modal = {
    open(title, bodyHTML) {
        $('#modalTitle').textContent = title;
        $('#modalBody').innerHTML = bodyHTML;
        $('#modal').classList.add('open');
        $('#modal').setAttribute('aria-hidden', 'false');
    },
    close() {
        $('#modal').classList.remove('open');
        $('#modal').setAttribute('aria-hidden', 'true');
        $('#modalBody').innerHTML = '';
    }
};
$('#modalClose').onclick = Modal.close;
$('#modal').onclick = (e) => { if (e.target.id === 'modal') Modal.close(); };

/* ---------- Cálculos de negócio ---------- */
const Calc = {
    nomeCliente(id) { const c = DB.find('clientes', id); return c ? c.nome : 'Consumidor'; },
    nomeProduto(id) { const p = DB.find('produtos', id); return p ? p.nome : '—'; },
    vendasDoMes(ym = mesAtual()) { return DB.get().vendas.filter(v => v.data.startsWith(ym)); },
    faturamentoMes(ym) { return this.vendasDoMes(ym).reduce((s, v) => s + v.total, 0); },
    faturamentoDia(dia = hoje()) { return DB.get().vendas.filter(v => v.data === dia).reduce((s, v) => s + v.total, 0); },
    despesasMes(ym = mesAtual()) { return DB.get().despesas.filter(d => d.data.startsWith(ym)).reduce((s, d) => s + d.valor, 0); },
    aReceber() { return DB.get().vendas.filter(v => !v.pago).reduce((s, v) => s + v.total, 0); },
    estoqueBaixo() { return DB.get().produtos.filter(p => p.estoque <= p.estoqueMin); },
    custoVendasMes(ym = mesAtual()) {
        return this.vendasDoMes(ym).reduce((s, v) => s + v.itens.reduce((si, it) => {
            const p = DB.find('produtos', it.produtoId); return si + (p ? p.custo * it.qtd : 0);
        }, 0), 0);
    },
    // Top produtos por receita (todos os tempos)
    topProdutos(limit = 5) {
        const map = {};
        DB.get().vendas.forEach(v => v.itens.forEach(it => {
            map[it.produtoId] = (map[it.produtoId] || 0) + it.preco * it.qtd;
        }));
        return Object.entries(map).map(([id, total]) => ({ id, total, nome: this.nomeProduto(id) }))
            .sort((a, b) => b.total - a.total).slice(0, limit);
    },
    // Faturamento dos últimos N dias
    serieDias(n = 7) {
        const out = [];
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const iso = d.toISOString().slice(0, 10);
            const total = DB.get().vendas.filter(v => v.data === iso).reduce((s, v) => s + v.total, 0);
            out.push({ dia: iso.slice(8) + '/' + iso.slice(5, 7), total });
        }
        return out;
    }
};

/* ============================================================
   VIEWS
   ============================================================ */
const Views = {

    /* ---------------- Dashboard ---------------- */
    dashboard() {
        const fatMes = Calc.faturamentoMes();
        const meta = DB.get().empresa.metaMensal || 0;
        const pct = meta ? Math.min(100, Math.round(fatMes / meta * 100)) : 0;
        const lucro = fatMes - Calc.custoVendasMes() - Calc.despesasMes();
        const baixo = Calc.estoqueBaixo();
        const serie = Calc.serieDias(7);
        const maxSerie = Math.max(1, ...serie.map(s => s.total));
        const top = Calc.topProdutos(5);
        const maxTop = Math.max(1, ...top.map(t => t.total));
        const pendentes = DB.get().vendas.filter(v => !v.pago);

        return `
        <div class="kpi-grid">
            <div class="kpi">
                <div class="k-label">💵 Faturamento (mês)</div>
                <div class="k-value">${money(fatMes)}</div>
                <div class="k-sub">Meta: ${money(meta)} · ${pct}%</div>
            </div>
            <div class="kpi green">
                <div class="k-label">📈 Lucro estimado (mês)</div>
                <div class="k-value">${money(lucro)}</div>
                <div class="k-sub">Receita − custos − despesas</div>
            </div>
            <div class="kpi blue">
                <div class="k-label">🧾 Vendas hoje</div>
                <div class="k-value">${money(Calc.faturamentoDia())}</div>
                <div class="k-sub">${DB.get().vendas.filter(v => v.data === hoje()).length} pedido(s)</div>
            </div>
            <div class="kpi red">
                <div class="k-label">⏳ A receber</div>
                <div class="k-value">${money(Calc.aReceber())}</div>
                <div class="k-sub">${pendentes.length} pedido(s) em aberto</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="panel">
                <div class="panel-head"><h2>Faturamento — últimos 7 dias</h2></div>
                <div class="panel-body">
                    <div class="chart-cols">
                        ${serie.map(s => `
                            <div class="chart-col" title="${money(s.total)}">
                                <span class="amt">${s.total ? 'R$' + Math.round(s.total) : ''}</span>
                                <div class="col" style="height:${Math.round(s.total / maxSerie * 100)}%"></div>
                                <span class="lbl">${s.dia}</span>
                            </div>`).join('')}
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="panel-head"><h2>Top produtos (receita)</h2></div>
                <div class="panel-body">
                    <div class="bars">
                        ${top.length ? top.map(t => `
                            <div class="bar-row">
                                <span>${esc(t.nome)}</span>
                                <div class="bar-track"><div class="bar-fill" style="width:${Math.round(t.total / maxTop * 100)}%"></div></div>
                                <span class="bar-val">${money(t.total)}</span>
                            </div>`).join('') : '<div class="empty">Sem vendas ainda</div>'}
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="panel">
                <div class="panel-head">
                    <h2>⚠️ Estoque baixo</h2>
                    <a class="btn ghost sm" href="#/produtos">Ver estoque</a>
                </div>
                <div class="panel-body tight">
                    ${baixo.length ? `<div class="table-wrap"><table>
                        <thead><tr><th>Produto</th><th class="num">Estoque</th><th class="num">Mínimo</th></tr></thead>
                        <tbody>${baixo.map(p => `<tr>
                            <td>${esc(p.nome)}</td>
                            <td class="num"><span class="tag red">${num(p.estoque)} ${p.unidade}</span></td>
                            <td class="num">${num(p.estoqueMin)} ${p.unidade}</td>
                        </tr>`).join('')}</tbody></table></div>`
                        : '<div class="empty"><span class="big">✅</span>Tudo abastecido!</div>'}
                </div>
            </div>
            <div class="panel">
                <div class="panel-head">
                    <h2>Contas a receber</h2>
                    <a class="btn ghost sm" href="#/financeiro">Financeiro</a>
                </div>
                <div class="panel-body tight">
                    ${pendentes.length ? `<div class="table-wrap"><table>
                        <thead><tr><th>Cliente</th><th>Data</th><th class="num">Valor</th></tr></thead>
                        <tbody>${pendentes.map(v => `<tr>
                            <td>${esc(Calc.nomeCliente(v.clienteId))}</td>
                            <td>${fmtData(v.data)}</td>
                            <td class="num">${money(v.total)}</td>
                        </tr>`).join('')}</tbody></table></div>`
                        : '<div class="empty"><span class="big">👍</span>Nada em aberto</div>'}
                </div>
            </div>
        </div>`;
    },

    /* ---------------- PDV ---------------- */
    pdv() {
        const prods = DB.get().produtos;
        return `
        <div class="pdv-grid">
            <div>
                <div class="panel">
                    <div class="panel-head"><h2>Selecione os produtos</h2></div>
                    <div class="panel-body">
                        <div class="prod-pick" id="pdvProds">
                            ${prods.map(p => `
                                <button class="prod-card" data-add="${p.id}" ${p.estoque <= 0 ? 'disabled style="opacity:.5"' : ''}>
                                    <div class="pc-name">${esc(p.nome)}</div>
                                    <div class="pc-price">${money(p.preco)}<span class="muted" style="font-weight:400;font-size:.8em">/${p.unidade}</span></div>
                                    <div class="pc-stock">Estoque: ${num(p.estoque)} ${p.unidade}</div>
                                </button>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart">
                <div class="cart-head">🛒 Pedido atual</div>
                <div class="cart-items" id="cartItems"><div class="empty" style="padding:26px">Carrinho vazio</div></div>
                <div class="cart-foot">
                    <div class="field" style="margin-bottom:10px">
                        <label>Cliente</label>
                        <select id="pdvCliente">
                            <option value="">Consumidor final</option>
                            ${DB.get().clientes.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="field-row">
                        <div class="field" style="margin-bottom:10px">
                            <label>Entrega</label>
                            <select id="pdvEntrega"><option>Retirada</option><option>Delivery</option><option>Evento</option></select>
                        </div>
                        <div class="field" style="margin-bottom:10px">
                            <label>Pagamento</label>
                            <select id="pdvPago"><option value="1">À vista (pago)</option><option value="0">A prazo</option></select>
                        </div>
                    </div>
                    <div class="cart-total"><span>Total</span><span id="cartTotal">R$ 0,00</span></div>
                    <button class="btn block" id="pdvFinalizar">✅ Finalizar venda</button>
                </div>
            </div>
        </div>`;
    },

    pdvMount() {
        let cart = {}; // produtoId -> qtd
        const render = () => {
            const items = Object.entries(cart);
            const box = $('#cartItems');
            if (!items.length) { box.innerHTML = '<div class="empty" style="padding:26px">Carrinho vazio</div>'; $('#cartTotal').textContent = money(0); return; }
            let total = 0;
            box.innerHTML = items.map(([id, qtd]) => {
                const p = DB.find('produtos', id); total += p.preco * qtd;
                return `<div class="cart-item">
                    <span class="ci-name">${esc(p.nome)}<br><span class="muted" style="font-size:.85em">${money(p.preco)} × ${qtd}</span></span>
                    <span class="qty">
                        <button data-dec="${id}">−</button><b>${qtd}</b><button data-inc="${id}">+</button>
                    </span>
                </div>`;
            }).join('');
            $('#cartTotal').textContent = money(total);
        };
        const change = (id, delta) => {
            const p = DB.find('produtos', id);
            const next = (cart[id] || 0) + delta;
            if (next > p.estoque) { toast('Estoque insuficiente', 'err'); return; }
            if (next <= 0) delete cart[id]; else cart[id] = next;
            render();
        };
        $('#pdvProds').onclick = (e) => { const b = e.target.closest('[data-add]'); if (b) change(b.dataset.add, 1); };
        $('#cartItems').onclick = (e) => {
            if (e.target.dataset.inc) change(e.target.dataset.inc, 1);
            if (e.target.dataset.dec) change(e.target.dataset.dec, -1);
        };
        $('#pdvFinalizar').onclick = () => {
            const itens = Object.entries(cart).map(([id, qtd]) => { const p = DB.find('produtos', id); return { produtoId: id, qtd, preco: p.preco }; });
            if (!itens.length) { toast('Adicione produtos ao pedido', 'err'); return; }
            const total = itens.reduce((s, it) => s + it.preco * it.qtd, 0);
            const venda = {
                data: hoje(),
                clienteId: $('#pdvCliente').value,
                itens, total,
                pago: $('#pdvPago').value === '1',
                entrega: $('#pdvEntrega').value
            };
            DB.upsert('vendas', venda);
            // baixa de estoque
            itens.forEach(it => { const p = DB.find('produtos', it.produtoId); p.estoque = Math.max(0, p.estoque - it.qtd); });
            DB.save();
            cart = {};
            toast('Venda registrada: ' + money(total), 'ok');
            Router.go('pedidos');
        };
        render();
    },

    /* ---------------- Pedidos ---------------- */
    pedidos() {
        const vendas = [...DB.get().vendas].sort((a, b) => b.data.localeCompare(a.data));
        return `
        <div class="panel">
            <div class="panel-head">
                <h2>Pedidos (${vendas.length})</h2>
                <a class="btn" href="#/pdv">+ Nova venda</a>
            </div>
            <div class="panel-body tight">
                ${vendas.length ? `<div class="table-wrap"><table>
                    <thead><tr><th>Data</th><th>Cliente</th><th>Itens</th><th>Entrega</th><th class="num">Total</th><th>Status</th><th></th></tr></thead>
                    <tbody>${vendas.map(v => `<tr>
                        <td>${fmtData(v.data)}</td>
                        <td>${esc(Calc.nomeCliente(v.clienteId))}</td>
                        <td class="muted">${v.itens.map(i => `${i.qtd}× ${esc(Calc.nomeProduto(i.produtoId))}`).join(', ')}</td>
                        <td><span class="tag gray">${esc(v.entrega)}</span></td>
                        <td class="num">${money(v.total)}</td>
                        <td>${v.pago ? '<span class="tag green">Pago</span>' : '<span class="tag red">Em aberto</span>'}</td>
                        <td class="num">
                            ${v.pago ? '' : `<button class="btn sm" data-pagar="${v.id}">Receber</button>`}
                            <button class="icon-btn" data-del-venda="${v.id}" title="Excluir">🗑</button>
                        </td>
                    </tr>`).join('')}</tbody></table></div>`
                    : '<div class="empty"><span class="big">🧾</span>Nenhum pedido ainda</div>'}
            </div>
        </div>`;
    },
    pedidosMount() {
        $('#view').onclick = (e) => {
            const pg = e.target.dataset.pagar;
            if (pg) { const v = DB.find('vendas', pg); v.pago = true; DB.save(); toast('Pagamento recebido', 'ok'); Router.render(); }
            const del = e.target.dataset.delVenda;
            if (del) confirmar('Excluir este pedido?', () => { DB.remove('vendas', del); toast('Pedido excluído'); Router.render(); });
        };
    },

    /* ---------------- Produtos ---------------- */
    produtos() {
        const prods = DB.get().produtos;
        return `
        <div class="panel">
            <div class="panel-head">
                <h2>Produtos &amp; Estoque</h2>
                <div class="toolbar">
                    <input class="search" id="prodSearch" placeholder="🔎 Buscar produto...">
                    <button class="btn" data-novo-prod>+ Novo produto</button>
                </div>
            </div>
            <div class="panel-body tight">
                <div class="table-wrap"><table>
                    <thead><tr><th>Produto</th><th>Tipo</th><th class="num">Preço</th><th class="num">Custo</th><th class="num">Margem</th><th>Estoque</th><th></th></tr></thead>
                    <tbody id="prodRows">${this._prodRows(prods)}</tbody>
                </table></div>
            </div>
        </div>`;
    },
    _prodRows(prods) {
        if (!prods.length) return '<tr><td colspan="7"><div class="empty">Nenhum produto</div></td></tr>';
        return prods.map(p => {
            const margem = p.preco ? Math.round((p.preco - p.custo) / p.preco * 100) : 0;
            const ratio = p.estoqueMin ? Math.min(100, Math.round(p.estoque / (p.estoqueMin * 2) * 100)) : 100;
            const cls = p.estoque <= p.estoqueMin ? 'low' : (p.estoque <= p.estoqueMin * 1.5 ? 'mid' : '');
            return `<tr>
                <td><strong>${esc(p.nome)}</strong></td>
                <td><span class="tag amber">${esc(p.tipo)}</span></td>
                <td class="num">${money(p.preco)}</td>
                <td class="num">${money(p.custo)}</td>
                <td class="num">${margem}%</td>
                <td><span class="progress ${cls}"><span style="width:${ratio}%"></span></span> ${num(p.estoque)} ${p.unidade}</td>
                <td class="num">
                    <button class="btn ghost sm" data-repor="${p.id}">Repor</button>
                    <button class="icon-btn" data-edit-prod="${p.id}" title="Editar">✏️</button>
                    <button class="icon-btn" data-del-prod="${p.id}" title="Excluir">🗑</button>
                </td>
            </tr>`;
        }).join('');
    },
    produtosMount() {
        const filtrar = () => {
            const q = $('#prodSearch').value.toLowerCase();
            const list = DB.get().produtos.filter(p => p.nome.toLowerCase().includes(q) || p.tipo.toLowerCase().includes(q));
            $('#prodRows').innerHTML = this._prodRows(list);
        };
        $('#prodSearch').oninput = filtrar;
        $('#view').onclick = (e) => {
            if (e.target.dataset.novoProd !== undefined && e.target.hasAttribute('data-novo-prod')) return Forms.produto();
            const ed = e.target.dataset.editProd; if (ed) return Forms.produto(DB.find('produtos', ed));
            const rp = e.target.dataset.repor; if (rp) return Forms.repor(DB.find('produtos', rp));
            const del = e.target.dataset.delProd;
            if (del) confirmar('Excluir este produto?', () => { DB.remove('produtos', del); toast('Produto excluído'); Router.render(); });
        };
    },

    /* ---------------- Chopeiras / Locação ---------------- */
    chopeiras() {
        const chs = DB.get().chopeiras;
        const locs = [...DB.get().locacoes].sort((a, b) => b.inicio.localeCompare(a.inicio));
        const statusTag = (s) => ({
            disponivel: '<span class="tag green">Disponível</span>',
            alugada: '<span class="tag amber">Alugada</span>',
            manutencao: '<span class="tag red">Manutenção</span>'
        }[s] || s);
        return `
        <div class="grid-2">
            <div class="panel">
                <div class="panel-head"><h2>Equipamentos</h2><button class="btn sm" data-nova-chop>+ Chopeira</button></div>
                <div class="panel-body tight"><div class="table-wrap"><table>
                    <thead><tr><th>Equipamento</th><th>Código</th><th>Status</th><th></th></tr></thead>
                    <tbody>${chs.map(c => `<tr>
                        <td><strong>${esc(c.nome)}</strong></td>
                        <td class="muted">${esc(c.codigo)}</td>
                        <td>${statusTag(c.status)}</td>
                        <td class="num">
                            ${c.status === 'disponivel' ? `<button class="btn sm" data-alugar="${c.id}">Alugar</button>` : ''}
                            <button class="icon-btn" data-del-chop="${c.id}" title="Excluir">🗑</button>
                        </td>
                    </tr>`).join('')}</tbody>
                </table></div></div>
            </div>
            <div class="panel">
                <div class="panel-head"><h2>Locações</h2></div>
                <div class="panel-body tight"><div class="table-wrap"><table>
                    <thead><tr><th>Chopeira</th><th>Cliente</th><th>Período</th><th class="num">Valor</th><th></th></tr></thead>
                    <tbody>${locs.length ? locs.map(l => {
                        const ch = DB.find('chopeiras', l.chopeiraId);
                        const dias = Math.max(1, Math.round((new Date(l.fim) - new Date(l.inicio)) / 86400000) || 1);
                        return `<tr>
                            <td>${ch ? esc(ch.nome) : '—'}</td>
                            <td>${esc(Calc.nomeCliente(l.clienteId))}</td>
                            <td class="muted">${fmtData(l.inicio)} → ${fmtData(l.fim)}</td>
                            <td class="num">${money(l.valorDia * dias)}</td>
                            <td>${l.status === 'ativa' ? `<button class="btn ghost sm" data-devolver="${l.id}">Devolver</button>` : '<span class="tag gray">Encerrada</span>'}</td>
                        </tr>`;
                    }).join('') : '<tr><td colspan="5"><div class="empty">Nenhuma locação</div></td></tr>'}</tbody>
                </table></div></div>
            </div>
        </div>`;
    },
    chopeirasMount() {
        $('#view').onclick = (e) => {
            if (e.target.hasAttribute('data-nova-chop')) return Forms.chopeira();
            const al = e.target.dataset.alugar; if (al) return Forms.locacao(al);
            const dv = e.target.dataset.devolver;
            if (dv) confirmar('Confirmar devolução da chopeira?', () => {
                const l = DB.find('locacoes', dv); l.status = 'encerrada';
                const ch = DB.find('chopeiras', l.chopeiraId); if (ch) ch.status = 'disponivel';
                DB.save(); toast('Chopeira devolvida', 'ok'); Router.render();
            });
            const del = e.target.dataset.delChop;
            if (del) confirmar('Excluir esta chopeira?', () => { DB.remove('chopeiras', del); toast('Excluída'); Router.render(); });
        };
    },

    /* ---------------- Clientes ---------------- */
    clientes() {
        const cs = DB.get().clientes;
        return `
        <div class="panel">
            <div class="panel-head">
                <h2>Clientes (${cs.length})</h2>
                <div class="toolbar">
                    <input class="search" id="cliSearch" placeholder="🔎 Buscar cliente...">
                    <button class="btn" data-novo-cli>+ Novo cliente</button>
                </div>
            </div>
            <div class="panel-body tight"><div class="table-wrap"><table>
                <thead><tr><th>Nome</th><th>Contato</th><th>Telefone</th><th>Tipo</th><th class="num">Compras</th><th></th></tr></thead>
                <tbody id="cliRows">${this._cliRows(cs)}</tbody>
            </table></div></div>
        </div>`;
    },
    _cliRows(cs) {
        if (!cs.length) return '<tr><td colspan="6"><div class="empty">Nenhum cliente</div></td></tr>';
        return cs.map(c => {
            const totalCompras = DB.get().vendas.filter(v => v.clienteId === c.id).reduce((s, v) => s + v.total, 0);
            return `<tr>
                <td><strong>${esc(c.nome)}</strong><br><span class="muted" style="font-size:.85em">${esc(c.endereco || '')}</span></td>
                <td>${esc(c.contato || '—')}</td>
                <td>${esc(c.telefone || '—')}</td>
                <td><span class="tag ${c.tipo === 'PJ' ? 'blue' : 'gray'}">${esc(c.tipo)}</span></td>
                <td class="num">${money(totalCompras)}</td>
                <td class="num">
                    <button class="icon-btn" data-edit-cli="${c.id}" title="Editar">✏️</button>
                    <button class="icon-btn" data-del-cli="${c.id}" title="Excluir">🗑</button>
                </td>
            </tr>`;
        }).join('');
    },
    clientesMount() {
        $('#cliSearch').oninput = () => {
            const q = $('#cliSearch').value.toLowerCase();
            const list = DB.get().clientes.filter(c => (c.nome + c.contato + c.telefone).toLowerCase().includes(q));
            $('#cliRows').innerHTML = this._cliRows(list);
        };
        $('#view').onclick = (e) => {
            if (e.target.hasAttribute('data-novo-cli')) return Forms.cliente();
            const ed = e.target.dataset.editCli; if (ed) return Forms.cliente(DB.find('clientes', ed));
            const del = e.target.dataset.delCli;
            if (del) confirmar('Excluir este cliente?', () => { DB.remove('clientes', del); toast('Cliente excluído'); Router.render(); });
        };
    },

    /* ---------------- Financeiro ---------------- */
    financeiro() {
        const fat = Calc.faturamentoMes();
        const desp = Calc.despesasMes();
        const custo = Calc.custoVendasMes();
        const saldo = fat - desp - custo;
        const despesas = [...DB.get().despesas].sort((a, b) => b.data.localeCompare(a.data));
        const receber = DB.get().vendas.filter(v => !v.pago);
        return `
        <div class="kpi-grid">
            <div class="kpi green"><div class="k-label">Receitas (mês)</div><div class="k-value">${money(fat)}</div></div>
            <div class="kpi red"><div class="k-label">Despesas (mês)</div><div class="k-value">${money(desp)}</div></div>
            <div class="kpi"><div class="k-label">Custo produtos (mês)</div><div class="k-value">${money(custo)}</div></div>
            <div class="kpi ${saldo >= 0 ? 'green' : 'red'}"><div class="k-label">Resultado (mês)</div><div class="k-value">${money(saldo)}</div></div>
        </div>
        <div class="grid-2">
            <div class="panel">
                <div class="panel-head"><h2>Despesas</h2><button class="btn sm" data-nova-desp>+ Despesa</button></div>
                <div class="panel-body tight"><div class="table-wrap"><table>
                    <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th class="num">Valor</th><th></th></tr></thead>
                    <tbody>${despesas.length ? despesas.map(d => `<tr>
                        <td>${fmtData(d.data)}</td>
                        <td>${esc(d.descricao)}</td>
                        <td><span class="tag gray">${esc(d.categoria)}</span></td>
                        <td class="num">${money(d.valor)}</td>
                        <td class="num"><button class="icon-btn" data-del-desp="${d.id}" title="Excluir">🗑</button></td>
                    </tr>`).join('') : '<tr><td colspan="5"><div class="empty">Sem despesas</div></td></tr>'}</tbody>
                </table></div></div>
            </div>
            <div class="panel">
                <div class="panel-head"><h2>Contas a receber</h2></div>
                <div class="panel-body tight"><div class="table-wrap"><table>
                    <thead><tr><th>Cliente</th><th>Data</th><th class="num">Valor</th><th></th></tr></thead>
                    <tbody>${receber.length ? receber.map(v => `<tr>
                        <td>${esc(Calc.nomeCliente(v.clienteId))}</td>
                        <td>${fmtData(v.data)}</td>
                        <td class="num">${money(v.total)}</td>
                        <td class="num"><button class="btn sm" data-pagar="${v.id}">Receber</button></td>
                    </tr>`).join('') : '<tr><td colspan="4"><div class="empty">Nada em aberto</div></td></tr>'}</tbody>
                </table></div></div>
            </div>
        </div>`;
    },
    financeiroMount() {
        $('#view').onclick = (e) => {
            if (e.target.hasAttribute('data-nova-desp')) return Forms.despesa();
            const del = e.target.dataset.delDesp;
            if (del) confirmar('Excluir despesa?', () => { DB.remove('despesas', del); toast('Excluída'); Router.render(); });
            const pg = e.target.dataset.pagar;
            if (pg) { DB.find('vendas', pg).pago = true; DB.save(); toast('Recebido', 'ok'); Router.render(); }
        };
    },

    /* ---------------- Relatórios ---------------- */
    relatorios() {
        // faturamento por mês (6 meses)
        const meses = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(); d.setMonth(d.getMonth() - i);
            const ym = d.toISOString().slice(0, 7);
            meses.push({ ym, label: d.toLocaleDateString('pt-BR', { month: 'short' }), total: Calc.faturamentoMes(ym), desp: Calc.despesasMes(ym) });
        }
        const maxM = Math.max(1, ...meses.map(m => Math.max(m.total, m.desp)));
        const top = Calc.topProdutos(8);
        const maxTop = Math.max(1, ...top.map(t => t.total));
        // por tipo de entrega
        const entregas = {};
        DB.get().vendas.forEach(v => entregas[v.entrega] = (entregas[v.entrega] || 0) + v.total);
        const totalGeral = DB.get().vendas.reduce((s, v) => s + v.total, 0);

        return `
        <div class="panel">
            <div class="panel-head"><h2>Receitas vs Despesas — 6 meses</h2></div>
            <div class="panel-body">
                <div class="chart-cols" style="height:200px">
                    ${meses.map(m => `<div class="chart-col" title="Receita ${money(m.total)} · Despesa ${money(m.desp)}">
                        <div style="display:flex;gap:4px;align-items:flex-end;height:100%;width:100%;justify-content:center">
                            <div class="col" style="height:${Math.round(m.total / maxM * 100)}%;width:14px"></div>
                            <div class="col" style="height:${Math.round(m.desp / maxM * 100)}%;width:14px;background:linear-gradient(180deg,#D9534F,#b33)"></div>
                        </div>
                        <span class="lbl">${m.label}</span>
                    </div>`).join('')}
                </div>
                <p class="muted" style="font-size:.8em;margin-top:8px">🟡 Receita · 🔴 Despesa</p>
            </div>
        </div>
        <div class="grid-2">
            <div class="panel">
                <div class="panel-head"><h2>Ranking de produtos</h2></div>
                <div class="panel-body"><div class="bars">
                    ${top.length ? top.map(t => `<div class="bar-row">
                        <span>${esc(t.nome)}</span>
                        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(t.total / maxTop * 100)}%"></div></div>
                        <span class="bar-val">${money(t.total)}</span>
                    </div>`).join('') : '<div class="empty">Sem dados</div>'}
                </div></div>
            </div>
            <div class="panel">
                <div class="panel-head"><h2>Vendas por canal</h2></div>
                <div class="panel-body"><div class="bars">
                    ${Object.entries(entregas).map(([k, val]) => `<div class="bar-row">
                        <span>${esc(k)}</span>
                        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(val / (totalGeral || 1) * 100)}%"></div></div>
                        <span class="bar-val">${money(val)}</span>
                    </div>`).join('') || '<div class="empty">Sem dados</div>'}
                </div></div>
            </div>
        </div>`;
    },

    /* ---------------- Configurações ---------------- */
    config() {
        const e = DB.get().empresa;
        return `
        <div class="grid-2">
            <div class="panel">
                <div class="panel-head"><h2>Dados da empresa</h2></div>
                <div class="panel-body">
                    <div class="field"><label>Nome</label><input id="cfNome" value="${esc(e.nome)}"></div>
                    <div class="field"><label>Cidade</label><input id="cfCidade" value="${esc(e.cidade)}"></div>
                    <div class="field-row">
                        <div class="field"><label>CNPJ</label><input id="cfCnpj" value="${esc(e.cnpj)}"></div>
                        <div class="field"><label>Telefone</label><input id="cfTel" value="${esc(e.telefone)}"></div>
                    </div>
                    <div class="field"><label>Meta de faturamento mensal (R$)</label><input id="cfMeta" type="number" value="${e.metaMensal}"></div>
                    <button class="btn" id="cfSalvar">Salvar</button>
                </div>
            </div>
            <div class="panel">
                <div class="panel-head"><h2>Dados &amp; Backup</h2></div>
                <div class="panel-body">
                    <p class="muted" style="margin-bottom:14px;font-size:.9em">Seus dados ficam salvos neste navegador. Faça backup exportando um arquivo, ou importe para restaurar.</p>
                    <button class="btn ghost block" id="cfExport" style="margin-bottom:10px">⬇️ Exportar dados (JSON)</button>
                    <label class="btn ghost block" style="margin-bottom:10px;cursor:pointer">⬆️ Importar dados<input type="file" id="cfImport" accept="application/json" hidden></label>
                    <button class="btn danger block" id="cfReset">🗑 Restaurar dados de exemplo</button>
                </div>
            </div>
        </div>`;
    },
    configMount() {
        $('#cfSalvar').onclick = () => {
            const e = DB.get().empresa;
            e.nome = $('#cfNome').value; e.cidade = $('#cfCidade').value;
            e.cnpj = $('#cfCnpj').value; e.telefone = $('#cfTel').value;
            e.metaMensal = parseFloat($('#cfMeta').value) || 0;
            DB.save(); App.refreshBrand(); toast('Configurações salvas', 'ok');
        };
        $('#cfExport').onclick = () => {
            const blob = new Blob([JSON.stringify(DB.get(), null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `leve-chopp-backup-${hoje()}.json`;
            a.click();
            toast('Backup exportado', 'ok');
        };
        $('#cfImport').onchange = (ev) => {
            const file = ev.target.files[0]; if (!file) return;
            const r = new FileReader();
            r.onload = () => {
                try { DB.replace(JSON.parse(r.result)); App.refreshBrand(); toast('Dados importados', 'ok'); Router.render(); }
                catch (e) { toast('Arquivo inválido', 'err'); }
            };
            r.readAsText(file);
        };
        $('#cfReset').onclick = () => confirmar('Restaurar os dados de exemplo? Isso apaga tudo.', () => { DB.reset(); App.refreshBrand(); toast('Dados restaurados'); Router.render(); });
    }
};

/* ============================================================
   FORMULÁRIOS (Modal)
   ============================================================ */
const Forms = {
    _submit(fn) {
        return (e) => { e.preventDefault(); fn(); };
    },
    produto(p = {}) {
        const isEdit = !!p.id;
        Modal.open(isEdit ? 'Editar produto' : 'Novo produto', `
        <form id="frm">
            <div class="field"><label>Nome *</label><input id="f_nome" required value="${esc(p.nome || '')}"></div>
            <div class="field-row">
                <div class="field"><label>Tipo</label>
                    <select id="f_tipo">${['Chopp', 'Barril', 'Acessório'].map(t => `<option ${p.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
                </div>
                <div class="field"><label>Unidade</label>
                    <select id="f_un">${['L', 'un', 'kg'].map(u => `<option ${p.unidade === u ? 'selected' : ''}>${u}</option>`).join('')}</select>
                </div>
            </div>
            <div class="field-row">
                <div class="field"><label>Preço de venda (R$)</label><input id="f_preco" type="number" step="0.01" value="${p.preco || ''}"></div>
                <div class="field"><label>Custo (R$)</label><input id="f_custo" type="number" step="0.01" value="${p.custo || ''}"></div>
            </div>
            <div class="field-row">
                <div class="field"><label>Estoque atual</label><input id="f_est" type="number" step="0.01" value="${p.estoque ?? ''}"></div>
                <div class="field"><label>Estoque mínimo</label><input id="f_min" type="number" step="0.01" value="${p.estoqueMin ?? ''}"></div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn ghost" onclick="Modal.close()">Cancelar</button>
                <button type="submit" class="btn">Salvar</button>
            </div>
        </form>`);
        $('#frm').onsubmit = this._submit(() => {
            const nome = $('#f_nome').value.trim();
            if (!nome) { toast('Informe o nome', 'err'); return; }
            DB.upsert('produtos', {
                id: p.id, nome,
                tipo: $('#f_tipo').value, unidade: $('#f_un').value,
                preco: parseFloat($('#f_preco').value) || 0, custo: parseFloat($('#f_custo').value) || 0,
                estoque: parseFloat($('#f_est').value) || 0, estoqueMin: parseFloat($('#f_min').value) || 0
            });
            Modal.close(); toast('Produto salvo', 'ok'); Router.render();
        });
    },
    repor(p) {
        Modal.open('Repor estoque · ' + p.nome, `
        <form id="frm">
            <p class="muted" style="margin-bottom:14px">Estoque atual: <strong>${num(p.estoque)} ${p.unidade}</strong></p>
            <div class="field"><label>Quantidade a adicionar</label><input id="f_qtd" type="number" step="0.01" autofocus></div>
            <div class="modal-actions">
                <button type="button" class="btn ghost" onclick="Modal.close()">Cancelar</button>
                <button type="submit" class="btn">Adicionar</button>
            </div>
        </form>`);
        $('#frm').onsubmit = this._submit(() => {
            const q = parseFloat($('#f_qtd').value) || 0;
            if (q <= 0) { toast('Quantidade inválida', 'err'); return; }
            p.estoque += q; DB.save(); Modal.close(); toast('Estoque atualizado', 'ok'); Router.render();
        });
    },
    cliente(c = {}) {
        Modal.open(c.id ? 'Editar cliente' : 'Novo cliente', `
        <form id="frm">
            <div class="field"><label>Nome / Empresa *</label><input id="f_nome" required value="${esc(c.nome || '')}"></div>
            <div class="field-row">
                <div class="field"><label>Contato</label><input id="f_contato" value="${esc(c.contato || '')}"></div>
                <div class="field"><label>Telefone</label><input id="f_tel" value="${esc(c.telefone || '')}"></div>
            </div>
            <div class="field"><label>Tipo</label><select id="f_tipo"><option ${c.tipo === 'PF' ? 'selected' : ''}>PF</option><option ${c.tipo === 'PJ' ? 'selected' : ''}>PJ</option></select></div>
            <div class="field"><label>Endereço</label><input id="f_end" value="${esc(c.endereco || '')}"></div>
            <div class="modal-actions">
                <button type="button" class="btn ghost" onclick="Modal.close()">Cancelar</button>
                <button type="submit" class="btn">Salvar</button>
            </div>
        </form>`);
        $('#frm').onsubmit = this._submit(() => {
            const nome = $('#f_nome').value.trim();
            if (!nome) { toast('Informe o nome', 'err'); return; }
            DB.upsert('clientes', { id: c.id, nome, contato: $('#f_contato').value, telefone: $('#f_tel').value, tipo: $('#f_tipo').value, endereco: $('#f_end').value });
            Modal.close(); toast('Cliente salvo', 'ok'); Router.render();
        });
    },
    despesa() {
        Modal.open('Nova despesa', `
        <form id="frm">
            <div class="field"><label>Descrição *</label><input id="f_desc" required></div>
            <div class="field-row">
                <div class="field"><label>Categoria</label><select id="f_cat">${['Insumos', 'Fixo', 'Logística', 'Salários', 'Impostos', 'Outros'].map(c => `<option>${c}</option>`).join('')}</select></div>
                <div class="field"><label>Valor (R$)</label><input id="f_val" type="number" step="0.01" required></div>
            </div>
            <div class="field"><label>Data</label><input id="f_data" type="date" value="${hoje()}"></div>
            <div class="modal-actions">
                <button type="button" class="btn ghost" onclick="Modal.close()">Cancelar</button>
                <button type="submit" class="btn">Salvar</button>
            </div>
        </form>`);
        $('#frm').onsubmit = this._submit(() => {
            const desc = $('#f_desc').value.trim();
            const val = parseFloat($('#f_val').value) || 0;
            if (!desc || val <= 0) { toast('Preencha descrição e valor', 'err'); return; }
            DB.upsert('despesas', { descricao: desc, categoria: $('#f_cat').value, valor: val, data: $('#f_data').value || hoje() });
            Modal.close(); toast('Despesa registrada', 'ok'); Router.render();
        });
    },
    chopeira() {
        Modal.open('Nova chopeira', `
        <form id="frm">
            <div class="field"><label>Nome *</label><input id="f_nome" required placeholder="Ex.: Chopeira 2 Torneiras"></div>
            <div class="field"><label>Código</label><input id="f_cod" placeholder="Ex.: CH-200L-E"></div>
            <div class="modal-actions">
                <button type="button" class="btn ghost" onclick="Modal.close()">Cancelar</button>
                <button type="submit" class="btn">Salvar</button>
            </div>
        </form>`);
        $('#frm').onsubmit = this._submit(() => {
            const nome = $('#f_nome').value.trim();
            if (!nome) { toast('Informe o nome', 'err'); return; }
            DB.upsert('chopeiras', { nome, codigo: $('#f_cod').value, status: 'disponivel' });
            Modal.close(); toast('Chopeira cadastrada', 'ok'); Router.render();
        });
    },
    locacao(chopeiraId) {
        Modal.open('Alugar chopeira', `
        <form id="frm">
            <div class="field"><label>Cliente *</label>
                <select id="f_cli" required>
                    <option value="">Selecione...</option>
                    ${DB.get().clientes.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('')}
                </select>
            </div>
            <div class="field-row">
                <div class="field"><label>Início</label><input id="f_ini" type="date" value="${hoje()}"></div>
                <div class="field"><label>Fim</label><input id="f_fim" type="date"></div>
            </div>
            <div class="field-row">
                <div class="field"><label>Valor por dia (R$)</label><input id="f_vdia" type="number" step="0.01" value="80"></div>
                <div class="field"><label>Caução (R$)</label><input id="f_cau" type="number" step="0.01" value="300"></div>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn ghost" onclick="Modal.close()">Cancelar</button>
                <button type="submit" class="btn">Confirmar aluguel</button>
            </div>
        </form>`);
        $('#frm').onsubmit = this._submit(() => {
            const cli = $('#f_cli').value;
            if (!cli) { toast('Selecione o cliente', 'err'); return; }
            const ini = $('#f_ini').value || hoje();
            const fim = $('#f_fim').value || ini;
            DB.upsert('locacoes', { chopeiraId, clienteId: cli, inicio: ini, fim, valorDia: parseFloat($('#f_vdia').value) || 0, caucao: parseFloat($('#f_cau').value) || 0, status: 'ativa' });
            const ch = DB.find('chopeiras', chopeiraId); if (ch) ch.status = 'alugada';
            DB.save(); Modal.close(); toast('Locação registrada', 'ok'); Router.render();
        });
    }
};

/* ---------- Confirmação ---------- */
function confirmar(msg, onOk) {
    Modal.open('Confirmar', `
        <p style="margin-bottom:20px">${esc(msg)}</p>
        <div class="modal-actions">
            <button class="btn ghost" onclick="Modal.close()">Cancelar</button>
            <button class="btn danger" id="confOk">Confirmar</button>
        </div>`);
    $('#confOk').onclick = () => { Modal.close(); onOk(); };
}

/* ============================================================
   ROUTER
   ============================================================ */
const TITLES = {
    dashboard: 'Dashboard', pdv: 'Vendas / PDV', pedidos: 'Pedidos',
    produtos: 'Produtos & Estoque', chopeiras: 'Locação de Chopeiras',
    clientes: 'Clientes', financeiro: 'Financeiro', relatorios: 'Relatórios', config: 'Configurações'
};

const Router = {
    current: 'dashboard',
    go(route) { location.hash = '#/' + route; },
    render() {
        const view = Views[this.current] ? this.current : 'dashboard';
        $('#view').innerHTML = Views[view]();
        $('#pageTitle').textContent = TITLES[view] || 'Leve Chopp';
        $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === view));
        const mount = Views[view + 'Mount'];
        if (mount) mount.call(Views);
        // fecha menu mobile
        $('#sidebar').classList.remove('open');
        $('#scrim')?.classList.remove('show');
        window.scrollTo(0, 0);
        App.updateAlerts();
    },
    handle() {
        const r = (location.hash.replace('#/', '') || 'dashboard');
        this.current = TITLES[r] ? r : 'dashboard';
        this.render();
    }
};
window.addEventListener('hashchange', () => Router.handle());

/* ============================================================
   APP
   ============================================================ */
const App = {
    init() {
        // relógio
        const tick = () => { const el = $('#clock'); if (el) el.textContent = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); };
        tick(); setInterval(tick, 30000);
        // menu mobile
        const scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.id = 'scrim';
        document.body.appendChild(scrim);
        $('#menuBtn').onclick = () => { $('#sidebar').classList.toggle('open'); scrim.classList.toggle('show'); };
        scrim.onclick = () => { $('#sidebar').classList.remove('open'); scrim.classList.remove('show'); };
        this.refreshBrand();
        Router.handle();
    },
    refreshBrand() {
        const e = DB.get().empresa;
        $('.brand-text strong').textContent = e.nome || 'Leve Chopp';
        $('.brand-text span').textContent = e.cidade || '';
        document.title = (e.nome || 'Leve Chopp') + ' · Gestão';
    },
    updateAlerts() {
        const baixo = Calc.estoqueBaixo().length;
        const receber = DB.get().vendas.filter(v => !v.pago).length;
        const parts = [];
        if (baixo) parts.push(`⚠️ ${baixo} estoque baixo`);
        if (receber) parts.push(`⏳ ${receber} a receber`);
        $('#alertBadge').textContent = parts.join('  ·  ');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
