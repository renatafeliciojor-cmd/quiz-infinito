/* ============================================================
   Leve Chopp — Camada de dados (localStorage)
   ============================================================ */
const DB = (() => {
    const KEY = 'leve-chopp-db-v1';

    // ---- Dados iniciais (seed) ----
    function seed() {
        const hoje = new Date();
        const iso = (d) => d.toISOString().slice(0, 10);
        const diasAtras = (n) => { const d = new Date(hoje); d.setDate(d.getDate() - n); return iso(d); };

        return {
            empresa: {
                nome: 'Leve Chopp',
                cidade: 'Belo Horizonte - MG',
                cnpj: '',
                telefone: '(31) 90000-0000',
                metaMensal: 30000
            },
            produtos: [
                { id: 'p1', nome: 'Chopp Pilsen', tipo: 'Chopp', unidade: 'L', preco: 18.00, custo: 8.50, estoque: 180, estoqueMin: 50 },
                { id: 'p2', nome: 'Chopp IPA', tipo: 'Chopp', unidade: 'L', preco: 26.00, custo: 12.00, estoque: 90, estoqueMin: 40 },
                { id: 'p3', nome: 'Chopp Weiss', tipo: 'Chopp', unidade: 'L', preco: 24.00, custo: 11.00, estoque: 30, estoqueMin: 40 },
                { id: 'p4', nome: 'Chopp Vinho (Bock)', tipo: 'Chopp', unidade: 'L', preco: 28.00, custo: 13.00, estoque: 60, estoqueMin: 30 },
                { id: 'p5', nome: 'Barril 30L Pilsen', tipo: 'Barril', unidade: 'un', preco: 480.00, custo: 240.00, estoque: 12, estoqueMin: 5 },
                { id: 'p6', nome: 'Barril 50L Pilsen', tipo: 'Barril', unidade: 'un', preco: 750.00, custo: 400.00, estoque: 4, estoqueMin: 5 },
                { id: 'p7', nome: 'Copo Personalizado', tipo: 'Acessório', unidade: 'un', preco: 6.00, custo: 2.50, estoque: 320, estoqueMin: 100 },
                { id: 'p8', nome: 'Cilindro CO₂', tipo: 'Acessório', unidade: 'un', preco: 90.00, custo: 45.00, estoque: 8, estoqueMin: 4 }
            ],
            clientes: [
                { id: 'c1', nome: 'Bar do Zé', contato: 'José Almeida', telefone: '(31) 98811-2201', tipo: 'PJ', endereco: 'Rua Sapucaí, 120 - Floresta' },
                { id: 'c2', nome: 'Eventos BH Festas', contato: 'Marina Souza', telefone: '(31) 99120-4432', tipo: 'PJ', endereco: 'Av. Amazonas, 900 - Centro' },
                { id: 'c3', nome: 'Carlos Pereira', contato: 'Carlos Pereira', telefone: '(31) 98700-1188', tipo: 'PF', endereco: 'Rua da Bahia, 55 - Lourdes' },
                { id: 'c4', nome: 'Restaurante Mineirão', contato: 'Ana Lima', telefone: '(31) 99555-7788', tipo: 'PJ', endereco: 'Av. Antônio Carlos, 5000 - Pampulha' }
            ],
            chopeiras: [
                { id: 'ch1', nome: 'Chopeira 1 Torneira', codigo: 'CH-100L-A', status: 'disponivel' },
                { id: 'ch2', nome: 'Chopeira 2 Torneiras', codigo: 'CH-200L-B', status: 'alugada' },
                { id: 'ch3', nome: 'Chopeira 2 Torneiras', codigo: 'CH-200L-C', status: 'disponivel' },
                { id: 'ch4', nome: 'Chopeira 4 Torneiras (Evento)', codigo: 'CH-EVT-D', status: 'manutencao' }
            ],
            locacoes: [
                { id: 'l1', chopeiraId: 'ch2', clienteId: 'c2', inicio: diasAtras(2), fim: diasAtras(-3), valorDia: 80, caucao: 300, status: 'ativa' }
            ],
            vendas: [
                { id: 'v1', data: diasAtras(0), clienteId: 'c1', itens: [{ produtoId: 'p1', qtd: 30, preco: 18 }], total: 540, pago: true, entrega: 'Retirada' },
                { id: 'v2', data: diasAtras(0), clienteId: 'c3', itens: [{ produtoId: 'p2', qtd: 10, preco: 26 }], total: 260, pago: true, entrega: 'Delivery' },
                { id: 'v3', data: diasAtras(1), clienteId: 'c4', itens: [{ produtoId: 'p5', qtd: 2, preco: 480 }], total: 960, pago: false, entrega: 'Delivery' },
                { id: 'v4', data: diasAtras(3), clienteId: 'c2', itens: [{ produtoId: 'p1', qtd: 50, preco: 18 }, { produtoId: 'p7', qtd: 100, preco: 6 }], total: 1500, pago: true, entrega: 'Delivery' },
                { id: 'v5', data: diasAtras(6), clienteId: 'c1', itens: [{ produtoId: 'p4', qtd: 20, preco: 28 }], total: 560, pago: true, entrega: 'Retirada' },
                { id: 'v6', data: diasAtras(9), clienteId: 'c4', itens: [{ produtoId: 'p6', qtd: 1, preco: 750 }], total: 750, pago: true, entrega: 'Delivery' }
            ],
            despesas: [
                { id: 'd1', data: diasAtras(4), descricao: 'Compra insumos (malte/lúpulo)', categoria: 'Insumos', valor: 3200 },
                { id: 'd2', data: diasAtras(2), descricao: 'Conta de energia', categoria: 'Fixo', valor: 890 },
                { id: 'd3', data: diasAtras(7), descricao: 'Combustível entregas', categoria: 'Logística', valor: 420 }
            ]
        };
    }

    let state = load();

    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) { /* ignore */ }
        const s = seed();
        localStorage.setItem(KEY, JSON.stringify(s));
        return s;
    }

    function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

    function uid(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

    return {
        get: () => state,
        save,
        uid,
        reset() { state = seed(); save(); },
        replace(obj) { state = obj; save(); },
        // helpers de coleção
        find(coll, id) { return state[coll].find(x => x.id === id); },
        upsert(coll, item) {
            if (!item.id) { item.id = uid(coll[0]); state[coll].push(item); }
            else {
                const i = state[coll].findIndex(x => x.id === item.id);
                if (i >= 0) state[coll][i] = item; else state[coll].push(item);
            }
            save();
            return item;
        },
        remove(coll, id) {
            state[coll] = state[coll].filter(x => x.id !== id);
            save();
        }
    };
})();
