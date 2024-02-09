'use client';
export enum EGameSize {
  xs = 'extra-small',
  sm = 'small',
  med = 'medium',
  lg = 'large',
  xl = 'extra-large',
};

export type TGameSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

enum EWindowSizes {
  xs = 320,
  sm = 640,
  med = 1024,
  lg = 1280,
  xl = 1536,
}

enum EBoardSquareSizes {
  xs = 'h-6 w-6',
  sm = 'h-9 w-9',
  med = 'h-12 w-12',
  lg = 'h-16 w-16',
  xl = 'h-20 w-20',
}

enum EBoardPieceSizes {
  xs = 24,
  sm = 36,
  med = 48,
  lg = 64,
  xl = 80,
}

enum EStatsSize {
  xs = (EBoardPieceSizes.xs * 8) + 8,
  sm = (EBoardPieceSizes.sm * 8) + 8,
  med = (EBoardPieceSizes.med * 8) + 8,
  lg = (EBoardPieceSizes.lg * 8) + 8,
  xl = (EBoardPieceSizes.xl * 8) + 8,
}

enum EBoardPromotionPieceSizes {
  xs = 72,
  sm = 96,
  med = 120,
  lg = 144,
  xl = 168,
}

class Sizes {
  public correctSize(width: number, currentSize: EGameSize): boolean {
    return currentSize === EGameSize.xs && width < EWindowSizes.sm
      || currentSize === EGameSize.sm && width < EWindowSizes.med
      || currentSize === EGameSize.med && width < EWindowSizes.lg
      || currentSize === EGameSize.lg && width < EWindowSizes.xl
      || currentSize === EGameSize.xl && width >= EWindowSizes.xl;
  }
  public calculateSize(width: number) {
    if (width < EWindowSizes.sm) {
      return EGameSize.xs;
    } else if (width < EWindowSizes.med) {
      return EGameSize.sm;
    } else if (width < EWindowSizes.lg) {
      return EGameSize.med;
    } else if (width < EWindowSizes.xl) {
      return EGameSize.lg;
    } else {
      return EGameSize.xl;
    }
  }
  public boardSpaceSize(currentSize: EGameSize) {
    switch (currentSize) {
      case EGameSize.xs:
        return EBoardSquareSizes.xs;
      case EGameSize.sm:
        return EBoardSquareSizes.sm;
      case EGameSize.med:
        return EBoardSquareSizes.med;
      case EGameSize.lg:
        return EBoardSquareSizes.lg;
      case EGameSize.xl:
        return EBoardSquareSizes.xl;
    }
  }
  public boardPieceSize(currentSize: EGameSize) {
    switch (currentSize) {
      case EGameSize.xs:
        return EBoardPieceSizes.xs;
      case EGameSize.sm:
        return EBoardPieceSizes.sm;
      case EGameSize.med:
        return EBoardPieceSizes.med;
      case EGameSize.lg:
        return EBoardPieceSizes.lg;
      case EGameSize.xl:
        return EBoardPieceSizes.xl;
    }
  }
  public boardPromotionPieceSize(currentSize: EGameSize) {
    switch (currentSize) {
      case EGameSize.xs:
        return EBoardPromotionPieceSizes.xs;
      case EGameSize.sm:
        return EBoardPromotionPieceSizes.sm;
      case EGameSize.med:
        return EBoardPromotionPieceSizes.med;
      case EGameSize.lg:
        return EBoardPromotionPieceSizes.lg;
      case EGameSize.xl:
        return EBoardPromotionPieceSizes.xl;
    }
  }
  public statsSize(currentSize: EGameSize) {
    switch (currentSize) {
      case EGameSize.xs:
        return EStatsSize.xs;
      case EGameSize.sm:
        return EStatsSize.sm;
      case EGameSize.med:
        return EStatsSize.med;
      case EGameSize.lg:
        return EStatsSize.lg;
      case EGameSize.xl:
        return EStatsSize.xl;
    }
  }
}

export const GameSizes = new Sizes();
