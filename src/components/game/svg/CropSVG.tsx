import React from 'react';
import { motion } from 'framer-motion';

interface CropSVGProps {
  cropKey: string;
  stage: number; // 0=seedling, 1=growing, 2=ready
  size?: number;
}

const sway = {
  animate: { rotate: [-2, 2, -2] },
  transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
};

const shimmer = {
  animate: { filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] },
  transition: { repeat: Infinity, duration: 1.5 },
};

// Seedling (shared stage 0)
const Seedling = ({ size }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...sway} style={{ transformOrigin: 'bottom center' }}>
    <line x1="20" y1="32" x2="20" y2="20" stroke="#795548" strokeWidth="2" />
    <ellipse cx="16" cy="18" rx="6" ry="4" fill="#A5D6A7" transform="rotate(-20 16 18)" />
    <ellipse cx="24" cy="18" rx="6" ry="4" fill="#A5D6A7" transform="rotate(20 24 18)" />
  </motion.svg>
);

// Growing (shared stage 1)
const Growing = ({ size, color = '#66BB6A' }: { size: number; color?: string }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...sway} style={{ transformOrigin: 'bottom center' }}>
    <line x1="20" y1="34" x2="20" y2="14" stroke="#795548" strokeWidth="2.5" />
    <ellipse cx="14" cy="16" rx="7" ry="4.5" fill={color} transform="rotate(-25 14 16)" />
    <ellipse cx="26" cy="16" rx="7" ry="4.5" fill={color} transform="rotate(25 26 16)" />
    <ellipse cx="12" cy="22" rx="6" ry="3.5" fill={color} transform="rotate(-15 12 22)" opacity={0.8} />
    <ellipse cx="28" cy="22" rx="6" ry="3.5" fill={color} transform="rotate(15 28 22)" opacity={0.8} />
  </motion.svg>
);

// WHEAT ready
const WheatReady = ({ size }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...shimmer}>
    {[14, 20, 26].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="34" x2={x} y2={10 + i * 2} stroke="#FFD54F" strokeWidth="2" />
        <ellipse cx={x + 2} cy={10 + i * 2} rx="3" ry="5" fill="#FFA000" transform={`rotate(15 ${x + 2} ${10 + i * 2})`} />
        <ellipse cx={x + 1} cy={12 + i * 2} rx="2.5" ry="4" fill="#FFB300" transform={`rotate(10 ${x + 1} ${12 + i * 2})`} />
      </g>
    ))}
  </motion.svg>
);

// CORN ready
const CornReady = ({ size }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...shimmer}>
    <line x1="20" y1="36" x2="20" y2="6" stroke="#388E3C" strokeWidth="3" />
    <ellipse cx="24" cy="16" rx="5" ry="9" fill="#FFD700" />
    <path d="M19 12 Q17 16 19 22" stroke="#66BB6A" strokeWidth="2" fill="none" />
    <path d="M29 12 Q31 16 29 22" stroke="#66BB6A" strokeWidth="2" fill="none" />
    <ellipse cx="14" cy="10" rx="8" ry="3" fill="#66BB6A" transform="rotate(-30 14 10)" />
    <ellipse cx="26" cy="8" rx="8" ry="3" fill="#66BB6A" transform="rotate(30 26 8)" />
    {/* Kernel lines */}
    {[12, 15, 18].map(y => (
      <line key={y} x1="21" y1={y} x2="27" y2={y} stroke="#FFA000" strokeWidth="0.5" opacity={0.6} />
    ))}
  </motion.svg>
);

// TOMATO ready
const TomatoReady = ({ size }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...shimmer}>
    {/* Bush leaves */}
    <ellipse cx="20" cy="22" rx="14" ry="10" fill="#388E3C" />
    <ellipse cx="20" cy="20" rx="12" ry="8" fill="#43A047" />
    {/* Tomatoes */}
    <circle cx="14" cy="22" r="5" fill="#E53935" />
    <circle cx="24" cy="20" r="5.5" fill="#E53935" />
    <circle cx="18" cy="26" r="4.5" fill="#D32F2F" />
    {/* Highlights */}
    <circle cx="12" cy="20" r="1.5" fill="white" opacity={0.3} />
    <circle cx="22" cy="18" r="1.5" fill="white" opacity={0.3} />
    {/* Stem tops */}
    <path d="M14 17 L14 15 M24 15 L24 13" stroke="#2E7D32" strokeWidth="1" />
  </motion.svg>
);

// CARROT ready
const CarrotReady = ({ size }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...sway} style={{ transformOrigin: 'bottom center' }}>
    {/* Green top */}
    {[-8, -3, 3, 8].map((dx, i) => (
      <path key={i} d={`M${20 + dx} 14 Q${20 + dx + (i % 2 ? 2 : -2)} 6 ${20 + dx} 2`}
        stroke="#66BB6A" strokeWidth="2" fill="none" />
    ))}
    {/* Carrot body */}
    <path d="M14 16 Q13 24 16 32 L20 36 L24 32 Q27 24 26 16 Z" fill="#FF8F00" />
    <path d="M16 16 Q15 24 18 32" stroke="#E65100" strokeWidth="0.5" opacity={0.4} />
    <path d="M22 16 Q23 24 21 32" stroke="#E65100" strokeWidth="0.5" opacity={0.4} />
  </motion.svg>
);

// BERRY (Strawberry) ready
const BerryReady = ({ size }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...shimmer}>
    {/* Low bush */}
    <ellipse cx="20" cy="26" rx="16" ry="8" fill="#388E3C" />
    <ellipse cx="20" cy="24" rx="14" ry="6" fill="#43A047" />
    {/* Strawberries */}
    <path d="M12 26 Q10 30 12 34 Q14 36 16 34 Q18 30 16 26 Z" fill="#E53935" />
    <path d="M22 24 Q20 28 22 32 Q24 34 26 32 Q28 28 26 24 Z" fill="#E53935" />
    {/* Seeds */}
    {[{x:13,y:30},{x:15,y:28},{x:23,y:28},{x:25,y:26}].map((s,i) => (
      <circle key={i} cx={s.x} cy={s.y} r="0.7" fill="#FFD54F" />
    ))}
    {/* White flower */}
    <circle cx="28" cy="22" r="3" fill="white" opacity={0.8} />
    <circle cx="28" cy="22" r="1" fill="#FFD54F" />
  </motion.svg>
);

// PUMPKIN ready
const PumpkinReady = ({ size }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 40 40" {...shimmer}>
    {/* Vine */}
    <path d="M8 18 Q4 14 8 10" stroke="#66BB6A" strokeWidth="1.5" fill="none" />
    {/* Main pumpkin body */}
    <ellipse cx="20" cy="26" rx="14" ry="10" fill="#FF6F00" />
    {/* Ridge lines */}
    <path d="M10 26 Q14 16 20 14 Q26 16 30 26" stroke="#E65100" strokeWidth="1" fill="none" opacity={0.5} />
    <path d="M12 28 Q16 22 20 20 Q24 22 28 28" stroke="#E65100" strokeWidth="0.8" fill="none" opacity={0.4} />
    <line x1="20" y1="16" x2="20" y2="32" stroke="#E65100" strokeWidth="0.8" opacity={0.3} />
    {/* Stem */}
    <rect x="18" y="14" width="4" height="4" rx="1" fill="#795548" />
    {/* Highlight */}
    <ellipse cx="15" cy="24" rx="3" ry="5" fill="white" opacity={0.1} />
  </motion.svg>
);

const CropSVGComponent = ({ cropKey, stage, size = 32 }: CropSVGProps) => {
  if (stage === 0) return <Seedling size={size} />;
  if (stage === 1) return <Growing size={size} color={cropKey === 'wheat' ? '#A5D6A7' : '#66BB6A'} />;

  switch (cropKey) {
    case 'wheat': return <WheatReady size={size} />;
    case 'corn': return <CornReady size={size} />;
    case 'tomato': return <TomatoReady size={size} />;
    case 'carrot': return <CarrotReady size={size} />;
    case 'berry': return <BerryReady size={size} />;
    case 'pumpkin': return <PumpkinReady size={size} />;
    default: return <WheatReady size={size} />;
  }
};

export const CropSVG = React.memo(CropSVGComponent);
