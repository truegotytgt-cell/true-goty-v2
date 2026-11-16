// components/Footer.tsx
'use client'; // <-- OBRIGATÓRIO para usar o hook de idioma

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage(); // <-- Puxando as traduções

  return (
    <footer style={{
      width: '100%',
      padding: '2rem 1rem',
      backgroundColor: 'var(--bg-color)',
      borderTop: '1px solid #222',
      textAlign: 'center',
      marginTop: 'auto', 
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.85rem' }}>
        <Link href="/termos" style={{ color: 'var(--purple-neon)', textDecoration: 'none' }}>
          {t.footer_termos}
        </Link>
        <span style={{ color: '#333' }}>|</span>
        <Link href="/privacidade" style={{ color: 'var(--purple-neon)', textDecoration: 'none' }}>
          {t.footer_privacidade}
        </Link>
      </div>
      <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>
        {t.footer_direitos}
      </p>
    </footer>
  );
}