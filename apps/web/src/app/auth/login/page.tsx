'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // TODO: Implementar login via API
      console.log('Login:', { email, senha });
    } catch (error) {
      setErro('Falha ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-3xl mx-auto mb-4">
            🍺
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Leve Chopp</h1>
          <p className="text-gray-600 text-sm mt-1">Sistema de Gestão</p>
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-gray-700 font-semibold mb-2">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {carregando ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-2 text-gray-600 text-sm">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span>ou</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Não tem conta?{' '}
          <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
            Cadastre-se
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/forgot-password" className="text-gray-600 hover:text-blue-600">
            Esqueceu a senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
