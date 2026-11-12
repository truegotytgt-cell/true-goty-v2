// app/contato/page.tsx
'use client';

export default function Contato() {
  const copiarEmail = () => {
    navigator.clipboard.writeText('truegoty.tgt@gmail.com');
    alert('E-mail copiado para a área de transferência!');
  };

  return (
    <main style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh', 
      padding: '2rem' 
    }}>
      <div style={{ 
        backgroundColor: 'var(--bg-gray)', 
        padding: '4rem 3rem', 
        borderRadius: '16px', 
        border: '2px solid var(--border-color)', 
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>✉️</span>
        
        <h1 style={{ 
          color: 'var(--text-light)', 
          fontSize: '2.5rem', 
          fontWeight: 900, 
          marginBottom: '1rem' 
        }}>
          FALE CONOSCO
        </h1>
        
        <p style={{ 
          color: '#a1a1aa', 
          fontSize: '1.1rem', 
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Tem alguma dúvida, sugestão ou quer anunciar no TGT?<br/>
          Estamos sempre abertos a parcerias e feedbacks da comunidade.
        </p>

        <div style={{ 
          backgroundColor: 'rgba(0,0,0,0.3)', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          border: '1px solid var(--border-color)', 
          marginBottom: '2rem' 
        }}>
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            color: 'var(--purple-neon)' 
          }}>
            truegoty.tgt@gmail.com
          </span>
        </div>

        <button 
          onClick={copiarEmail}
          style={{
            backgroundColor: 'var(--purple-neon)',
            color: '#FFF',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(176, 38, 255, 0.4)',
            transition: 'transform 0.2s'
          }}
        >
          COPIAR E-MAIL
        </button>
      </div>
    </main>
  );
}