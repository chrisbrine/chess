import { Game } from "@/app/data/game";
import { Player } from "@/app/data/player";
import StatsPlayer from "./statsPlayer";
import { EColor } from "@/app/data/chess";
import { EGameSize, GameSizes } from "@/app/data/sizes";

export default function GameStats({
  player,
  gameSize,
  game,
}: {
  player: Player,
  gameSize: EGameSize,
  game: Game,
}) {
  const colorClasses = game.turn === EColor.white ? 'bg-white text-black' : 'bg-black text-white';
  const statsSize = GameSizes.statsSize(gameSize);
  return (
    <div className={`flex flex-col justify-between w-full ${colorClasses}`} style={{ height: `${statsSize}px`}}>
      <div className='flex flex-col w-full h-full'>
        <StatsPlayer player={game.white} game={game} color={EColor.white} />
        <StatsPlayer player={game.black} game={game} color={EColor.black} />
      </div>
      <div className="flex flex-col w-full">
        <div className="text-2xl font-bold">{game.turn}&apos;s turn</div>
      </div>
    </div>
  );
}