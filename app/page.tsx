'use client';
import Link from 'next/link';
import produtos from '@/data/produtos.json';

export default function DashboardPage() {

// Cálculo dos totais
  const totalProdutos = produtos.length;
  const totalAssociados = produtos.filter((p) => p.status === 'Associado').length;
  const totalPendentes = produtos.filter((p) => p.status === 'Pendente').length;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md space-y-6">
      
      {/* CABEÇALHO DENTRO DO CARD */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
        <p className="text-sm text-gray-500">Acompanhe os produtos e fornecedores.</p>
      </div>

      {/* 1. LISTA GERAL DE PRODUTOS E STATUS */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Lista Geral de Produtos</h2>
          <span className="text-xs text-gray-500">{totalProdutos} itens listados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Código de Barras</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Fornecedor</th>
                <th className="py-3 px-4 text-center">Status</th>
               
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {produtos.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.nome}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{item.codigoBarras}</td>
                  <td className="py-3 px-4 text-gray-600">{item.categoria}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.status === 'Associado' ? (
                      item.fornecedor
                    ) : (
                      <span className="text-gray-400 italic">Não informado</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === 'Associado' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Associado
                      </span>
                    ) : (
                      <Link
                       href={`/associacao?produtoId=${item.id}`}
                       className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900 transition-all cursor-pointer shadow-xs active:scale-95"
                       title="Clique para associar este produto"
                      >
                       Pendente <span>↗</span>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. SOMA DE TODOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total de Produtos</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalProdutos}</p>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-700 uppercase">Produtos Associados</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalAssociados}</p>
        </div>

        <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
          <p className="text-xs font-semibold text-amber-700 uppercase">Pendentes de Associação</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{totalPendentes}</p>
        </div>
      </div>

    </div>
  );
}