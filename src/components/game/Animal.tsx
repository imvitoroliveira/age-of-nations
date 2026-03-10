import { AnimalState } from '@/types/game';
import { AnimalSVG } from './svg/AnimalSVG';

interface Props {
  animal: AnimalState;
  onClick: () => void;
  containerWidth: number;
  containerHeight: number;
}

export const Animal = ({ animal, onClick, containerWidth, containerHeight }: Props) => {
  const xPercent = (animal.x / 700) * 100;
  const yPercent = (animal.y / 120) * 100;

  return (
    <button
      onClick={onClick}
      className="absolute cursor-pointer z-20 hover:scale-110 transition-transform"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
      }}
    >
      <AnimalSVG
        animalId={animal.defId}
        size={Math.min(48, 40)}
        facingLeft={animal.facingLeft}
        isWalking={animal.state === 'walking'}
      />
    </button>
  );
};
