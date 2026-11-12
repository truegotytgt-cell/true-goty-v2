// app/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [votos, setVotos] = useState<number | null>(null);

  useEffect(() => {
    // Busca a contagem (vamos criar essa API no próximo passo)
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVotos(data.totalVoters);
      })
      .catch(() => setVotos(0));
  }, []);

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh', 
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        fontWeight: 900, 
        color: 'var(--text-light)', 
        lineHeight: 1.1,
        marginBottom: '1rem',
        textShadow: '0 0 20px rgba(255,255,255,0.1)'
      }}>
        QUAL É O VERDADEIRO<br/>
        <span style={{ color: 'var(--purple-neon)' }}>GAME OF THE YEAR?</span>
      </h1>

      <p style={{ 
        fontSize: '1.2rem', 
        color: '#a1a1aa', 
        maxWidth: '600px', 
        marginBottom: '3rem' 
      }}>
        Voz aos jogadores. Sem corporativismo, apenas a opinião da comunidade.
      </p>

      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--purple-neon)', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem' 
      }}>
        Escolha qual ranking você quer visualizar:
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/votar" style={{
          backgroundColor: 'var(--purple-neon)',
          color: '#FFF',
          padding: '1.2rem 3rem',
          fontSize: '1.2rem',
          fontWeight: 900,
          borderRadius: '8px',
          textDecoration: 'none',
          boxShadow: '0 0 30px rgba(176, 38, 255, 0.4)',
          transition: 'transform 0.2s'
        }}>
          VOTAR NO TGT
        </Link>

        <button disabled style={{
          backgroundColor: 'transparent',
          color: '#666',
          padding: '1.2rem 3rem',
          fontSize: '1.2rem',
          fontWeight: 900,
          borderRadius: '8px',
          border: '1px solid #333',
          cursor: 'not-allowed'
        }}>
          COMPARATIVO MERCADO (EM BREVE)
        </button>
      </div>

      {/* Contador de Votos */}
      <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '2.5rem', 
          fontWeight: 900, 
          color: 'var(--purple-neon)',
          textShadow: '0 0 15px rgba(176, 38, 255, 0.5)'
        }}>
          {votos === null ? '...' : votos.toLocaleString('pt-BR')}
        </span>
        <span style={{ 
          fontSize: '0.85rem', 
          color: '#a1a1aa', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          marginTop: '0.5rem'
        }}>
          pessoas já decidiram seu TRUE GOTY
        </span>
      </div>
    </main>
  );
}