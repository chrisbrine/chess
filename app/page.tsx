import Game from "@/app/components/game";

export default function Home() {
  const player = 'Player 1';
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-emerald-50">
      <h1 className="text-4xl">Chess</h1>
      <Game playerName={player} />
    </div>
  );
}
