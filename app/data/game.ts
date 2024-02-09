import { Board } from "./board";
import { ChessPiece, EColor } from "./chess";
import { Player } from "./player";

export class Game {
  public white: Player;
  public black: Player;
  public turn: EColor = EColor.white;
  public killed: {
    [EColor.white]: ChessPiece[],
    [EColor.black]: ChessPiece[],
  } = {
    [EColor.white]: [],
    [EColor.black]: [],
  };
  public board: Board;
  private started: boolean = true;
  constructor(players: [Player, Player]) {
    if (players[0].color === EColor.white && players[1].color !== EColor.white) {
      this.white = players[0];
      this.black = players[1];
      players[0].color = EColor.white;
      players[1].color = EColor.black;
    } else if (players[0].color === EColor.black && players[1].color !== EColor.black) {
      this.white = players[1];
      this.black = players[0];
      players[1].color = EColor.white;
      players[0].color = EColor.black;
    } else {
      if (Math.random() > 0.5) {
        this.white = players[0];
        this.black = players[1];
        players[0].color = EColor.white;
        players[1].color = EColor.black;
      } else {
        this.white = players[1];
        this.black = players[0];
        players[1].color = EColor.white;
        players[0].color = EColor.black;
      }
    }
    this.board = new Board(this.white, this.black, this);
  }
  public running() {
    return this.started && !this.board.inCheckMate();
  }
  public start() {
    this.started = true;
  }
  public kill(piece: ChessPiece) {
    this.killed[piece.color].push(piece);
  }
}