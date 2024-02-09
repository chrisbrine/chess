import { ChessPiece, EPiece, EColor, chessPiecePosition, RookPiece, KnightPiece, BishopPiece, QueenPiece, PawnPiece, KingPiece } from './chess';
import { Game } from './game';
import { Player } from './player';

export type ChessBoardSpace = ChessPiece | null;

type ChessBoardRow = [
  ChessBoardSpace,
  ChessBoardSpace,
  ChessBoardSpace,
  ChessBoardSpace,
  ChessBoardSpace,
  ChessBoardSpace,
  ChessBoardSpace,
  ChessBoardSpace

];

export type ChessBoard = [
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
];

export class Board {
  private tempSpot: ChessPiece | null = null;
  public board: ChessBoard;
  public isInCheckMate: boolean = false;
  public winnerColor: EColor | null = null;
  public stalemate: EColor | null = null;
  public game: Game;
  public players: {
    [EColor.white]: Player,
    [EColor.black]: Player,
  };
  public pieces: {
    [EColor.white]: ChessPiece[],
    [EColor.black]: ChessPiece[],
  } = {
    [EColor.white]: [],
    [EColor.black]: [],
  };
  constructor(white: Player, black: Player, game: Game) {
    this.players = {
      [EColor.white]: white,
      [EColor.black]: black,
    };
    this.game = game;
    this.board = [
      [
        new RookPiece(EColor.white, [0, 0], this),
        new KnightPiece(EColor.white, [0, 1], this),
        new BishopPiece(EColor.white, [0, 2], this),
        new KingPiece(EColor.white, [0, 3], this),
        new QueenPiece(EColor.white, [0, 4], this),
        new BishopPiece(EColor.white, [0, 5], this),
        new KnightPiece(EColor.white, [0, 6], this),
        new RookPiece(EColor.white, [0, 7], this),
      ],
      [
        new PawnPiece(EColor.white, [1, 0], this),
        new PawnPiece(EColor.white, [1, 1], this),
        new PawnPiece(EColor.white, [1, 2], this),
        new PawnPiece(EColor.white, [1, 3], this),
        new PawnPiece(EColor.white, [1, 4], this),
        new PawnPiece(EColor.white, [1, 5], this),
        new PawnPiece(EColor.white, [1, 6], this),
        new PawnPiece(EColor.white, [1, 7], this),
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      [
        new PawnPiece(EColor.black, [6, 0], this),
        new PawnPiece(EColor.black, [6, 1], this),
        new PawnPiece(EColor.black, [6, 2], this),
        new PawnPiece(EColor.black, [6, 3], this),
        new PawnPiece(EColor.black, [6, 4], this),
        new PawnPiece(EColor.black, [6, 5], this),
        new PawnPiece(EColor.black, [6, 6], this),
        new PawnPiece(EColor.black, [6, 7], this),
      ],
      [
        new RookPiece(EColor.black, [7, 0], this),
        new KnightPiece(EColor.black, [7, 1], this),
        new BishopPiece(EColor.black, [7, 2], this),
        new KingPiece(EColor.black, [7, 3], this),
        new QueenPiece(EColor.black, [7, 4], this),
        new BishopPiece(EColor.black, [7, 5], this),
        new KnightPiece(EColor.black, [7, 6], this),
        new RookPiece(EColor.black, [7, 7], this),
      ],
    ];
  }
  public delete(position: chessPiecePosition) {
    const piece = this.board[position[0]][position[1]];
    if (!piece) {
      return;
    }
    this.board[position[0]][position[1]] = null;
    const index = this.pieces[piece.color].indexOf(piece);
    if (index > -1) {
      this.pieces[piece.color].splice(index, 1);
    }
  }
  public clearAllValidMovesCache() {
    for (const piece of this.pieces[EColor.white]) {
      piece.clearValidMovesCache();
    }
    for (const piece of this.pieces[EColor.black]) {
      piece.clearValidMovesCache();
    }
  }
  public move(start: chessPiecePosition, end: chessPiecePosition): boolean {
    if (!this.game.running()) {
      return false;
    }
    const piece = this.board[start[0]][start[1]];
    if (!piece) {
      return false;
    }
    if (piece.validMove(end, false)) {
      const endPiece = this.board[end[0]][end[1]];
      if (endPiece) {
        endPiece.kill();
      } else if (piece.name === EPiece.pawn && piece.position[1] !== end[1] && piece.moveCount === 1) {
        const otherPosition: chessPiecePosition = [
          end[0],
          piece.position[1],
        ];
        const otherPiece = this.getPiece(otherPosition);
        if (otherPiece && otherPiece.name === EPiece.pawn && otherPiece.color !== piece.color) {
          otherPiece.kill();
        }
      }
      if (piece.name === EPiece.king) {
        if (end[1] === start[1] + 2) {
          const rook = this.getPiece([end[0], 7]);
          if (rook && rook.name === EPiece.rook && rook.color === piece.color && rook.moveCount === 0) {
            rook.setPosition([end[0], 4]);
            rook.moveCount++;
          } else {
            return false;
          }
        } else if (end[1] === start[1] - 2) {
          const rook = this.getPiece([end[0], 0]);
          if (rook && rook.name === EPiece.rook && rook.color === piece.color && rook.moveCount === 0) {
            rook.setPosition([end[0], 2]);
            rook.moveCount++;
          } else {
            return false;
          }
        }
      }
      this.clearAllValidMovesCache();
      piece.setPosition(end);
      piece.moveCount++;
      return true;
    }
    if (this.inCheckMate()) {
      this.isInCheckMate = true;
    }
    return false;
  }
  movePutsOwnKingInCheck(start: chessPiecePosition, end: chessPiecePosition) {
    const piece = this.board[start[0]][start[1]];
    if (!piece) {
      return false;
    }
    const endPiece = this.board[end[0]][end[1]];
    this.board[end[0]][end[1]] = piece;
    this.board[start[0]][start[1]] = null;
    piece.position = end;
    this.clearAllValidMovesCache();
    const king = this.getKing(piece.color);
    if (!king) {
      return false;
    }
    const inCheck = this.spaceInCheck(king, king.position, piece.color);
    this.board[start[0]][start[1]] = piece;
    this.board[end[0]][end[1]] = endPiece;
    piece.position = start;
    return inCheck;
  }
  validSpace(
    piece: ChessPiece,
    position: chessPiecePosition,
    color: EColor,
    stopMove: boolean,
    canKill: boolean,
    verifyPassant: boolean = false,
    overrideKing: boolean = false,
  ) {
    if (position[0] < 0 || position[0] > 7 || position[1] < 0 || position[1] > 7) {
      return false;
    }
    if (overrideKing && !canKill) {
      return false;
    }
    if (stopMove) {
      let [row, col] = piece.position;
      while (row !== position[0] || col !== position[1]) {
        if (this.getPiece([row, col]) !== null && (row !== piece.position[0] || col !== piece.position[1])) {
          return false;
        }
        if (row > position[0]) {
          row--;
        } else if (row < position[0]) {
          row++;
        }
        if (col > position[1]) {
          col--;
        } else if (col < position[1]) {
          col++;
        }
      }
    }
    if (!overrideKing && this.movePutsOwnKingInCheck(piece.position, position)) {
      console.log('check')
      return false;
    }
    if (!overrideKing && piece.name === EPiece.king) {
      // special 'castle' move for king
      // !!!!!!!!!!!!!!!!!!!!!!!!!
      // NEED TO MAKE SURE THE KING IS NOT IN CHECK
      // !!!!!!!!!!!!!!!!!!!!!!!!!
      if (this.spaceInCheck(piece, position, color)) {
        return false;
      }
      if (position[1] === piece.position[1] + 2) {
        const rook = this.getPiece([position[0], 7]);
        if (rook && rook.name === EPiece.rook && rook.color === piece.color && rook.moveCount === 0) {
          if (this.getPiece([position[0], 4]) === null && this.getPiece([position[0], 5]) === null && this.getPiece([position[0], 6]) === null) {
            return true;
          }
        }
        return false;
      } else if (position[1] === piece.position[1] - 2) {
        const rook = this.getPiece([position[0], 0]);
        if (rook && rook.name === EPiece.rook && rook.color === piece.color && rook.moveCount === 0) {
          if (this.getPiece([position[0], 2]) === null && this.getPiece([position[0], 1]) === null) {
            return true;
          }
        }
        return false;
      }
    }
    const otherPiece = this.getPiece(position);
    if (!otherPiece || overrideKing) {
      if (verifyPassant && piece.name === EPiece.pawn && piece.position[1] !== position[1]) {
        const otherPosition: chessPiecePosition = [
          piece.position[0] + (piece.color === EColor.black ? -1 : 1),
          piece.position[1]
        ];
        const otherPiece = this.getPiece(otherPosition);
        if (overrideKing || otherPiece && piece.moveCount === 1 && otherPiece.name === EPiece.pawn && otherPiece.color !== color) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    } else if (otherPiece && otherPiece.color !== color) {
      return canKill;
    }
    return false;
  }
  private getPiece(position: chessPiecePosition) {
    if (position[0] < 0 || position[0] > 7 || position[1] < 0 || position[1] > 7) {
      return null;
    }
    return this.board[position[0]][position[1]];
  }
  public spaceInCheck(current: ChessPiece, position: chessPiecePosition, color: EColor) {
    if (!current) {
      return false;
    }
    const pieces = this.pieces[color === EColor.white ? EColor.black : EColor.white];
    for (const piece of pieces) {
      if (piece !== current && piece !== this.tempSpot && piece.validMove(position, true)) {
        return true;
      }
    }
    return false;
  }
  public promotePawn(piece: ChessPiece, type: EPiece) {
    const color = piece.color;
    const position = piece.position;
    switch (type) {
      case EPiece.queen:
        this.delete(position);
        piece = new QueenPiece(color, position, this);
        break;
      case EPiece.rook:
        this.delete(position);
        piece = new RookPiece(color, position, this);
        break;
      case EPiece.knight:
        this.delete(position);
        piece = new KnightPiece(color, position, this);
        break;
      case EPiece.bishop:
        this.delete(position);
        piece = new BishopPiece(color, position, this);
        break;
      default:
        return;
    }
    this.pieces[color].push(piece);
    this.board[position[0]][position[1] as number] = piece;
  }
  public colorInCheck(color: EColor) {
    const king = this.getKing(color);
    if (!king) {
      return false;
    }
    return this.spaceInCheck(king, king.position, color);
  }
  public colorInCheckMate(color: EColor) {
    return false;
    // const pieces = this.pieces[color];
    // const king = this.getKing(color);
    // if (!king) {
    //   return true;
    // }
    // const moves = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    // for (let move of moves) {
    //   const row = move[0] + king.position[0];
    //   const col = move[1] + king.position[1];
    //   if (king.validMove([row, col]), false) {
    //     if (!this.spaceInCheck([row, col], color)) {
    //       return false;
    //     }
    //   }
    // }
    // if (!this.spaceInCheck(king.position, color)) {
    //   return false;
    // }
    // return true;
  }
  public checkWinner() {
    if (this.winnerColor !== null) {
      return this.winnerColor;
    }
    if (this.colorInCheckMate(EColor.white)) {
      this.winnerColor = EColor.black;
      return EColor.black;
    }
    if (this.colorInCheckMate(EColor.black)) {
      this.winnerColor = EColor.white;
      return EColor.white;
    }
    return null;
  }
  public colorInStaleMate(color: EColor) {
    if (this.stalemate === color) {
      return true;
    }
    const pieces = this.pieces[color];
    for (const piece of pieces) {
      if (this.validMoves(piece).length > 0) {
        return false;
      }
    }
    this.stalemate = color;
    return true;
  }
  public inStaleMate() {
    if (this.stalemate !== null) {
      return this.stalemate;
    }
    if (this.colorInStaleMate(EColor.white)) {
      return EColor.white;
    } else if (this.colorInStaleMate(EColor.black)) {
      return EColor.black;
    }
    return null;
  }
  public inCheckMate() {
    if (this.isInCheckMate) {
      return true;
    }
    return this.colorInCheckMate(EColor.white) || this.colorInCheckMate(EColor.black);
  }
  public validMoves(piece: ChessPiece) {
    return piece.getValidMoves(false);
  }
  public piecesCanMove(color: EColor) {
    const pieces = this.pieces[color];
    const canMove: ChessPiece[] = [];
    for (const piece of pieces) {
      if (this.validMoves(piece).length > 0) {
        canMove.push(piece);
      }
    }
    this.clearAllValidMovesCache();
    return canMove;
  }
  public coordinatesCanMove(color: EColor) {
    const pieces = this.pieces[color];
    const validPieces: Set<String> = new Set<String>();
    for (const piece of pieces) {
      const moves = this.validMoves(piece);
      if (moves.length > 0) {
        validPieces.add(`${piece.position[0]},${piece.position[1]}`);

      }
    }
    this.clearAllValidMovesCache();
    return validPieces;
  }
  public getKing(color: EColor) {
    for (const piece of this.pieces[color]) {
      if (piece.name === EPiece.king) {
        return piece;
      }
    }
    return null;
  }
}
