import { motion } from 'framer-motion';

// BARN - 2x2 tile building, FarmVille 2 style
export const BarnSVG = ({ size = 100 }: { size?: number }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 100 85" style={{ filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))' }}>
    {/* Foundation */}
    <rect x="5" y="70" width="90" height="10" rx="2" fill="#9E9E9E" />
    <rect x="5" y="72" width="90" height="4" fill="#BDBDBD" opacity={0.3} />
    {/* Main body */}
    <rect x="10" y="30" width="80" height="42" fill="#E53935" />
    <rect x="10" y="30" width="80" height="3" fill="#EF5350" opacity={0.5} />
    {/* Wood grain lines */}
    {[38, 46, 54, 62].map(y => (
      <line key={y} x1="10" y1={y} x2="90" y2={y} stroke="#C62828" strokeWidth="0.5" opacity={0.3} />
    ))}
    {/* Roof */}
    <polygon points="0,32 50,2 100,32" fill="#B71C1C" />
    <polygon points="5,32 50,5 95,32" fill="#C62828" opacity={0.5} />
    {/* Roof trim */}
    <line x1="0" y1="32" x2="100" y2="32" stroke="white" strokeWidth="2" />
    {/* Door */}
    <path d="M36,72 L36,48 Q50,42 64,48 L64,72 Z" fill="#795548" />
    <line x1="50" y1="48" x2="50" y2="72" stroke="#5D4037" strokeWidth="1.5" />
    {/* X pattern on door */}
    <line x1="38" y1="50" x2="48" y2="70" stroke="#5D4037" strokeWidth="0.8" opacity={0.5} />
    <line x1="48" y1="50" x2="38" y2="70" stroke="#5D4037" strokeWidth="0.8" opacity={0.5} />
    <line x1="52" y1="50" x2="62" y2="70" stroke="#5D4037" strokeWidth="0.8" opacity={0.5} />
    <line x1="62" y1="50" x2="52" y2="70" stroke="#5D4037" strokeWidth="0.8" opacity={0.5} />
    {/* Hay bale */}
    <ellipse cx="50" cy="68" rx="8" ry="5" fill="#FFD54F" />
    <line x1="42" y1="68" x2="58" y2="68" stroke="#FFA000" strokeWidth="0.5" />
    {/* Windows */}
    <rect x="16" y="44" width="12" height="12" rx="1" fill="#B3E5FC" stroke="white" strokeWidth="1.5" />
    <line x1="22" y1="44" x2="22" y2="56" stroke="white" strokeWidth="1" />
    <line x1="16" y1="50" x2="28" y2="50" stroke="white" strokeWidth="1" />
    <rect x="72" y="44" width="12" height="12" rx="1" fill="#B3E5FC" stroke="white" strokeWidth="1.5" />
    <line x1="78" y1="44" x2="78" y2="56" stroke="white" strokeWidth="1" />
    <line x1="72" y1="50" x2="84" y2="50" stroke="white" strokeWidth="1" />
    {/* Weathervane */}
    <line x1="50" y1="2" x2="50" y2="-6" stroke="#5D4037" strokeWidth="1.5" />
    <polygon points="46,-6 54,-6 50,-2" fill="#5D4037" />
    <text x="50" y="-4" textAnchor="middle" fontSize="5" fill="#795548">🐓</text>
  </svg>
);

// WELL - 1 tile
export const WellSVG = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.25))' }}>
    {/* Stone base */}
    <ellipse cx="24" cy="36" rx="16" ry="6" fill="#9E9E9E" />
    <ellipse cx="24" cy="34" rx="14" ry="5" fill="#BDBDBD" />
    {/* Water */}
    <motion.ellipse cx="24" cy="34" rx="10" ry="3.5" fill="#42A5F5" opacity={0.6}
      animate={{ rx: [10, 11, 10], ry: [3.5, 4, 3.5] }}
      transition={{ repeat: Infinity, duration: 2 }} />
    {/* Posts */}
    <rect x="12" y="10" width="4" height="26" fill="#795548" />
    <rect x="32" y="10" width="4" height="26" fill="#795548" />
    {/* Crossbeam */}
    <rect x="10" y="8" width="28" height="4" rx="1" fill="#8D6E63" />
    {/* Rope */}
    <line x1="24" y1="12" x2="24" y2="28" stroke="#795548" strokeWidth="1" strokeDasharray="2 1" />
    {/* Bucket */}
    <path d="M20,28 L22,34 L26,34 L28,28 Z" fill="#795548" />
    <line x1="20" y1="28" x2="28" y2="28" stroke="#8D6E63" strokeWidth="1.5" />
    {/* Small roof */}
    <polygon points="8,10 24,0 40,10" fill="#E53935" />
    <line x1="8" y1="10" x2="40" y2="10" stroke="#B71C1C" strokeWidth="0.5" />
  </svg>
);

// OAK TREE
export const TreeSVG = ({ size = 40, hasApples = false }: { size?: number; hasApples?: boolean }) => (
  <motion.svg width={size} height={size * 1.1} viewBox="0 0 44 48"
    animate={{ rotate: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
    style={{ transformOrigin: 'bottom center', filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))' }}>
    {/* Trunk */}
    <rect x="18" y="28" width="8" height="18" rx="2" fill="#795548" />
    <rect x="20" y="30" width="3" height="14" fill="#8D6E63" opacity={0.4} />
    {/* Canopy layers */}
    <circle cx="22" cy="20" r="14" fill="#388E3C" />
    <circle cx="16" cy="16" r="10" fill="#2E7D32" />
    <circle cx="28" cy="18" r="11" fill="#43A047" />
    {/* Highlight */}
    <circle cx="28" cy="12" r="5" fill="#66BB6A" opacity={0.5} />
    {/* Apples if apple tree */}
    {hasApples && (
      <>
        <circle cx="14" cy="18" r="2.5" fill="#E53935" />
        <circle cx="26" cy="14" r="2.5" fill="#E53935" />
        <circle cx="20" cy="22" r="2.5" fill="#E53935" />
        <circle cx="30" cy="22" r="2" fill="#E53935" />
        <circle cx="18" cy="12" r="2" fill="#E53935" />
        {/* Small stems */}
        <line x1="14" y1="16" x2="14" y2="15" stroke="#795548" strokeWidth="0.5" />
        <line x1="26" y1="12" x2="26" y2="11" stroke="#795548" strokeWidth="0.5" />
      </>
    )}
  </motion.svg>
);

// Fence segment
export const FenceSegment = ({ width = 64 }: { width?: number }) => (
  <svg width={width} height="20" viewBox="0 0 64 20" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }}>
    {/* Posts */}
    <rect x="0" y="0" width="6" height="20" rx="1" fill="#8D6E63" />
    <rect x="1" y="0" width="2" height="20" fill="#A1887F" opacity={0.3} />
    <rect x="58" y="0" width="6" height="20" rx="1" fill="#8D6E63" />
    {/* Rails */}
    <rect x="6" y="4" width="52" height="3" rx="1" fill="#A1887F" />
    <rect x="6" y="13" width="52" height="3" rx="1" fill="#A1887F" />
    {/* Shadow on rails */}
    <rect x="6" y="6" width="52" height="1" fill="#795548" opacity={0.2} />
    <rect x="6" y="15" width="52" height="1" fill="#795548" opacity={0.2} />
  </svg>
);

// SVG Cloud
export const CloudSVG = ({ size = 60, opacity = 0.9 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 60 30" opacity={opacity}>
    <circle cx="20" cy="18" r="12" fill="white" />
    <circle cx="32" cy="14" r="14" fill="white" />
    <circle cx="44" cy="18" r="10" fill="white" />
    <circle cx="26" cy="20" r="10" fill="white" />
    <circle cx="38" cy="20" r="10" fill="white" />
  </svg>
);

// Sun
export const SunSVG = ({ size = 40 }: { size?: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40"
    style={{ filter: 'drop-shadow(0 0 8px #FFD700)' }}>
    {/* Rays */}
    <motion.g animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 120, ease: 'linear' }}
      style={{ transformOrigin: '20px 20px' }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <line key={i}
            x1={20 + Math.cos(angle) * 14} y1={20 + Math.sin(angle) * 14}
            x2={20 + Math.cos(angle) * 19} y2={20 + Math.sin(angle) * 19}
            stroke="#FFD700" strokeWidth="1.5" />
        );
      })}
    </motion.g>
    {/* Core */}
    <motion.circle cx="20" cy="20" r="10" fill="#FFD700"
      animate={{ r: [10, 11, 10] }} transition={{ repeat: Infinity, duration: 3 }} />
    <circle cx="20" cy="20" r="7" fill="#FFA000" opacity={0.3} />
  </motion.svg>
);

// Moon crescent
export const MoonSVG = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30"
    style={{ filter: 'drop-shadow(0 0 10px rgba(227,242,253,0.5))' }}>
    <circle cx="15" cy="15" r="10" fill="#FFF9C4" />
    <circle cx="20" cy="12" r="9" fill="#203A43" />
  </svg>
);
