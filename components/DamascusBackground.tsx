// components/DamascusBackground.tsx
export default function DamascusBackground() {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: '#05000A', // Fundo extremamente escuro com toque de roxo
        pointerEvents: 'none',
        overflow: 'hidden',
        // A MÁSCARA: Esconde o padrão no meio da tela e revela nas bordas
        maskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 85%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 85%)',
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="damascus-pattern" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            <g fill="none" strokeWidth="1.5">
              {/* Linhas Roxas (Aço) */}
              <path d="M-50,150 C50,50 150,250 250,100 S350,250 450,50" stroke="#B026FF" opacity="0.15" />
              <path d="M-50,180 C50,80 150,280 250,130 S350,280 450,80" stroke="#B026FF" opacity="0.1" />
              <path d="M-50,120 C50,20 150,220 250,70 S350,220 450,20" stroke="#B026FF" opacity="0.12" />
              
              {/* Linhas Douradas (Veios de Ouro) */}
              <path d="M150,-50 C50,50 250,150 100,250 S250,350 50,450" stroke="#D4AF37" opacity="0.2" />
              <path d="M180,-50 C80,50 280,150 130,250 S280,350 80,450" stroke="#D4AF37" opacity="0.1" />
              
              {/* Linhas Cruzadas Suaves */}
              <path d="M-50,-50 Q150,150 350,-50" stroke="#fff" opacity="0.02" />
              <path d="M-50,350 Q150,150 350,350" stroke="#fff" opacity="0.02" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#damascus-pattern)" />
      </svg>
      
      {/* Vinheta Radial para dar profundidade */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(176, 38, 255, 0.1) 0%, transparent 60%)',
      }} />
    </div>
  );
}