import Image from "next/image";
import { EColor, EPiece, chessImage } from "@/app/data/chess";
import { Game } from "@/app/data/game";
import { Player } from "@/app/data/player";

export default function StatsPlayer({
  player,
  game,
  color,
  rename,
}: {
  player: Player,
  game: Game,
  color: EColor,
  rename: (player: Player) => void,
}) {
  function TheImage({name, color}: {name: EPiece, color: EColor}) {
    return <Image src={chessImage(name, color)} alt={name} height={24} width={24}/>;
  }
  return (
    <div
      className={`flex py-2 px-2 flex-col h-full w-full cursor-pointer ${color === EColor.white ? 'text-black bg-white' : 'text-white bg-black'} border-4 ${game.turn === color ? 'border-yellow-700' : 'border-transparent'}`}
      onClick={() => rename(player)}
    >
      <div className="text-2xl font-bold">{player.name}</div>
      {/* List all killed pieces */}
      <div className="flex flex-row flex-wrap">
        {game.killed[color].length > 0 ? game.killed[color].map((piece, index) => (
          <div key={index} className="text-2xl font-bold"><TheImage name={piece.name} color={color === EColor.white ? EColor.black : EColor.white} /></div>
        )) : <div className="text-md italic">No pieces taken</div>}
      </div>
    </div>
  );
}