import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';

interface GameScreenProps {
  onBack: () => void;
}

export const GameScreen = ({ onBack }: GameScreenProps) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <GameCanvas />
      <GameHUD onBack={onBack} />
    </div>
  );
};
