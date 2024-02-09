import Image from "next/image";
import { ChessPiece, EColor, EPiece, chessImage } from "@/app/data/chess";

export default function PromotionPawn({ piece, setPromotion }: {
  piece: ChessPiece | null,
  setPromotion: (piece: ChessPiece, type: EPiece) => void,
}) {
  // need a pop up to give options to change pawn to queen, rook, bishop, knight
  function TheImage({name, color}: {name: EPiece, color: EColor}) {
    return <Image src={chessImage(name, color)} alt={name} height={72} width={72}/>;
  }
  const color: EColor | null = piece?.color ?? null;
  const show: boolean = piece?.name === EPiece.pawn && color !== null;
  return (
    <div className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${show ? '' : 'hidden'}`}>
      {piece && color && (
        <div className="bg-white p-4 rounded-lg">
          <h1 className="text-4xl text-black">Promote Your Pawn</h1>
          <div className="flex justify-center items-center">
            <button onClick={() => setPromotion(piece, EPiece.queen)} className="border-white border bg-white transition-all hover:bg-gray-200 hover:border-gray-200">
              <TheImage name={EPiece.queen} color={color} />
            </button>
            <button onClick={() => setPromotion(piece, EPiece.rook)} className="border-slate-100 border bg-slate-500 transition-all hover:bg-slate-600 hover:border-slate-600">
              <TheImage name={EPiece.rook} color={color} />
            </button>
            <button onClick={() => setPromotion(piece, EPiece.bishop)} className="border-white border bg-white transition-all hover:bg-gray-200 hover:border-gray-200">
              <TheImage name={EPiece.bishop} color={color} />
            </button>
            <button onClick={() => setPromotion(piece, EPiece.knight)} className="border-slate-100 border bg-slate-500 transition-all hover:bg-slate-600 hover:border-slate-600">
              <TheImage name={EPiece.knight} color={color} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}