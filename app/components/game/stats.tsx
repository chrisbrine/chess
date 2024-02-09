import { Game } from "@/app/data/game";
import { Player } from "@/app/data/player";
import StatsPlayer from "./statsPlayer";
import { EColor } from "@/app/data/chess";
import { EGameSize, GameSizes } from "@/app/data/sizes";

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function GameStats({
  player,
  gameSize,
  game,
  coordinates,
}: {
  player: Player,
  gameSize: EGameSize,
  game: Game,
  coordinates: Set<String>,
}) {
  const inCheck = game.board.colorInCheck(EColor.white) ? EColor.white : game.board.colorInCheck(EColor.black) ? EColor.black : null;
  const moveCount = coordinates.size;
  const checkMate = inCheck && moveCount === 0;
  const staleMate = !inCheck && moveCount === 0;
  const turnDescription = checkMate ? 'Checkmate' : staleMate ? 'Stalemate' : inCheck ? 'Check' : `${capitalizeFirstLetter(game.turn)}'s turn`;
  const colorClasses = game.turn === EColor.white ? 'bg-white text-black' : 'bg-black text-white';
  const statsSize = GameSizes.statsSize(gameSize);
  return (
    <div className={`flex flex-col justify-between w-full ${colorClasses}`} style={{ height: `${statsSize}px`}}>
      <div className='flex flex-col w-full h-full'>
        <StatsPlayer player={game.white} game={game} color={EColor.white} />
        <StatsPlayer player={game.black} game={game} color={EColor.black} />
      </div>
      <div className="flex flex-col w-full">
        <div className="text-2xl font-bold">{turnDescription}</div>
      </div>
    </div>
  );
}