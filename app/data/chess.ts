import { Board } from "./board";

export enum EPiece {
  pawn = "pawn",
  rook = "rook",
  knight = "knight",
  bishop = "bishop",
  queen = "queen",
  king = "king",
}

export enum EColor {
  white = "white",
  black = "black",
}

type chessPieceType = EPiece.pawn | EPiece.rook | EPiece.knight | EPiece.bishop | EPiece.queen | EPiece.king;
type chessPieceColor = EColor.white | EColor.black;
export type chessPiecePosition = [number, number]; // [x, y]

enum EMoveTypes {
  diagonal = "diagonal",
  straight = "straight",
  knight = "knight",
  king = "king",
  pawnUp = "pawnUp",
  pawnDown = "pawnDown",
  passant = "passant",
}
type TMoves = EMoveTypes[];

class Moves {
  private diagonalBasic: [number, number][] = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  private diagonalCache: [number, number][] | null = null;
  private straightBasic: [number, number][] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  private straightCache: [number, number][] | null = null;
  private knightBasic: [number, number][] = [[2, 1], [1, 2], [-2, 1], [1, -2], [-1, 2], [2, -1], [-1, -2], [-2, -1]];
  private kingBasic: [number, number][] = [[1, 1], [0, 1], [1, 0], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]];
  private pawnUpBasic: [number, number][] = [[-1, 0]];
  private pawnDownBasic: [number, number][] = [[1, 0]];
  private pawnKillUpBasic: [number, number][] = [[-1, 1], [-1, -1]];
  private pawnKillDownBasic: [number, number][] = [[1, 1], [1, -1]];
  private specialKingMoves: [number, number][] = [[0, 2], [0, -2]];
  public diagonal() {
    if (this.diagonalCache) {
      return this.diagonalCache;
    }
    const moves: [number, number][] = [];
    for (let i = 1; i < 8; i++) {
      this.diagonalBasic.forEach((move) => {
        moves.push([move[0] * i, move[1] * i]);
      });
    }
    this.diagonalCache = moves;
    return moves;
  }
  public straight() {
    if (this.straightCache) {
      return this.straightCache;
    }
    const moves: [number, number][] = [];
    for (let i = 1; i < 8; i++) {
      this.straightBasic.forEach((move) => {
        moves.push([move[0] * i, move[1] * i]);
      });
    }
    this.straightCache = moves;
    return moves;
  }
  public knight() {
    return this.knightBasic;
  }
  public king() {
    return this.kingBasic;
  }
  public specialKing() {
    return this.specialKingMoves;
  }
  public pawnUp(allowDouble: boolean = false) {
    if (allowDouble) {
      return this.pawnUpBasic.concat([[-2, 0]]);
    }
    return this.pawnUpBasic;
  }
  public pawnDown(allowDouble: boolean = false) {
    if (allowDouble) {
      return this.pawnDownBasic.concat([[2, 0]]);
    }
    return this.pawnDownBasic;
  }
  public pawnKillUp() {
    return this.pawnKillUpBasic;
  }
  public pawnKillDown() {
    return this.pawnKillDownBasic;
  }
}

export const AllMoves = new Moves();

export const chessImage = (name: EPiece, color: EColor) =>
  `./assets/${name}-${color}.svg`;

export class ChessPiece {
  private cachedMoves: [number, number][] = [];
  private initialMovesCache: [number, number][] = [];
  private cachedValidMovesVerify: Set<string> | null = null;
  private cachedValidMoves: [number, number][] | null = null;
  private cachedKillMoves: [number, number][] = [];
  public killMove: boolean = false;
  public killAtSpace: boolean = false;
  public moveCount: number = 0;
  public doubleMove: boolean = false;
  constructor(
    public name: chessPieceType,
    public color: chessPieceColor,
    public position: chessPiecePosition,
    public board: Board,
    public validMoves: TMoves,
  ) {
    this.board.pieces[this.color].push(this);
    for (let move of validMoves) {
      switch (move) {
        case EMoveTypes.diagonal:
          this.cachedMoves = this.cachedMoves.concat(AllMoves.diagonal());
          this.killMove = true;
          this.killAtSpace = true;
          break;
        case EMoveTypes.straight:
          this.cachedMoves = this.cachedMoves.concat(AllMoves.straight());
          this.killMove = true;
          this.killAtSpace = true;
          break;
        case EMoveTypes.knight:
          this.cachedMoves = this.cachedMoves.concat(AllMoves.knight());
          this.killAtSpace = true;
          break;
        case EMoveTypes.king:
          this.cachedMoves = this.cachedMoves.concat(AllMoves.king());
          this.killMove = true;
          this.killAtSpace = true;
          break;
        case EMoveTypes.pawnUp:
          this.cachedMoves = this.cachedMoves.concat(AllMoves.pawnUp());
          this.initialMovesCache = this.initialMovesCache.concat(AllMoves.pawnUp(true));
          this.cachedKillMoves = this.cachedKillMoves.concat(AllMoves.pawnKillUp());
          break;
        case EMoveTypes.pawnDown:
          this.cachedMoves = this.cachedMoves.concat(AllMoves.pawnDown());
          this.initialMovesCache = this.initialMovesCache.concat(AllMoves.pawnDown(true));
          this.cachedKillMoves = this.cachedKillMoves.concat(AllMoves.pawnKillDown());
          break;
      }
    }
  }
  public image() {
    return chessImage(this.name, this.color);
  }
  // public validMove(position: chessPiecePosition) {
  //   return this.board.validSpace(position, this.color, true, false);
  // }
  private stringifyPosition(position: chessPiecePosition) {
    return `${position[0]},${position[1]}`;
  }
  public clearValidMovesCache() {
    this.cachedValidMoves = null;
    this.cachedValidMovesVerify = null;
  }
  private checkMoves(
    validMovesVerify: Set<string>,
    validMoves: [number, number][],
    moves: [number, number][],
    verifyPassant: boolean = false,
    overrideKillAtSpace: boolean = false,
    overrideKing: boolean = false,
  ) {
    for (let move of moves) {
      const row = this.position[0] + move[0];
      const col = this.position[1] + move[1];
      if (this.board.validSpace(this, [row, col], this.color, this.killMove, this.killAtSpace || overrideKillAtSpace, verifyPassant, overrideKing)) {
        validMovesVerify.add(this.stringifyPosition([row, col]));
        validMoves.push([row, col]);
      }
    }
  }
  public getValidMoves(overrideKing: boolean = false) {
    if (this.cachedValidMoves !== null) {
      return this.cachedValidMoves;
    }
    const validMovesVerify = new Set<string>();
    const validMoves: [number, number][] = [];
    if (this.moveCount === 0 && this.initialMovesCache.length > 0) {
      this.checkMoves(validMovesVerify, validMoves, this.initialMovesCache, false, false, overrideKing);
    } else {
      this.checkMoves(validMovesVerify, validMoves, this.cachedMoves, false, false, overrideKing);
    }
    if (this.cachedKillMoves.length > 0) {
      this.checkMoves(validMovesVerify, validMoves, this.cachedKillMoves, true, true, overrideKing);
    }
    if (this.name === EPiece.king && this.moveCount === 0 && this.position[1] === 4 && (this.position[0] === 0 || this.position[0] === 7)) {
      this.checkMoves(validMovesVerify, validMoves, AllMoves.specialKing(), false, false, overrideKing);
    }
    this.cachedValidMoves = validMoves;
    this.cachedValidMovesVerify = validMovesVerify;
    return validMoves;
  }
  public validMove(position: chessPiecePosition, overrideKing: boolean = false) {
    const validMoves = this.getValidMoves(overrideKing);
    const validMovesVerify = this.cachedValidMovesVerify;
    if (validMoves === null || validMovesVerify === null) {
      return false;
    }
    if (validMovesVerify.has(this.stringifyPosition(position))) {
      return true;
    }
    return false;
  }
  public setPosition(position: chessPiecePosition) {
    this.board.board[this.position[0]][this.position[1]] = null;
    this.position = position;
    this.board.board[this.position[0]][this.position[1]] = this;
    this.clearValidMovesCache();
  }
  public tempSetPosition(position: chessPiecePosition) {
    const oldPosition = this.position;
    this.board.board[oldPosition[0]][oldPosition[1]] = null;
    this.position = position;
    this.board.board[position[0]][position[1]] = this;
    return oldPosition;
  }
  public kill() {
    this.board.game.killed[this.color].push(this);
    this.board.delete(this.position);
    this.position = [-1, -1];
  }
}

export class PawnPiece extends ChessPiece {
  constructor(color: chessPieceColor, position: chessPiecePosition, board: Board) {
    const pawnUpOrDown = color === EColor.black ? EMoveTypes.pawnUp : EMoveTypes.pawnDown;
    super(EPiece.pawn, color, position, board, [pawnUpOrDown, EMoveTypes.passant]);
  }
}

export class RookPiece extends ChessPiece {
  constructor(color: chessPieceColor, position: chessPiecePosition, board: Board) {
    super(EPiece.rook, color, position, board, [EMoveTypes.straight]);
  }
}

export class KnightPiece extends ChessPiece {
  constructor(color: chessPieceColor, position: chessPiecePosition, board: Board) {
    super(EPiece.knight, color, position, board, [EMoveTypes.knight]);
  }
}

export class BishopPiece extends ChessPiece {
  constructor(color: EColor, position: chessPiecePosition, board: Board) {
    super(EPiece.bishop, color, position, board, [EMoveTypes.diagonal]);
  }
}

export class QueenPiece extends ChessPiece {
  constructor(color: EColor, position: chessPiecePosition, board: Board) {
    super(EPiece.queen, color, position, board, [EMoveTypes.diagonal, EMoveTypes.straight]);
  }
}

export class KingPiece extends ChessPiece {
  constructor(color: EColor, position: chessPiecePosition, board: Board) {
    super(EPiece.king, color, position, board, [EMoveTypes.king]);
  }
}
