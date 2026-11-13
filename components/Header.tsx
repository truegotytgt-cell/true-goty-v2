// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageProvider'; // <-- IMPORTANDO

export default function Header() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage(); // <-- USANDO O IDIOMA

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: t.nav_inicio, path: '/' },
    { name: t.nav_metodo, path: '/metodo' },
    { name: t.nav_indicados, path: '/indicados' },
    { name: t.nav_goty, path: '/resultados' },
    { name: t.nav_votar, path: '/votar/tgt' },
    { name: t.nav_sobre, path: '/sobre' },
  ];

  // Bandeira atual baseada no idioma
  const flagAtual = lang === 'pt' ? 'br' : lang === 'en' ? 'us' : 'es';
  const labelAtual = lang === 'pt' ? 'PT-BR' : lang === 'en' ? 'EN' : 'ES';

  return (
    <header style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(176, 38, 255, 0.2)', zIndex: 100, boxSizing: 'border-box', padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: 'var(--text-light)', fontSize: '2rem', fontWeight: 900, margin: 0, textShadow: '0 0 10px var(--purple-neon)' }}>TGT</h1>
        </Link>

        <nav style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-gray)', padding: '0.5rem', borderRadius: '50px', border: '1px solid #333' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path === '/votar/tgt' && pathname.startsWith('/votar'));
            return (
              <Link key={link.name} href={link.path} style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '50px', textDecoration: 'none', transition: 'all 0.3s ease', backgroundColor: isActive ? 'var(--purple-neon)' : 'transparent', color: isActive ? '#FFF' : '#a1a1aa', boxShadow: isActive ? '0 0 15px rgba(176, 38, 255, 0.4)' : 'none' }}>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button onClick={() => setLangOpen(!langOpen)} style={{ background: 'transparent', border: '1px solid #333', color: '#a1a1aa', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
              <img src={`https://flagcdn.com/${flagAtual}.svg`} width="20" alt={labelAtual} style={{ borderRadius: '2px', boxShadow: '0 0 2px rgba(255,255,255,0.5)' }} />
              {labelAtual}
            </button>
            
            {langOpen && (
              <div style={{ position: 'absolute', top: '120%', right: 0, backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '180px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 200 }}>
                <button onClick={() => { setLang('pt'); setLangOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '0.6rem 1rem', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <img src="https://flagcdn.com/br.svg" width="20" alt="BR" style={{ borderRadius: '2px' }} />
                  <img src="https://flagcdn.com/pt.svg" width="20" alt="PT" style={{ borderRadius: '2px' }} />
                  <span style={{ marginLeft: '5px' }}>Português</span>
                </button>
                <button onClick={() => { setLang('en'); setLangOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '0.6rem 1rem', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <img src="https://flagcdn.com/us.svg" width="20" alt="US" style={{ borderRadius: '2px' }} />
                  <img src="https://flagcdn.com/gb.svg" width="20" alt="GB" style={{ borderRadius: '2px' }} />
                  <span style={{ marginLeft: '5px' }}>English</span>
                </button>
                <button onClick={() => { setLang('es'); setLangOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '0.6rem 1rem', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <img src="https://flagcdn.com/es.svg" width="20" alt="ES" style={{ borderRadius: '2px' }} />
                  <span style={{ marginLeft: '5px' }}>Español</span>
                </button>
              </div>
            )}
          </div>

          <Link href="/contato" style={{ padding: '0.5rem 1.5rem', border: '1px solid var(--purple-neon)', borderRadius: '8px', color: 'var(--purple-neon)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>
            {t.nav_contato}
          </Link>
        </div>
      </div>
    </header>
  );
}