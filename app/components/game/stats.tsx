'use client';
import { useState } from 'react';
import { Game } from "@/app/data/game";
import { Player } from "@/app/data/player";
import StatsPlayer from "./statsPlayer";
import { EColor } from "@/app/data/chess";
import { EGameSize, GameSizes } from "@/app/data/sizes";
import RenamePlayer from "./rename";

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function GameStats({
  player,
  gameSize,
  game,
  coordinates,
  renamePlayer1,
  renamePlayer2,
  restartGame,
}: {
  player: Player,
  gameSize: EGameSize,
  game: Game,
  coordinates: Set<String>,
  renamePlayer1: (name: string) => void,
  renamePlayer2: (name: string) => void,
  restartGame: () => void,
}) {
  const [renamePlayer, setRenamePlayer] = useState<Player | null>(null);
  const openRenamePlayer = (player: Player) => {
    setRenamePlayer(player);
  }
  const closeRenamePlayer = () => {
    setRenamePlayer(null);
  }
  const updatePlayer = (update: Player, name: string) => {
    update.name = name;
  }
  const inCheck = game.board.colorInCheck(EColor.white) ? EColor.white : game.board.colorInCheck(EColor.black) ? EColor.black : null;
  const moveCount = coordinates.size;
  const checkMate = inCheck && moveCount === 0;
  const staleMate = !inCheck && moveCount === 0;
  const turnDescription = checkMate ? 'Checkmate' : staleMate ? 'Stalemate' : inCheck ? 'Check' : `${player.name}'s turn (${capitalizeFirstLetter(game.turn)})`;
  const colorClasses = game.turn === EColor.white ? 'bg-white text-black' : 'bg-black text-white';
  const statsSize = GameSizes.statsSize(gameSize);
  return (
    <div className={`flex flex-col justify-between w-full ${colorClasses}`} style={{ height: `${statsSize}px`}}>
      <div className='flex flex-col w-full h-full'>
        <StatsPlayer player={game.white} game={game} color={EColor.white} rename={openRenamePlayer} />
        <StatsPlayer player={game.black} game={game} color={EColor.black} rename={openRenamePlayer} />
      </div>
      <RenamePlayer player={renamePlayer} close={closeRenamePlayer} update={updatePlayer} />
      <div className="flex flex-col w-full justify-center items-center text-center ">
        <div className="text-2xl font-bold">{turnDescription}</div>
        <button onClick={restartGame} className="w-20 my-2 border border-slate-400 bg-gray-800 text-white hover:bg-slate-400 hover:border-transparent hover:text-black transition-all rounded-lg">
          Restart
          </button>
      </div>
    </div>
  );
}