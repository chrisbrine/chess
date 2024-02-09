import { Game } from "@/app/data/game";
import { Player } from "@/app/data/player";

export default function GameStats({
  player,
  game,
}: {
  player: Player,
  game: Game,
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col">
        <div className="text-2xl font-bold">{player.name}</div>
        <div className="text-2xl font-bold">{game.turn}&apos;s turn</div>
      </div>
    </div>
  );
}