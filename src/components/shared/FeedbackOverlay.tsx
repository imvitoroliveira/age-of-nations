import { useEffect, useState } from 'react';

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | null;
  onDone: () => void;
}

const CORRECT_PHRASES = ['Muito bem! 🎉', 'Parabéns! ⭐', 'Incrível! 🌟', 'Arrasou! 🎊', 'Ótimo! 👏'];
const WRONG_PHRASES = ['Tente de novo! 💪', 'Quase lá! 🤔', 'Vamos tentar! 😊'];

export const FeedbackOverlay = ({ type, onDone }: FeedbackOverlayProps) => {
  const [visible, setVisible] = useState(false);
  const phrase = type === 'correct'
    ? CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)]
    : WRONG_PHRASES[Math.floor(Math.random() * WRONG_PHRASES.length)];

  useEffect(() => {
    if (type) {
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); onDone(); }, 1500);
      return () => clearTimeout(t);
    }
  }, [type, onDone]);

  if (!visible || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className={`bounce-in text-center p-8 rounded-3xl shadow-2xl ${
        type === 'correct'
          ? 'bg-kid-green/90 text-primary-foreground'
          : 'bg-kid-orange/90 text-primary-foreground'
      }`}>
        <p className="text-5xl md:text-7xl font-extrabold font-baloo">{phrase}</p>
      </div>
    </div>
  );
};
