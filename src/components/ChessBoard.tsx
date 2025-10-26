import React from "react";
import {
  getSquareFromCoordinates,
  isSquareBlack,
  FILES,
  RANKS,
} from "../utils/chess";

interface ChessBoardProps {
  highlight?: string;
  showLabels?: boolean;
  showColors?: boolean;
  onSquareClick?: (square: string) => void;
  showSquareLabels?: boolean;
  highlightFile?: string;
  highlightRank?: string;
  flipped?: boolean;
  knightSquare?: string;
  selectedSquares?: string[];
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  highlight,
  showLabels = false,
  showColors = false,
  onSquareClick,
  showSquareLabels = false,
  highlightFile,
  highlightRank,
  flipped = false,
  knightSquare,
  selectedSquares = [],
}) => {
  const CELL_SIZE = 38; // pixels per cell

  const squares = Array(64)
    .fill(0)
    .map((_, idx) => {
      // Calculate visual position
      let visualRow = Math.floor(idx / 8);
      let visualCol = idx % 8;

      // Calculate logical position (which square this is)
      let logicalRow = visualRow;
      let logicalCol = visualCol;

      // Flip the visual mapping if needed
      if (flipped) {
        logicalRow = 7 - visualRow;
        logicalCol = 7 - visualCol;
      }

      const square = getSquareFromCoordinates(logicalRow, logicalCol);
      const file = square[0];
      const rank = square[1];

      const isHighlighted = square === highlight;
      const isFileHighlighted = highlightFile && file === highlightFile;
      const isRankHighlighted = highlightRank && rank === highlightRank;
      const isKnightSquare = square === knightSquare;
      const isSelected = selectedSquares.includes(square);
      const squareColor = isSquareBlack(square);

      let bgColor = showColors
        ? squareColor === "black"
          ? "bg-[#769656]"
          : "bg-[#EEEED2]"
        : "bg-gray-200";

      // Override background for selected squares
      if (isSelected) {
        bgColor = "bg-blue-300";
      }

      // Build border classes for file/rank highlights to form rectangles
      let borderClass = "";

      if (isHighlighted) {
        // Single square highlight - all borders
        borderClass = "border-4 border-blue-500";
      } else if (isFileHighlighted) {
        // File highlight (vertical) - always left/right, top/bottom only at edges
        borderClass = "border-blue-500";
        borderClass += " border-l-4 border-r-4"; // All squares get left/right
        if (visualRow === 0) borderClass += " border-t-4"; // Top edge
        if (visualRow === 7) borderClass += " border-b-4"; // Bottom edge
      } else if (isRankHighlighted) {
        // Rank highlight (horizontal) - always top/bottom, left/right only at edges
        borderClass = "border-blue-500";
        borderClass += " border-t-4 border-b-4"; // All squares get top/bottom
        if (visualCol === 0) borderClass += " border-l-4"; // Left edge
        if (visualCol === 7) borderClass += " border-r-4"; // Right edge
      } else {
        // No highlight - subtle borders
        borderClass = "border border-black/5";
      }

      return (
        <div
          key={square}
          className={`${bgColor} ${borderClass} flex items-center justify-center text-xs ${
            onSquareClick
              ? "cursor-pointer hover:opacity-80 active:opacity-60"
              : ""
          } relative`}
          style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
          onClick={() => onSquareClick && onSquareClick(square)}
        >
          {showSquareLabels && (
            <span className="text-gray-500 font-mono select-none text-[10px]">
              {square}
            </span>
          )}
        </div>
      );
    });

  const BOARD_SIZE = CELL_SIZE * 8; // 8 cells

  const rankLabels = flipped ? RANKS.split("") : RANKS.split("").reverse();
  const fileLabels = flipped ? FILES.split("").reverse() : FILES.split("");

  return (
    <div className="mb-3">
      {showLabels ? (
        <div className="flex gap-2">
          {/* Rank labels on the left */}
          <div
            className="flex flex-col justify-around text-sm text-gray-600 font-mono"
            style={{ width: "20px", height: `${BOARD_SIZE}px` }}
          >
            {rankLabels.map((rank) => (
              <div
                key={rank}
                className="flex items-center justify-center"
                style={{ height: `${CELL_SIZE}px` }}
              >
                {rank}
              </div>
            ))}
          </div>

          {/* Chess board and file labels wrapper */}
          <div>
            {/* Chess board */}
            <div
              className="grid grid-cols-8 gap-0"
              style={{
                width: `${CELL_SIZE * 8}px`,
                height: `${CELL_SIZE * 8}px`,
              }}
            >
              {squares}
            </div>

            {/* File labels at the bottom */}
            <div className="flex justify-around mt-1 text-sm text-gray-600">
              {fileLabels.map((file) => (
                <span
                  key={file}
                  className="text-center font-mono"
                  style={{ width: `${CELL_SIZE}px` }}
                >
                  {file}
                </span>
              ))}
            </div>
          </div>

          {/* Invisible spacer on the right to center the board */}
          <div style={{ width: "20px", height: `${BOARD_SIZE}px` }}></div>
        </div>
      ) : (
        <div
          className="grid grid-cols-8 gap-0"
          style={{ width: `${CELL_SIZE * 8}px`, height: `${CELL_SIZE * 8}px` }}
        >
          {squares}
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
