// components/Footer.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{
      width: '100%',
      padding: '3rem 1rem',
      backgroundColor: 'transparent',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      textAlign: 'center',
      marginTop: 'auto', 
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.85rem' }}>
        <Link href="/termos" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#FFF'}
          onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}
        >
          {t.footer_termos}
        </Link>
        <span style={{ color: '#333' }}>|</span>
        <Link href="/privacidade" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#FFF'}
          onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}
        >
          {t.footer_privacidade}
        </Link>
      </div>
      <p style={{ color: '#52525b', fontSize: '0.75rem', margin: 0, letterSpacing: '0.5px' }}>
        {t.footer_direitos}
      </p>
    </footer>
  );
}