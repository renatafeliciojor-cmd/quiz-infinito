'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const vendas_data = [
  { mes: 'Jan', vendas: 4000 },
  { mes: 'Fev', vendas: 3000 },
  { mes: 'Mar', vendas: 2000 },
  { mes: 'Abr', vendas: 2780 },
  { mes: 'Mai', vendas: 1890 },
  { mes: 'Jun', vendas: 2390 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Vendas Hoje"
          value="R$ 12.450"
          change="+12.5%"
          icon="💰"
          color="blue"
        />
        <KPICard
          title="Pedidos Pendentes"
          value="8"
          change="+2 desde ontem"
          icon="📦"
          color="yellow"
        />
        <KPICard
          title="Clientes Ativos"
          value="145"
          change="+5 novos"
          icon="👥"
          color="green"
        />
        <KPICard
          title="Faturamento Mês"
          value="R$ 245.890"
          change="+18.2% vs mês anterior"
          icon="📊"
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Vendas por Mês</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendas_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendas" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faturamento Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Faturamento Acumulado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vendas_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="vendas" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pedidos Recentes</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                <div>
                  <p className="font-semibold text-gray-900">Pedido #PED-2024-00{i}</p>
                  <p className="text-sm text-gray-600">Cliente: Empresa {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {1000 * i},00</p>
                  <span className="badge badge-success text-xs">Confirmado</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Alertas</h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded">
              <p className="text-sm font-semibold text-red-800">Estoque Baixo</p>
              <p className="text-xs text-red-700">Chopp 600ml em falta</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded">
              <p className="text-sm font-semibold text-yellow-800">Fatura Vencida</p>
              <p className="text-xs text-yellow-700">2 faturas em atraso</p>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
              <p className="text-sm font-semibold text-blue-800">Nova Mensagem</p>
              <p className="text-xs text-blue-700">3 mensagens no WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

function KPICard({ title, value, change, icon, color }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-xs mt-2 ${colorClasses[color]}`}>{change}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
