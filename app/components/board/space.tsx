import Image from "next/image";
import { ChessBoard as Board, ChessBoardSpace } from "@/app/data/board";
import { EGameMode, Game } from "@/app/data/game";
import { Player } from "@/app/data/player";
import { EGameSize, GameSizes } from "@/app/data/sizes";

export default function BoardSpace({
  space,
  position,
  game,
  board,
  player,
  isWhiteSpace,
  select,
  selected,
  validMoves,
  setValidMoves,
  passant,
  setPassant,
  move,
  gameSize,
  hasSelected,
}: {
  space: ChessBoardSpace,
  position: [number, number],
  game: Game,
  board: Board,
  player: Player,
  isWhiteSpace: boolean,
  select: (row: number, col: number) => void,
  selected: [number | null, number | null],
  validMoves: [number, number][],
  setValidMoves: (moves: [number, number][]) => void,
  passant: boolean,
  setPassant: (passant: boolean) => void,
  move: (row: number, col: number) => void,
  gameSize: string,
  hasSelected: boolean,
}) {
  const whiteSpaceClasses = isWhiteSpace ? 'bg-white' : 'bg-slate-600';
  const validMoveClasses = validMoves.some(([row, col]) => row === position[0] && col === position[1]) ? space || passant ? 'border-2 border-red-400' : 'border-2 border-green-400' : '';
  const selectedClasses = selected[0] === position[0] && selected[1] === position[1] ? 'border-2 border-yellow-400' : '';
  // const validPiecesClasses = space ? 'border-2 border-green-400' : '';
  const classNames = `${whiteSpaceClasses} ${validMoveClasses} ${selectedClasses}`;
  const pieceSize = GameSizes.boardPieceSize(gameSize as EGameSize);
  const spaceSize = GameSizes.boardSpaceSize(gameSize as EGameSize);

  const handlePiece = () => {
    if (game.running()) {
      if (player.color === game.turn || game.mode === EGameMode.twoPlayer) {
        if (hasSelected) {
          setPassant(false);
          setValidMoves([]);
          move(...position);
        } else {
          if (space && space.color === game.turn) {
            const validMoves = space.getValidMoves(false);
            if (validMoves.length > 0) {
              select(...position);
              setValidMoves(validMoves);
              if (space.name === 'pawn' && Math.abs((validMoves[0][0]) - space.position[0]) === 1 && space.moveCount === 1) {
                const piece = (validMoves[0][0] === position[0] + 1) ? board[space.position[0] + 1][space.position[1]] : board[space.position[0] - 1][space.position[1]];
                if (piece && piece.name === 'pawn' && piece.color !== space.color) {
                  setPassant(true);
                }
              }
            }
          }
        }
      }
    }
    game.board.clearAllValidMovesCache();
  }
  
  return (
    <div
      className={`${spaceSize} ${classNames}`}
      onClick={() => handlePiece()}
    >
      {space && space && <Image src={space.image()} alt={space.name} width={pieceSize} height={pieceSize} className='transition-all' />}
    </div>
  );
}
