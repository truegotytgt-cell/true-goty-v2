// app/sobre/page.tsx
export default function Sobre() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', color: 'var(--text-light)' }}>
      <h1 style={{ color: 'var(--purple-neon)', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>A NOSSA HISTÓRIA</h1>
      
      <div style={{ backgroundColor: 'var(--bg-gray)', padding: '2rem', borderRadius: '16px', border: '1px solid #333', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1rem' }}>O TGT (True GOTY) nasceu de uma frustração compartilhada por muitos gamers: a sensação de que as grandes premiações da indústria nem sempre refletem a voz real da comunidade.</p>
        <p style={{ marginBottom: '1rem' }}>Acreditamos que o verdadeiro Jogo do Ano não é aquele escolhido por um júri restrito ou influenciado por interesses corporativos. O verdadeiro vencedor deve ser aquele que marcou a vida dos jogadores, aquele que gerou as melhores discussões e aquele que o público realmente amou jogar.</p>
        <p style={{ marginBottom: '2rem' }}>Por isso, construímos este sistema usando o Método de Condorcet, forçando comparações diretas (Mano a Mano) para que o vencedor seja a escolha mais justa da comunidade. Este é um projeto independente, feito por gamers e para gamers.</p>
        
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Para parcerias, patrocínios ou apenas para trocar uma ideia:</p>
          <span style={{ color: 'var(--purple-neon)', fontSize: '1.2rem', fontWeight: 'bold' }}>truegoty.tgt@gmail.com</span>
        </div>
      </div>
    </main>
  );
}