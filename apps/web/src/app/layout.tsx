import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leve Chopp - Sistema de Gestão',
  description: 'Sistema de gestão de distribuição de chopp em Belo Horizonte',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
