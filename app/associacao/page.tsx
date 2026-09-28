'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import produtosMock from '@/data/produtos.json'; 
import fornecedoresMock from '@/data/fornecedores.json';

interface Produto {
  id?: number | string;
  nome: string;
  codigoBarras?: number | string;
  descricao: string;
  imagemUrl?: string;
}

interface Fornecedor {
  id: string;
  nomeEmpresa: string;
  cnpj: string;
}

function AssociacaoConteudo() {
  const router = useRouter();

  const [fornecedoresDisponiveis] = useState<Fornecedor[]>(fornecedoresMock);


  const searchParams = useSearchParams();
  const idUrl = searchParams.get('id');

  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState(idUrl || '');

  const produto = (produtosMock as Produto[]).find(
  (p) => String(p.id) === produtoSelecionadoId
);

  // Para armazenar os fornecedores já associados ao produto
  const [fornecedoresAssociados, setFornecedoresAssociados] = useState<Fornecedor[]>([
    { id: '101', nomeEmpresa: 'Tech Distribuidora LTDA', cnpj: '12.345.678/0001-95' },
  ]);

  // Para armazenar o ID do fornecedor
  const [fornecedorSelecionadoId, setFornecedorSelecionadoId] = useState('');

  // Função para associar um novo fornecedor ao produto
  const handleAssociar = (e: FormEvent) => {
    e.preventDefault();

    if (!fornecedorSelecionadoId) {
      alert('Por favor, selecione um fornecedor');
      return;
    }

    // Verificar se já está associado
    const jaAssociado = fornecedoresAssociados.some(
      (f) => f.id === fornecedorSelecionadoId
    );

    if (jaAssociado) {
      alert('Fornecedor já está associado a este produto!');
      return;
    }

    const fornecedorParaAdicionar = fornecedoresDisponiveis.find(
      (f) => f.id === fornecedorSelecionadoId
    );
    // Adicionar o novo fornecedor na lista
    if (fornecedorParaAdicionar) {
      setFornecedoresAssociados((prev) => [...prev, fornecedorParaAdicionar]);
      setFornecedorSelecionadoId(''); // Limpa o dropdown após associar
      alert('Fornecedor associado com sucesso ao produto!');
    }
  };

    // Para desassociar um fornecedor
    const handleDesassociar = (id: number | string) => {
       setFornecedoresAssociados((prev) =>
         prev.filter((fornecedor) => fornecedor.id !== id)
       );
       alert('Fornecedor desassociado com sucesso!');
};

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg border border-gray-200 shadow-md space-y-6">
        
    {/* CABEÇALHO DA PÁGINA COM VOLTAR */}
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <button
          type="button"
           onClick={() => router.back()}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
           Associação de Fornecedor a Produto
         </h1>
     </div>

    {/* SELEÇÃO DO PRODUTO DO ESTOQUE */}
    <div className="bg-white p-6 rounded-lg shadow-md">
     <label className="block text-sm font-semibold text-gray-800 mb-2">
       Selecione o Produto para Associar:
     </label>
     <select
       value={produtoSelecionadoId}
       onChange={(e) => setProdutoSelecionadoId(e.target.value)}
       className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-white"
      >
       <option value=""> Escolha um produto do estoque </option>
       {produtosMock.map((item) => (
         <option key={item.id} value={item.id}>
           {item.nome} (Status: {item.status})
         </option>
       ))}
     </select>
    </div>
   
    {/* DETALHES DO PRODUTO (SOMENTE LEITURA AQUI) */}
  <div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
    Detalhes do Produto
  </h2>

  <div className="space-y-4">
    {/* LINHA SUPERIOR: Imagem + Nome + Código de Barras */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Imagem do Produto (96px x 96px) */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center border rounded-lg p-1 bg-gray-50">
        <Image
         src={produto?.imagemUrl || 'https://via.placeholder.com/150'}
         alt={produto?.nome || 'Imagem do produto'}
         width={96}
         height={96}
         unoptimized
         className="w-24 h-24 object-cover rounded-md"
        />
      </div>

      {/* Inputs lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            readOnly
            value={produto ? produto.nome : 'Nenhum produto selecionado'}
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Código de Barras
          </label>
          <input
            type="text"
            readOnly
            value={produto ? produto.codigoBarras : '-'}
            className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>
    </div>

    {/* LINHA INFERIOR: Descrição */}
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
        Descrição
      </label>
      <textarea
        readOnly
        rows={2}
        value={produto ? produto.descricao : 'Selecione um produto acima para ver os detalhes.'}
        className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed focus:outline-none"
      />
    </div>
  </div>
</div>
        {/* SEÇÃO DE ASSOCIAÇÃO DE FORNECEDOR */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            Associação de Fornecedor
          </h2>

          <form onSubmit={handleAssociar} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleção de Fornecedor
              </label>
              <select
                value={fornecedorSelecionadoId}
                onChange={(e) => setFornecedorSelecionadoId(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-white"
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedoresDisponiveis.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nomeEmpresa} (CNPJ: {f.cnpj})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors whitespace-nowrap"
            >
              Associar Fornecedor
            </button>
          </form>
        </div>

        {/* FORNECEDORES ASSOCIADOS */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            Fornecedores Associados
          </h2>

          {fornecedoresAssociados.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              Nenhum fornecedor associado a este produto até o momento.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-sm font-semibold text-gray-600">Nome do Fornecedor</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">CNPJ</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 text-right"> </th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedoresAssociados.map((fornecedor) => (
                    <tr key={fornecedor.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">
                        {fornecedor.nomeEmpresa}
                      </td>
                      <td className="p-3 text-gray-600">{fornecedor.cnpj}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDesassociar(fornecedor.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-md transition-colors"
                        >
                          Desassociar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

  );
}
export default function AssociacaoPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Carregando associação...</div>}>
      <AssociacaoConteudo />
    </Suspense>
  );
}
