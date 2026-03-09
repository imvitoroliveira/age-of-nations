import { useState, useCallback } from 'react';
import { SYLLABLE_WORDS, speak } from '@/data/educationData';
import { ActivityHeader } from '@/components/shared/ActivityHeader';
import { FeedbackOverlay } from '@/components/shared/FeedbackOverlay';
import { useAppStore } from '@/store/appStore';

interface Props { onBack: () => void; }

export const SyllablesActivity = ({ onBack }: Props) => {
  const [wordIdx, setWordIdx] = useState(() => Math.floor(Math.random() * SYLLABLE_WORDS.length));
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState<string[]>(() => shuffleSylls(0));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const { recordActivity } = useAppStore();
  const word = SYLLABLE_WORDS[wordIdx];

  function shuffleSylls(idx: number) {
    const w = SYLLABLE_WORDS[idx];
    const extra = ['MA', 'BO', 'TA', 'LI', 'PE', 'RO'].filter(s => !w.syllables.includes(s));
    return [...w.syllables, ...extra.slice(0, 2)].sort(() => Math.random() - 0.5);
  }

  const handleSyllableTap = (syl: string) => {
    const newSelected = [...selectedSyllables, syl];
    setSelectedSyllables(newSelected);
    if (newSelected.length === word.syllables.length) {
      const correct = newSelected.join('') === word.syllables.join('');
      setFeedback(correct ? 'correct' : 'wrong');
      recordActivity('syllables', correct);
      if (correct) speak(word.word);
    }
  };

  const handleRemoveSyllable = (idx: number) => {
    setSelectedSyllables(prev => prev.filter((_, i) => i !== idx));
  };

  const next = useCallback(() => {
    setFeedback(null);
    setSelectedSyllables([]);
    const newIdx = Math.floor(Math.random() * SYLLABLE_WORDS.length);
    setWordIdx(newIdx);
    setShuffled(shuffleSylls(newIdx));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActivityHeader title="📖 Sílabas" category="syllables" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="text-center">
          <span className="text-7xl">{word.image}</span>
          <p className="text-2xl font-bold text-muted-foreground mt-2">Monte a palavra!</p>
        </div>
        <div className="flex gap-2">
          {word.syllables.map((_, i) => (
            <button key={i} onClick={() => selectedSyllables[i] && handleRemoveSyllable(i)}
              className={`w-20 h-16 rounded-2xl border-4 border-dashed flex items-center justify-center text-2xl font-bold font-baloo transition-all ${
                selectedSyllables[i] ? 'border-primary bg-primary/10 text-primary' : 'border-muted text-muted-foreground'
              }`}>
              {selectedSyllables[i] || '?'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 justify-center max-w-md">
          {shuffled.map((syl, i) => {
            const used = selectedSyllables.includes(syl);
            return (
              <button key={i} disabled={used} onClick={() => handleSyllableTap(syl)}
                className={`kid-card px-6 py-4 text-2xl font-bold font-baloo border-kid-purple/30 ${used ? 'opacity-30' : 'bg-card text-foreground'}`}>
                {syl}
              </button>
            );
          })}
        </div>
      </div>
      <FeedbackOverlay type={feedback} onDone={next} />
    </div>
  );
};
