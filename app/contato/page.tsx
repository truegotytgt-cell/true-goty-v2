// app/contato/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Contato() {
  const [copiado, setCopiado] = useState(false);
  const email = "truegoty.tgt@gmail.com";

  const copiarEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000); // Volta ao normal após 3 segundos
    });
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
      
      <div style={{ 
        backgroundColor: 'rgba(28, 28, 30, 0.5)', backdropFilter: 'blur(10px)', 
        border: '2px solid var(--border-color)', borderRadius: '24px', padding: '4rem 3rem',
        textAlign: 'center', maxWidth: '600px', width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        
        <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--purple-neon)', textShadow: '0 0 20px rgba(176, 38, 255, 0.6)' }}>
          ✉️
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFF', marginBottom: '1rem' }}>
          FALE CONOSCO
        </h1>
        
        <p style={{ color: '#D1D5DB', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Tem alguma dúvida, sugestão ou quer anunciar no TGT? Estamos sempre abertos a parcerias, patrocínios e feedbacks da comunidade.
        </p>

        <div style={{ 
          backgroundColor: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '8px', 
          border: '1px solid #333', marginBottom: '2rem' 
        }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--purple-neon)' }}>
            {email}
          </span>
        </div>

        <button 
          onClick={copiarEmail}
          style={{ 
            backgroundColor: copiado ? '#10b981' : 'var(--purple-neon)', // Fica verde se copiado
            color: '#FFF', padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 900, 
            border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s',
            boxShadow: copiado ? '0 0 20px rgba(16, 185, 129, 0.4)' : '0 0 30px rgba(176, 38, 255, 0.4)'
          }}
        >
          {copiado ? 'E-MAIL COPIADO!' : 'COPIAR E-MAIL'}
        </button>

        <div style={{ marginTop: '2rem' }}>
          <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Voltar para o Início
          </Link>
        </div>

      </div>
    </main>
  );
}