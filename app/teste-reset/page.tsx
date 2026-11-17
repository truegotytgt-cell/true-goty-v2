// app/teste-reset/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TesteReset() {
  const [limpando, setLimpando] = useState(false);
  const router = useRouter();

  const limparTudo = async () => {
    if (!confirm("ATENÇÃO: Isso vai apagar TODOS os votos do banco D1 e do seu navegador. Tem certeza?")) return;
    
    setLimpando(true);
    try {
      // 1. Limpa o banco D1
      const res = await fetch('/api/reset', { method: 'POST' });
      const json = await res.json();

      if (json.success) {
        // 2. Limpa o localStorage do navegador
        // Passamos por todas as chaves que o site usa e as apagamos
        localStorage.removeItem('tgt_progress_tgt');
        localStorage.removeItem('tgt_my_ranking_tgt');
        localStorage.removeItem('tgt_has_voted_tgt');
        localStorage.removeItem('tgt_progress_mercado');
        localStorage.removeItem('tgt_my_ranking_mercado');
        localStorage.removeItem('tgt_has_voted_mercado');
        
        alert("Sucesso! Banco e memória do navegador foram zerados. Você já pode testar a votação do zero.");
        router.push('/');
      } else {
        alert("Erro ao limpar o banco: " + json.error);
      }
    } catch (e) {
      alert("Erro de conexão ao tentar limpar.");
    } finally {
      setLimpando(false);
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#ef4444', fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>PAINEL DE TESTES</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '2rem', maxWidth: '500px' }}>
        Use este botão para apagar todos os votos do banco de dados D1 e limpar o progresso salvo no seu navegador. Útil para testar a votação múltiplas vezes antes do lançamento.
      </p>
      
      <button 
        onClick={limparTudo} 
        disabled={limpando}
        style={{ 
          backgroundColor: '#ef4444', color: '#FFF', padding: '1rem 3rem', fontSize: '1.2rem', 
          fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: limpando ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
        }}
      >
        {limpando ? 'LIMPANDO...' : 'APAGAR TUDO E RESETAR'}
      </button>
    </main>
  );
}