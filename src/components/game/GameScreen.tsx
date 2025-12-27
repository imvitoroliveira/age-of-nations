import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';

export const GameScreen = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <GameCanvas />
      <GameHUD />
    </div>
  );
};
