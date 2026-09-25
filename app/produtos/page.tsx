'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import produtosMock from '@/data/produtos.json';

interface ProdutoMock {
  id?: number | string;
  nome: string;
  codigoBarras: number | string;
  descricao: string;
  categoria: string;
  fornecedor?: number | string;
  status?: string;
  imagemUrl?: string; 
}
interface ErrosFormulario {
  nome?: string;
  codigoBarras?: number | string;
  descricao?: string;
  quantidade?: number | string;
  categoria?: string;
}

export default function ProdutosPage() {
  const router = useRouter();

    const [produtos, setProdutos] = useState<ProdutoMock[]>(produtosMock);
 

  // Estado para armazenar os valores do formulário
  const [formData, setFormData] = useState({
    nome: '',
    codigoBarras: '',
    descricao: '',
    quantidade: '',
    categoria: '',
    outraCategoria: '',
    dataValidade: '',
  });

  // Estado para o arquivo de imagem
  const [imagem, setImagem] = useState<File | null>(null);

  // Atualiza os campos do formulário
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Trata o upload do arquivo de imagem
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
    }
  };

  // Envio do formulário
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  const novosErros: ErrosFormulario = {};

  // Validação de campos obrigatórios
  if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
  if (!formData.descricao.trim()) novosErros.descricao = 'Descrição é obrigatória';
  if (!formData.categoria.trim()) novosErros.categoria = 'Categoria é obrigatória';
  if (formData.categoria === 'Outro' && !formData.outraCategoria.trim()) {
    novosErros.categoria = 'Por favor, especifique a categoria';
  }
  // Verificacao do Código de Barras 
  if (formData.codigoBarras.trim()) {
    const codigoExiste = produtos.some(
      (p) => String(p.codigoBarras) === formData.codigoBarras.trim()
    );
    if (codigoExiste) {
      novosErros.codigoBarras = 'Produto com este código de barras já está cadastrado!';
    }
  }
  // Se houver qualquer erro, exibe e interrompe
  if (Object.keys(novosErros).length > 0) {

    if (novosErros.codigoBarras) alert(novosErros.codigoBarras);
    return;
  }
  // Cria o produto final com a categoria
  const categoriaFinal =
    formData.categoria === 'Outro' ? formData.outraCategoria : formData.categoria;
  const novoProduto: ProdutoMock = {
    ...formData,
    categoria: categoriaFinal,
    imagemUrl: imagem ? URL.createObjectURL(imagem) : undefined,
    id: Date.now(),
    status: 'Pendente',
    fornecedor: 'Não informado',
  };
  // Salvar e avisar
  setProdutos((prev) => [...prev, novoProduto]);
  alert('Produto cadastrado com sucesso!');
  // Redirecionar pro inicio
  router.push('/');
};

  return (
      <div className="max-w-4xl mx-auto p-6 rounded-lg border border-gray-200 shadow-md space-y-6">
        
        {/* CABEÇALHO */}
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Cadastro de Produto
          </h1>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nome do Produto (Obrigatório) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              placeholder="Insira o nome do produto"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* Código de Barras */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de Barras
            </label>
            <input
              type="text"
              name="codigoBarras"
              value={formData.codigoBarras}
              onChange={handleChange}
              placeholder="Insira o código de barras"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* Descrição (Obrigatório) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descricao"
              required
              rows={3}
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva brevemente o produto"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* Quantidade em Estoque e Data de Validade (se aplicável) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade em Estoque
              </label>
              <input
                type="number"
                name="quantidade"
                min="0"
                value={formData.quantidade}
                onChange={handleChange}
                placeholder="Quantidade disponível"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Validade (opcional)
              </label>
              <input
                type="date"
                name="dataValidade"
                value={formData.dataValidade}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Categoria (Obrigatório) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-white"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Eletrônicos">Eletrônicos</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Móveis">Móveis</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Campo condicional para Categoria "Outro" */}
          {formData.categoria === 'Outro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especifique a Categoria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="outraCategoria"
                required
                value={formData.outraCategoria}
                onChange={handleChange}
                placeholder="Digite a nova categoria"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              />
            </div>
          )}

          {/* Imagem do Produto (se aplicável) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem do Produto (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* AÇÕES DE CANCELAR E SALVAR */}
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