'use client';
import { useState, useEffect } from 'react';
import ChessBoard from "../board";
import Stats from "./stats";
import { ChessBoard as Board } from "@/app/data/board";
import { Game as ChessGame } from "@/app/data/game";
import { Player } from "@/app/data/player";
import { ChessPiece, EColor, EPiece } from '@/app/data/chess';
import { GameSizes, EGameSize } from '@/app/data/sizes';
import PromotionPawn from '../promotion';

export default function Game({playerName}: {playerName: string}) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [promotionPiece, setPromotionPiece] = useState<ChessPiece | null>(null);
  const [gameSize, setGameSize] = useState<string>(EGameSize.med);
  const newPlayer1 = new Player(playerName);
  const newPlayer2 = new Player('Player 2')
  newPlayer1.color = EColor.white;
  const [player1, setPlayer1] = useState<Player>(newPlayer1);
  const [player2, setPlayer2] = useState<Player>(newPlayer2);
  const [game, setGame] = useState<ChessGame>(new ChessGame([player1, player2]));
  const [player, setPlayer] = useState<Player>(newPlayer1.color === EColor.white ? newPlayer1 : newPlayer2);
  const [board, setBoard] = useState<Board>(game.board.board);
  const [coordinates, setCoordinates] = useState<Set<String>>(new Set<String>(game.board.coordinatesCanMove(game.turn)));
  const hasSelected = () => selectedRow !== null && selectedCol !== null;
  const select = (row: number, col: number) => {
    setSelectedRow(row);
    setSelectedCol(col);
  }
  const move = (row: number, col: number) => {
    if (selectedRow !== null && selectedCol !== null) {
      const space = game.board.board[selectedRow][selectedCol];
      if (game.board.move([selectedRow, selectedCol], [row, col])) {
        game.nextTurn();
        setPlayer(player1.color === game.turn ? player1 : player2);
        setCoordinates(game.board.coordinatesCanMove(game.turn));
      }
      setSelectedRow(null);
      setSelectedCol(null);
      if (space && space.name === EPiece.pawn && (row === 0 || row === 7)) {
        setPromotionPiece(space);
      }
    }
  }
  const setPromotion = (piece: ChessPiece, type: EPiece) => {
    if (promotionPiece) {
      game.board.promotePawn(promotionPiece, type);
      setPromotionPiece(null);
    }
  }
  const restartGame = () => {
    const newGame = new ChessGame([player1, player2]);
    setGame(newGame);
    setBoard(newGame.board.board);
    setSelectedRow(null);
    setSelectedCol(null);
    setPromotionPiece(null);
    setCoordinates(new Set<String>(newGame.board.coordinatesCanMove(game.turn)));
  }
  const renamePlayer1 = (name: string) => {
    setPlayer1(new Player(name));
  }
  const renamePlayer2 = (name: string) => {
    setPlayer2(new Player(name));
  }
  useEffect(() => {
    function recalculateSize() {
      const currentSize = GameSizes.calculateSize(window.innerWidth);
      if (currentSize !== gameSize) {
        setGameSize(currentSize);
      }
    }
    window.addEventListener("resize", recalculateSize);
    recalculateSize();

    return () => {
      window.removeEventListener("resize", () => {});
    }
  }, [gameSize]);
  return (
    <div className="flex flex-row justify-between items-center h-screen w-screen">
      <ChessBoard
        game={game}
        board={board}
        player={player}
        selected={[selectedRow, selectedCol]}
        select={select}
        move={move}
        gameSize={gameSize}
        coordinates={coordinates}
        hasSelected={hasSelected()}
      />
      <Stats
        game={game}
        gameSize={gameSize as EGameSize}
        player={player}
        renamePlayer1={renamePlayer1}
        renamePlayer2={renamePlayer2}
        restartGame={restartGame}
        coordinates={coordinates}
      />
      <PromotionPawn piece={promotionPiece} setPromotion={setPromotion} />
    </div>
  );
}