// components/DamascusBackground.tsx
export default function DamascusBackground() {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: '#05000A', 
        pointerEvents: 'none',
        overflow: 'hidden',
        maskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 85%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 85%)',
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="damascus-pattern" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse">
            <g fill="none" strokeWidth="1.5">
              {/* Roxo um pouco mais visível (0.35 -> 0.45) */}
              <path d="M0,200 C200,50 600,350 800,200" stroke="#A855F7" opacity="0.45" />
              <path d="M0,250 C200,100 600,400 800,250" stroke="#A855F7" opacity="0.2" />
              <path d="M0,600 C200,450 600,750 800,600" stroke="#A855F7" opacity="0.3" />
              
              {/* Dourado mantido sutil */}
              <path d="M0,400 C200,250 600,550 800,400" stroke="#FACC15" opacity="0.25" />
              <path d="M0,450 C200,300 600,600 800,450" stroke="#FACC15" opacity="0.1" />

              <path d="M0,50 C300,200 500,0 800,150" stroke="#A855F7" opacity="0.2" />
              <path d="M0,700 C300,550 500,850 800,650" stroke="#FACC15" opacity="0.15" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#damascus-pattern)" />
      </svg>
      
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 60%)',
      }} />
    </div>
  );
}