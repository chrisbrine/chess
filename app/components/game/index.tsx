'use client';
import { useState } from 'react';
import ChessBoard from "../board";
import Stats from "./stats";
import { ChessBoard as Board } from "@/app/data/board";
import { Game as ChessGame } from "@/app/data/game";
import { Player } from "@/app/data/player";
import { EColor } from '@/app/data/chess';

export default function Game({player}: {player: string}) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const newPlayer = new Player(player);
  newPlayer.color = EColor.white;
  const [player1, setPlayer1] = useState<Player>(newPlayer);
  const [player2, setPlayer2] = useState<Player>(new Player('Player 2'));
  const [game, setGame] = useState<ChessGame>(new ChessGame([player1, player2]));
  const [board, setBoard] = useState<Board>(game.board.board);
  const hasSelected = () => selectedRow !== null && selectedCol !== null;
  const select = (row: number, col: number) => {
    setSelectedRow(row);
    setSelectedCol(col);
  }
  const move = (row: number, col: number) => {
    if (selectedRow !== null && selectedCol !== null) {
      game.board.move([selectedRow, selectedCol], [row, col]);
      setSelectedRow(null);
      setSelectedCol(null);
    }
  }
  return (
    <div className="flex flex-row items-center justify-center h-screen">
      <ChessBoard
        game={game}
        board={board}
        player={player1}
        selected={[selectedRow, selectedCol]}
        select={select}
        move={move}
        hasSelected={hasSelected()}
      />
      <Stats
        game={game}
        player={player1}
      />
    </div>
  );
}