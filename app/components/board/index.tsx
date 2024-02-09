import { useState } from 'react';
import { ChessBoard as Board } from "@/app/data/board";
import { Game } from "@/app/data/game";
import { Player } from "@/app/data/player";
import BoardSpace from "@/app/components/board/space";
import { EColor } from '@/app/data/chess';

export default function ChessBoard({
  game,
  board,
  player,
  select,
  selected,
  move,
  gameSize,
  coordinates,
  hasSelected,
}: {
  game: Game,
  board: Board,
  player: Player,
  select: (row: number, col: number) => void,
  selected: [number | null, number | null],
  move: (row: number, col: number) => void,
  gameSize: string,
  coordinates: Set<String>,
  hasSelected: boolean,
}) {
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [passant, setPassant] = useState<boolean>(false);
  const checkIsWhiteSpace = (i: number, j: number) => {
    if (i % 2 === 0) {
      return j % 2 === 0;
    } else {
      return j % 2 !== 0;
    }
  };
  const boardBorderColor = game.turn === EColor.white ? 'border-grey-200' : 'border-black';
  return (
    <div className="flex flex-col items-center justify-center ml-4">
      <div className={`flex flex-col border-4 ${boardBorderColor} transition-all rounded-md`}>
        {board.map((row, i) => (
          <div key={i} className="flex flex-row">
            {row.map((space, j) =>
              <BoardSpace
                key={j}
                position={[i, j]}
                space={space}
                game={game}
                board={board}
                player={player}
                isWhiteSpace={checkIsWhiteSpace(i, j)}
                select={select}
                selected={selected}
                validMoves={validMoves}
                setValidMoves={setValidMoves}
                passant={passant}
                setPassant={setPassant}
                move={move}
                gameSize={gameSize}
                coordinates={coordinates}
                hasSelected={hasSelected}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}