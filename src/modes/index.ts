import { ModeController, ModeId } from "../types/game";
import { chessColorsController } from "./ChessColorsMode";
import { boardVisualizationController } from "./CoordinatesMode";

export const modeControllers: Record<ModeId, ModeController> = {
  chessColors: chessColorsController,
  boardVisualization: boardVisualizationController,
};

export const getModeController = (modeId: ModeId): ModeController => {
  const controller = modeControllers[modeId];
  if (!controller) {
    throw new Error(`No controller found for mode: ${modeId}`);
  }
  return controller;
};
