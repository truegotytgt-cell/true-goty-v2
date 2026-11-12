// app/resultados/page.tsx
'use client';

import Link from 'next/link';

export default function ResultadosHub() {
  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh', 
      padding: '2rem' 
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 900, 
        color: 'var(--text-light)', 
        marginBottom: '3rem',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        O QUE VOCÊ QUER VER?
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem', 
        maxWidth: '900px', 
        width: '100%' 
      }}>
        
        {/* COLUNA TGT */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          padding: '2rem',
          backgroundColor: 'rgba(28, 28, 30, 0.6)',
          borderRadius: '24px',
          border: '1px solid rgba(176, 38, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            color: 'var(--purple-neon)', 
            fontSize: '2rem', 
            fontWeight: 900, 
            textAlign: 'center',
            textShadow: '0 0 10px rgba(176, 38, 255, 0.5)'
          }}>
            TRUE GOTY
          </h2>
          
          <Link href="/ranking" style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'var(--text-light)',
            border: '1px solid #333',
            transition: 'border-color 0.2s'
          }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, marginBottom: '0.5rem' }}>PLACAR GLOBAL</h3>
            <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: 0 }}>A soma de todos os votos da comunidade.</p>
          </Link>

          <Link href="/votar" style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'var(--text-light)',
            border: '1px solid #333',
            transition: 'border-color 0.2s'
          }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, marginBottom: '0.5rem' }}>MEU RANKING PESSOAL</h3>
            <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: 0 }}>Faça o seu ranking e envie para o placar.</p>
          </Link>
        </div>

        {/* COLUNA MERCADO */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          padding: '2rem',
          backgroundColor: 'rgba(28, 28, 30, 0.3)',
          borderRadius: '24px',
          border: '1px solid #333',
          opacity: 0.6
        }}>
          <h2 style={{ 
            color: '#a1a1aa', 
            fontSize: '2rem', 
            fontWeight: 900, 
            textAlign: 'center'
          }}>
            MERCADO
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '1px dashed #444',
            cursor: 'not-allowed'
          }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, marginBottom: '0.5rem', color: '#666' }}>COMPARATIVO (EM BREVE)</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Aguardando anúncio oficial da premiação.</p>
          </div>
        </div>

      </div>
    </main>
  );
}