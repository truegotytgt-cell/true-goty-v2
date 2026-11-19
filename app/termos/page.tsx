'use client';

import Link from 'next/link';
import { useLanguage } from '../../components/LanguageProvider';

export default function Termos() {
  const { t } = useLanguage();

  return (
    <main style={{ padding: '6rem 2rem', color: 'var(--text-light)', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>
        {t.termos_titulo}
      </h1>

      <div style={{ color: '#a1a1aa', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p>{t.termos_p1}</p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>{t.termos_h2_1}</h2>
        <p>{t.termos_p2}</p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>{t.termos_h2_2}</h2>
        <p>{t.termos_p3}</p>

        <h2 style={{ color: 'white', fontSize: '1.5rem', marginTop: '1rem' }}>{t.termos_h2_3}</h2>
        <p>{t.termos_p4}</p>

        <div style={{ marginTop: '3rem' }}>
          <Link href="/" style={{ color: 'var(--purple-neon)', textDecoration: 'none', fontWeight: 'bold' }}>
            {t.termos_voltar}
          </Link>
        </div>
      </div>
    </main>
  );
}