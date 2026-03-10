import { useMemo, useEffect } from 'react';
import { playCorrect, playWrong } from '@/lib/sounds';

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | null;
  onDone: () => void;
}

const CORRECT_PHRASES = ['Muito bem! 🎉', 'Parabéns! ⭐', 'Incrível! 🌟', 'Arrasou! 🎊', 'Ótimo! 👏'];
const WRONG_PHRASES = ['Tente de novo! 💪', 'Quase lá! 🤔', 'Vamos tentar! 😊'];

const CONFETTI_COLORS = ['bg-kid-pink', 'bg-kid-blue', 'bg-kid-yellow', 'bg-kid-green', 'bg-kid-orange', 'bg-kid-purple'];

export const FeedbackOverlay = ({ type, onDone }: FeedbackOverlayProps) => {
  const phrase = useMemo(() => {
    if (!type) return '';
    return type === 'correct'
      ? CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)]
      : WRONG_PHRASES[Math.floor(Math.random() * WRONG_PHRASES.length)];
  }, [type]);

  const confettiPieces = useMemo(() => {
    if (type !== 'correct') return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
      duration: `${1.5 + Math.random()}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-3',
      rotation: Math.random() * 360,
    }));
  }, [type]);

  useEffect(() => {
    if (type === 'correct') playCorrect();
    else if (type === 'wrong') playWrong();
  }, [type]);

  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onDone}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 ${type === 'correct' ? 'bg-kid-green/10' : 'bg-kid-orange/10'} backdrop-blur-sm`} />

      {/* Confetti for correct answers */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute top-0 ${piece.color} rounded-full ${piece.size} animate-confetti`}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}

      {/* Content */}
      <div className={`bounce-in text-center p-8 md:p-12 rounded-[2rem] relative z-10 ${
        type === 'correct'
          ? 'bg-gradient-to-br from-kid-green to-kid-teal text-primary-foreground shadow-lg'
          : 'bg-gradient-to-br from-kid-orange to-kid-yellow text-primary-foreground shadow-lg'
      }`}
        style={{ boxShadow: type === 'correct' ? 'var(--shadow-glow-green)' : undefined }}
      >
        <p className="text-4xl md:text-6xl font-extrabold font-baloo leading-tight">{phrase}</p>
        <p className="text-sm mt-2 opacity-80 font-semibold">Toque para continuar</p>
      </div>
    </div>
  );
};
