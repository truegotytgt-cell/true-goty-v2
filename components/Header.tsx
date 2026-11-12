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
    { name: 'VOTAR', path: '/votar' },
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 4rem'
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
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.name} 
              href={link.path}
              style={{
                padding: '0.5rem 1.5rem',
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
    </header>
  );
}