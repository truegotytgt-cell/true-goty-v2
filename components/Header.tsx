// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'INÍCIO', path: '/' },
    { name: 'MÉTODO', path: '/metodo' },
    { name: 'INDICADOS', path: '/indicados' },
    { name: 'GOTY', path: '/resultados' },
    { name: 'VOTAR', path: '/votar/tgt' },
    { name: 'SOBRE', path: '/sobre' },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(176, 38, 255, 0.2)',
      zIndex: 100,
      boxSizing: 'border-box', // Impede que o padding estoure a tela
      padding: '1rem 2rem'
    }}>
      {/* Container interno para centralizar e limitar a largura */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: 'var(--text-light)', fontSize: '2rem', fontWeight: 900, margin: 0, textShadow: '0 0 10px var(--purple-neon)' }}>
            TGT
          </h1>
        </Link>

        <nav style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-gray)',
          padding: '0.5rem',
          borderRadius: '50px',
          border: '1px solid #333'
        }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.name === 'VOTAR' && pathname.startsWith('/votar'));
            
            return (
              <Link 
                key={link.name} 
                href={link.path}
                style={{
                  padding: '0.5rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: isActive ? 'var(--purple-neon)' : 'transparent',
                  color: isActive ? '#FFF' : '#a1a1aa',
                  boxShadow: isActive ? '0 0 15px rgba(176, 38, 255, 0.4)' : 'none'
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Área da direita: Idioma + Contato */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button style={{
            background: 'transparent',
            border: '1px solid #333',
            color: '#a1a1aa',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🇧🇷 PT-BR
          </button>

          <Link href="/contato" style={{
            padding: '0.5rem 1.5rem',
            border: '1px solid var(--purple-neon)',
            borderRadius: '8px',
            color: 'var(--purple-neon)',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '0.85rem'
          }}>
            CONTATO
          </Link>
        </div>
      </div>
    </header>
  );
}