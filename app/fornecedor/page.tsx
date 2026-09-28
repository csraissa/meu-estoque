'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import fornecedoresMock from '@/data/fornecedores.json';

interface FornecedorMock {
  id?: number | string;  
  nomeEmpresa: string;
  cnpj: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  contatoPrincipal?: string;
}

export default function FornecedoresPage() {
  const router = useRouter();

  const [fornecedores, setFornecedores] = useState<FornecedorMock[]>(fornecedoresMock);

   // Para armazenar os campos do formulário
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    contatoPrincipal: '',
  });

   // Funções de formatação (Máscaras)
  const formatarCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18); // Limita ao tamanho do CNPJ formatado
  };

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      // Para telefone fixo: (00) 0000-0000
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 14);
    }
    // Para celular: (00) 00000-0000
    return numbers
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  // Atualiza os campos tratando as máscaras de CNPJ e Telefone
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'cnpj') {
      formattedValue = formatarCNPJ(value);
    } else if (name === 'telefone') {
      formattedValue = formatarTelefone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

   // Envio do formulário 
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

  // Informações inválidas no form
  const temCampoVazio = Object.values(formData).some(
  (valor) => typeof valor === 'string' && !valor.trim()
 );
   if (temCampoVazio) {
  alert('Por favor, preencha todos os campos do formulário!');
  return; // Interrompe o envio
  }
   // Procurar CNPJ existente
  const cnpjJaExiste = fornecedores.some(
    (fornecedor) => fornecedor.cnpj === formData.cnpj
  );
   if (cnpjJaExiste) {
    alert('Fornecedor com esse CNPJ já está cadastrado!');
    return;
  }
   // Atualiza o estado com o novo cadastro
  setFornecedores((prev) => [
      ...prev,
      { ...formData, id: Date.now() }
    ]);
    // Cadastro com sucesso

    alert('Fornecedor cadastrado com sucesso!');

    // Limpa os campos
    setFormData({
      nomeEmpresa: '',
      cnpj: '',
      endereco: '',
      telefone: '',
      email: '',
      contatoPrincipal: '',
    });

   // Redireciona para o Dashboard após cadastrar
    router.push('/');
  };

  return (
      <div className="max-w-4xl mx-auto p-6 rounded-lg border border-gray-200 shadow-md space-y-6">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Cadastro de Fornecedor
          </h1>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nome da Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nomeEmpresa"
              required
              value={formData.nomeEmpresa}
              onChange={handleChange}
              placeholder="Insira o nome da empresa"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* CNPJ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cnpj"
              required
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço <span className="text-red-500">*</span>
            </label>
            <textarea
              name="endereco"
              required
              rows={3}
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Insira o endereço completo da empresa"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* Telefone e E-mail em grid lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplo@fornecedor.com"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Contato Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contato Principal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contatoPrincipal"
              required
              value={formData.contatoPrincipal}
              onChange={handleChange}
              placeholder="Nome do contato principal"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* AÇÕES DO RODAPÉ */}
          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>

  );
}