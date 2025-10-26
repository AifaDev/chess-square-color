import React, { useState, useCallback, useEffect, useRef } from "react";
import ChessBoard from "./ChessBoard";

interface CheatOverlayProps {
  currentSquare: string;
  onCheat: () => void;
}

const CheatOverlay: React.FC<CheatOverlayProps> = ({
  currentSquare,
  onCheat,
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const isHoldingRef = useRef(false);

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isHoldingRef.current = true;
      setIsShowing(true);
      // Reset streak immediately when holding
      onCheat();
    },
    [onCheat]
  );

  // Global pointer up listener to catch release anywhere
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isHoldingRef.current) {
        isHoldingRef.current = false;
        setIsShowing(false);
      }
    };

    window.addEventListener("mouseup", handleGlobalPointerUp);
    window.addEventListener("touchend", handleGlobalPointerUp);
    window.addEventListener("touchcancel", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalPointerUp);
      window.removeEventListener("touchend", handleGlobalPointerUp);
      window.removeEventListener("touchcancel", handleGlobalPointerUp);
    };
  }, []);

  return (
    <div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded active:bg-red-600 select-none"
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{ WebkitTouchCallout: "none", userSelect: "none" }}
      >
        Hold to Cheat
      </button>

      {isShowing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          style={{ pointerEvents: "none" }}
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Cheat Sheet</h2>
            <div className="flex justify-center">
              <ChessBoard
                highlight={currentSquare}
                showLabels={true}
                showColors={true}
                showSquareLabels={true}
              />
            </div>
            <p className="text-center text-red-600 font-bold mt-4">
              ⚠️ Streak has been reset
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatOverlay;
