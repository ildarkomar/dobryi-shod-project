
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GameLogoProps extends HTMLAttributes<HTMLDivElement> {}

const GameLogo = ({ className, ...props }: GameLogoProps) => {
  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute inset-0 bg-gradient-radial from-game-purple-light/50 to-transparent rounded-full blur-xl opacity-70"></div>
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-pink to-game-purple-light p-4 border-4 border-game-purple rounded-full flex items-center justify-center w-full h-full">
          ДШ
        </div>
      </div>
    </div>
  );
};

export default GameLogo;
