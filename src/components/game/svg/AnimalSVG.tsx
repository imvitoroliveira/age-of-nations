import React from 'react';
import { motion } from 'framer-motion';

interface AnimalSVGProps {
  animalId: string;
  size?: number;
  facingLeft?: boolean;
  isWalking?: boolean;
}

const legWalk = (duration: number) => ({
  animate: { rotate: [-15, 15, -15] },
  transition: { repeat: Infinity, duration, ease: 'easeInOut' as const },
});

const bodyBounce = (duration: number) => ({
  animate: { y: [0, -2, 0] },
  transition: { repeat: Infinity, duration, ease: 'easeInOut' as const },
});

// COW - geometric/cartoon style
const CowSVG = ({ size, isWalking }: { size: number; isWalking: boolean }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 60 42">
    {/* Legs */}
    <motion.rect x="12" y="28" width="5" height="12" rx="2" fill="#795548" style={{ transformOrigin: '14px 28px' }}
      {...(isWalking ? legWalk(0.6) : {})} />
    <motion.rect x="22" y="28" width="5" height="12" rx="2" fill="#795548" style={{ transformOrigin: '24px 28px' }}
      {...(isWalking ? { ...legWalk(0.6), transition: { ...legWalk(0.6).transition, delay: 0.15 } } : {})} />
    <motion.rect x="35" y="28" width="5" height="12" rx="2" fill="#795548" style={{ transformOrigin: '37px 28px' }}
      {...(isWalking ? legWalk(0.6) : {})} />
    <motion.rect x="45" y="28" width="5" height="12" rx="2" fill="#795548" style={{ transformOrigin: '47px 28px' }}
      {...(isWalking ? { ...legWalk(0.6), transition: { ...legWalk(0.6).transition, delay: 0.15 } } : {})} />
    {/* Body */}
    <motion.g {...(isWalking ? bodyBounce(0.6) : {})}>
      <rect x="8" y="12" width="44" height="20" rx="8" fill="white" />
      {/* Patches */}
      <ellipse cx="20" cy="20" rx="6" ry="5" fill="#333" opacity={0.7} />
      <ellipse cx="38" cy="18" rx="5" ry="4" fill="#333" opacity={0.6} />
      <ellipse cx="30" cy="26" rx="4" ry="3" fill="#333" opacity={0.5} />
      {/* Udder */}
      <ellipse cx="30" cy="32" rx="5" ry="3" fill="#F48FB1" />
      {/* Head */}
      <rect x="48" y="8" width="12" height="14" rx="4" fill="white" />
      {/* Nose */}
      <rect x="52" y="16" width="8" height="5" rx="2.5" fill="#F48FB1" />
      {/* Eye */}
      <circle cx="54" cy="13" r="2" fill="#333" />
      <circle cx="53.5" cy="12.5" r="0.8" fill="white" />
      {/* Horns */}
      <polygon points="50,8 48,2 52,6" fill="#F48FB1" />
      <polygon points="56,8 58,2 54,6" fill="#F48FB1" />
      {/* Ears */}
      <ellipse cx="48" cy="10" rx="3" ry="2" fill="#F48FB1" transform="rotate(-20 48 10)" />
      {/* Tail */}
      <motion.path d="M8 16 Q2 14 4 20 Q2 24 6 22" stroke="#795548" strokeWidth="1.5" fill="none"
        animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ transformOrigin: '8px 16px' }} />
    </motion.g>
  </svg>
);

// CHICKEN
const ChickenSVG = ({ size, isWalking }: { size: number; isWalking: boolean }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 36 30">
    {/* Legs */}
    <motion.g style={{ transformOrigin: '14px 22px' }} {...(isWalking ? legWalk(0.4) : {})}>
      <line x1="14" y1="22" x2="14" y2="28" stroke="#FF8F00" strokeWidth="2" />
      <line x1="11" y1="28" x2="17" y2="28" stroke="#FF8F00" strokeWidth="1.5" />
    </motion.g>
    <motion.g style={{ transformOrigin: '22px 22px' }} {...(isWalking ? { ...legWalk(0.4), transition: { ...legWalk(0.4).transition, delay: 0.1 } } : {})}>
      <line x1="22" y1="22" x2="22" y2="28" stroke="#FF8F00" strokeWidth="2" />
      <line x1="19" y1="28" x2="25" y2="28" stroke="#FF8F00" strokeWidth="1.5" />
    </motion.g>
    {/* Body */}
    <motion.g {...(isWalking ? { animate: { x: [-1.5, 1.5, -1.5] }, transition: { repeat: Infinity, duration: 0.4 } } : {})}>
      <ellipse cx="18" cy="18" rx="12" ry="8" fill="white" />
      {/* Wing */}
      <ellipse cx="14" cy="17" rx="5" ry="4" fill="#F5F5F5" />
      {/* Tail */}
      <polygon points="4,14 2,10 6,8 8,12" fill="white" />
      <polygon points="5,16 1,14 4,10" fill="#EEEEEE" />
      {/* Head */}
      <motion.g {...(isWalking ? { animate: { y: [-1, 1, -1] }, transition: { repeat: Infinity, duration: 0.4 } } : {})}>
        <circle cx="26" cy="10" r="6" fill="white" />
        {/* Comb */}
        <circle cx="25" cy="4" r="2" fill="#E53935" />
        <circle cx="27" cy="3.5" r="2.2" fill="#E53935" />
        <circle cx="29" cy="4.5" r="1.8" fill="#E53935" />
        {/* Beak */}
        <polygon points="32,10 36,11 32,13" fill="#FF8F00" />
        {/* Eye */}
        <circle cx="28" cy="9" r="1.5" fill="#333" />
        <circle cx="27.8" cy="8.7" r="0.5" fill="white" />
        {/* Wattle */}
        <ellipse cx="30" cy="14" rx="1.5" ry="2" fill="#E53935" />
      </motion.g>
    </motion.g>
  </svg>
);

// SHEEP
const SheepSVG = ({ size, isWalking }: { size: number; isWalking: boolean }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 50 38">
    {/* Legs */}
    <motion.rect x="12" y="26" width="4" height="10" rx="1.5" fill="#9E9E9E" style={{ transformOrigin: '14px 26px' }}
      {...(isWalking ? legWalk(0.7) : {})} />
    <motion.rect x="20" y="26" width="4" height="10" rx="1.5" fill="#9E9E9E" style={{ transformOrigin: '22px 26px' }}
      {...(isWalking ? { ...legWalk(0.7), transition: { ...legWalk(0.7).transition, delay: 0.15 } } : {})} />
    <motion.rect x="30" y="26" width="4" height="10" rx="1.5" fill="#9E9E9E" style={{ transformOrigin: '32px 26px' }}
      {...(isWalking ? legWalk(0.7) : {})} />
    <motion.rect x="38" y="26" width="4" height="10" rx="1.5" fill="#9E9E9E" style={{ transformOrigin: '40px 26px' }}
      {...(isWalking ? { ...legWalk(0.7), transition: { ...legWalk(0.7).transition, delay: 0.15 } } : {})} />
    {/* Wool body - overlapping circles */}
    <motion.g {...(isWalking ? bodyBounce(0.7) : {})}>
      {[
        { cx: 18, cy: 18, r: 9 }, { cx: 28, cy: 16, r: 9 }, { cx: 38, cy: 18, r: 8 },
        { cx: 22, cy: 22, r: 8 }, { cx: 32, cy: 22, r: 8 }, { cx: 14, cy: 22, r: 7 },
        { cx: 26, cy: 14, r: 7 }, { cx: 36, cy: 22, r: 7 },
      ].map((c, i) => (
        <motion.circle key={i} {...c} fill={i % 2 === 0 ? '#FAFAFA' : '#F0F0F0'}
          {...(isWalking ? { animate: { r: [c.r, c.r * 1.04, c.r] }, transition: { repeat: Infinity, duration: 0.7, delay: i * 0.08 } } : {})} />
      ))}
      {/* Face */}
      <rect x="40" y="12" width="10" height="12" rx="4" fill="#BDBDBD" />
      <circle cx="44" cy="16" r="1.2" fill="#333" />
      <circle cx="48" cy="16" r="1.2" fill="#333" />
      {/* Ears */}
      <ellipse cx="40" cy="12" rx="3" ry="2" fill="#9E9E9E" transform="rotate(-30 40 12)" />
      <ellipse cx="50" cy="12" rx="3" ry="2" fill="#9E9E9E" transform="rotate(30 50 12)" />
    </motion.g>
  </svg>
);

// PIG
const PigSVG = ({ size, isWalking }: { size: number; isWalking: boolean }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 50 38">
    {/* Legs */}
    <motion.rect x="10" y="26" width="5" height="10" rx="2" fill="#F06292" style={{ transformOrigin: '12px 26px' }}
      {...(isWalking ? legWalk(0.5) : {})} />
    <motion.rect x="18" y="26" width="5" height="10" rx="2" fill="#F06292" style={{ transformOrigin: '20px 26px' }}
      {...(isWalking ? { ...legWalk(0.5), transition: { ...legWalk(0.5).transition, delay: 0.12 } } : {})} />
    <motion.rect x="30" y="26" width="5" height="10" rx="2" fill="#F06292" style={{ transformOrigin: '32px 26px' }}
      {...(isWalking ? legWalk(0.5) : {})} />
    <motion.rect x="38" y="26" width="5" height="10" rx="2" fill="#F06292" style={{ transformOrigin: '40px 26px' }}
      {...(isWalking ? { ...legWalk(0.5), transition: { ...legWalk(0.5).transition, delay: 0.12 } } : {})} />
    <motion.g {...(isWalking ? bodyBounce(0.5) : {})}>
      {/* Body */}
      <ellipse cx="25" cy="20" rx="18" ry="12" fill="#F48FB1" />
      <ellipse cx="25" cy="22" rx="16" ry="10" fill="#F8BBD0" opacity={0.5} />
      {/* Head */}
      <circle cx="42" cy="16" r="10" fill="#F48FB1" />
      {/* Snout */}
      <ellipse cx="48" cy="18" rx="5" ry="3.5" fill="#EC407A" />
      <circle cx="46" cy="18" r="1" fill="#C2185B" />
      <circle cx="50" cy="18" r="1" fill="#C2185B" />
      {/* Eyes */}
      <circle cx="40" cy="14" r="1.8" fill="#333" />
      <circle cx="39.5" cy="13.5" r="0.6" fill="white" />
      {/* Ears */}
      <polygon points="36,8 34,2 40,6" fill="#F06292" />
      <polygon points="44,8 46,2 42,4" fill="#F06292" />
      {/* Tail spiral */}
      <motion.path d="M7 16 Q3 12 5 8 Q7 5 9 8" stroke="#F06292" strokeWidth="2" fill="none"
        animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ transformOrigin: '7px 16px' }} />
    </motion.g>
  </svg>
);

// DUCK
const DuckSVG = ({ size, isWalking }: { size: number; isWalking: boolean }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 40 30">
    {/* Feet */}
    <motion.g style={{ transformOrigin: '14px 24px' }} {...(isWalking ? legWalk(0.5) : {})}>
      <polygon points="10,26 18,26 14,24" fill="#FF8F00" />
    </motion.g>
    <motion.g style={{ transformOrigin: '26px 24px' }} {...(isWalking ? { ...legWalk(0.5), transition: { ...legWalk(0.5).transition, delay: 0.12 } } : {})}>
      <polygon points="22,26 30,26 26,24" fill="#FF8F00" />
    </motion.g>
    <motion.g {...(isWalking ? { animate: { rotate: [-4, 4, -4] }, transition: { repeat: Infinity, duration: 0.5 }, style: { transformOrigin: '20px 20px' } } : {})}>
      {/* Body */}
      <ellipse cx="20" cy="18" rx="13" ry="8" fill="white" />
      {/* Wing */}
      <ellipse cx="16" cy="17" rx="6" ry="4" fill="#EEEEEE" />
      {/* Head */}
      <circle cx="32" cy="10" r="6" fill="white" />
      {/* Beak */}
      <polygon points="36,11 40,12 36,14" fill="#FF8F00" />
      {/* Eye */}
      <circle cx="34" cy="9" r="1.3" fill="#333" />
      <circle cx="33.7" cy="8.7" r="0.5" fill="white" />
      {/* Tail */}
      <polygon points="7,14 4,10 8,12" fill="white" />
    </motion.g>
  </svg>
);

// RABBIT
const RabbitSVG = ({ size, isWalking }: { size: number; isWalking: boolean }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 40 34">
    {/* Legs */}
    <ellipse cx="14" cy="28" rx="4" ry="3" fill="#F5F5F5" />
    <ellipse cx="28" cy="28" rx="5" ry="3.5" fill="#F5F5F5" />
    <motion.g {...(isWalking ? { animate: { y: [0, -8, 0] }, transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' } } : {})}>
      {/* Body */}
      <ellipse cx="20" cy="22" rx="12" ry="8" fill="white" />
      {/* Tail */}
      <circle cx="8" cy="20" r="3.5" fill="#F5F5F5" />
      {/* Head */}
      <circle cx="30" cy="14" r="7" fill="white" />
      {/* Ears */}
      <motion.g {...(isWalking ? { animate: { rotate: [-3, 3, -3] }, transition: { repeat: Infinity, duration: 0.6, delay: 0.3 }, style: { transformOrigin: '26px 10px' } } : {})}>
        <ellipse cx="26" cy="2" rx="3" ry="10" fill="white" />
        <ellipse cx="26" cy="2" rx="1.5" ry="7" fill="#F48FB1" opacity={0.5} />
      </motion.g>
      <motion.g {...(isWalking ? { animate: { rotate: [3, -3, 3] }, transition: { repeat: Infinity, duration: 0.6, delay: 0.3 }, style: { transformOrigin: '34px 10px' } } : {})}>
        <ellipse cx="34" cy="2" rx="3" ry="10" fill="white" />
        <ellipse cx="34" cy="2" rx="1.5" ry="7" fill="#F48FB1" opacity={0.5} />
      </motion.g>
      {/* Eye */}
      <circle cx="32" cy="12" r="1.8" fill="#333" />
      <circle cx="31.6" cy="11.6" r="0.6" fill="white" />
      {/* Nose */}
      <polygon points="36,15 38,16 36,17" fill="#F48FB1" />
      {/* Whiskers */}
      <line x1="36" y1="14.5" x2="40" y2="13" stroke="#BDBDBD" strokeWidth="0.5" />
      <line x1="36" y1="16.5" x2="40" y2="17" stroke="#BDBDBD" strokeWidth="0.5" />
    </motion.g>
  </svg>
);

const AnimalSVGComponent = ({ animalId, size = 48, facingLeft = false, isWalking = false }: AnimalSVGProps) => {
  const style = { transform: facingLeft ? 'scaleX(-1)' : 'none' };
  const props = { size, isWalking };

  return (
    <div style={style}>
      {animalId === 'cow' && <CowSVG {...props} />}
      {animalId === 'chicken' && <ChickenSVG {...props} />}
      {animalId === 'sheep' && <SheepSVG {...props} />}
      {animalId === 'pig' && <PigSVG {...props} />}
      {animalId === 'duck' && <DuckSVG {...props} />}
      {animalId === 'rabbit' && <RabbitSVG {...props} />}
    </div>
  );
};

export const AnimalSVG = React.memo(AnimalSVGComponent);
