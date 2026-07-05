export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              🍺
            </div>
            <h1 className="text-xl font-bold text-gray-900">Leve Chopp</h1>
          </div>
          <div className="flex gap-4">
            <a
              href="/auth/login"
              className="px-4 py-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Cadastro
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white text-center">
        <h2 className="text-5xl font-bold mb-6">
          Gestão Completa de Distribuição de Chopp
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sistema integrado para controlar pedidos, rotas, estoque, financeiro e
          muito mais. Tudo em um único lugar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon="📊"
            title="Dashboard Inteligente"
            description="Visualize todos os dados da sua empresa em tempo real"
          />
          <FeatureCard
            icon="🚚"
            title="Gerenciamento de Rotas"
            description="Otimize entregas com rastreamento GPS em tempo real"
          />
          <FeatureCard
            icon="💰"
            title="Controle Financeiro"
            description="Gerencie faturas, recebimentos e fluxo de caixa"
          />
          <FeatureCard
            icon="📱"
            title="WhatsApp Integrado"
            description="Comunique-se com clientes direto pelo WhatsApp"
          />
          <FeatureCard
            icon="📦"
            title="Controle de Estoque"
            description="Acompanhe produtos e receba alertas automáticos"
          />
          <FeatureCard
            icon="👥"
            title="CRM Completo"
            description="Gerencie clientes, prospectos e relacionamentos"
          />
        </div>

        <div className="mt-16">
          <a
            href="/auth/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Começar Agora
          </a>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 hover:bg-opacity-20 transition-all">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  );
}
