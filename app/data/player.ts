import { Board } from "./board";
import { EColor } from "./chess";
import { Game } from "./game";

export class Player {
  public name: string;
  public color: EColor | null = null;
  public game: Game | null = null;
  constructor(name: string) {
    this.name = name;
  }
}
