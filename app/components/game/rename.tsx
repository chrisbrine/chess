'use client';
import { useState, useEffect } from 'react';
import { EColor } from "@/app/data/chess";
import { Player } from "@/app/data/player";

export default function RenamePlayer({
  player,
  close,
  update,
}: {
  player: Player | null;
  close: () => void;
  update: (player: Player, name: string) => void;
}) {
  const [name, setName] = useState<string>(player?.name ?? '');
  useEffect(() => {
    setName(player?.name ?? '');
  }, [player?.name, player]);
  const updateName = (updateThisPlayer: Player, name: string) => {
    setName(name);
    update(updateThisPlayer, name);
  }

  // useEffect(() => {
  //   // capture enter key to close the dialog
  // }, [])
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      close();
    }
  }
// open dialog box to rename a player name if the player and color are set
  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${!player && 'hidden'}`}>
      {player && (
        <div className="bg-white p-4 rounded-lg">
          <div className="text-2xl font-bold">Rename {player?.color === EColor.white ? 'White' : 'Black'} Player</div>
          <input type="text" value={name} onChange={(e) => updateName(player, e.target.value)} className="border-2 my-2 py-2 px-2 w-full border-gray-900 active:border-gray-400 rounded-lg bg-white hover:bg-gray-50" onKeyDown={handleKeyPress} />
          <div className="flex flex-row">
            <button className="text-2xl font-bold" onClick={close}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
