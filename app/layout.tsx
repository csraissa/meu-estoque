import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema de Gestão de Estoque',
  description: 'Gerenciamento de produtos, fornecedores e associações',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-900 min-h-screen flex flex-col font-sans antialiased">
        
        {/* NAVBAR GLOBAL */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* LOGO */}
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <span className="text-xl font-bold tracking-tight">Controle de Estoque</span>
                </Link>
              </div>

              {/* Links da Navegação */}
              <nav className="flex items-center space-x-1 sm:space-x-4 text-sm font-medium">
                <Link
                  href="/"
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Dashboard
                </Link>

                <Link
                  href="/produtos"
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Produtos
                </Link>

                <Link
                  href="/fornecedor"
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Fornecedores
                </Link>

                <Link
                  href="/associacao"
                  className="px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold rounded-md transition-colors"
                >
                  Associação
                </Link>
              </nav>

            </div>
          </div>
        </header>

        {/* CONTEÚDO DAS PÁGINAS */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* RODAPÉ */}
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Sistema de controle de estoque
        </footer>

      </body>
    </html>
  );
}
