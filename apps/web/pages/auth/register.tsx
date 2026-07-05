'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    senha: '',
    senhaConfirma: '',
    nomeContato: '',
    telefone: '',
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    if (formData.senha !== formData.senhaConfirma) {
      setErro('As senhas não coincidem');
      setCarregando(false);
      return;
    }

    try {
      // TODO: Implementar registro via API
      console.log('Registrando:', formData);
      setSucesso('Cadastro realizado com sucesso! Você será redirecionado...');
    } catch (error) {
      setErro('Falha ao registrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-3xl mx-auto mb-4">
            🍺
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Cadastro</h1>
          <p className="text-gray-600 text-sm mt-1">Crie sua conta no Leve Chopp</p>
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nome da Empresa
            </label>
            <input
              type="text"
              name="nomeEmpresa"
              value={formData.nomeEmpresa}
              onChange={handleChange}
              placeholder="Sua Empresa LTDA"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              CNPJ
            </label>
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@empresa.com.br"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Senha
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              name="senhaConfirma"
              value={formData.senhaConfirma}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
          >
            {carregando ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
