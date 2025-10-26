import React, { useState } from "react";
import { gameConfig } from "../config/gameConfig";
import { GameState } from "../types/game";

interface ModeSwitcherProps {
  currentState: GameState;
  onStateChange: (state: GameState) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentState,
  onStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentMode = gameConfig.modes.find(
    (m) => m.id === currentState.modeId
  );
  const currentType = currentMode?.types.find(
    (t) => t.id === currentState.typeId
  );
  const currentLevel = currentType?.levels.find(
    (l) => l.id === currentState.levelId
  );

  const handleModeChange = (modeId: string) => {
    const mode = gameConfig.modes.find((m) => m.id === modeId);
    if (mode) {
      const firstType = mode.types[0];
      const firstLevel = firstType.levels[0];
      onStateChange({
        modeId,
        typeId: firstType.id,
        levelId: firstLevel.id,
      });
    }
  };

  const handleTypeChange = (typeId: string) => {
    const type = currentMode?.types.find((t) => t.id === typeId);
    if (type) {
      onStateChange({
        modeId: currentState.modeId,
        typeId,
        levelId: type.levels[0].id,
      });
    }
  };

  const handleLevelChange = (levelId: string) => {
    onStateChange({
      modeId: currentState.modeId,
      typeId: currentState.typeId,
      levelId,
    });
  };

  if (!isOpen) {
    return (
      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg active:bg-yellow-600"
        onClick={() => setIsOpen(true)}
      >
        Switch Mode
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Select Training Mode</h2>

        {/* Mode Selection */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Mode:</h3>
          <div className="space-y-2">
            {gameConfig.modes.map((mode) => (
              <button
                key={mode.id}
                className={`w-full text-left p-3 rounded border-2 ${
                  currentState.modeId === mode.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleModeChange(mode.id)}
              >
                <div className="font-semibold">
                  Stage {mode.stage}: {mode.name}
                </div>
                <div className="text-sm text-gray-600">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Type Selection */}
        {currentMode && currentMode.types.length > 1 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Type:</h3>
            <div className="space-y-2">
              {currentMode.types.map((type) => (
                <button
                  key={type.id}
                  className={`w-full text-left p-2 rounded border ${
                    currentState.typeId === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleTypeChange(type.id)}
                >
                  <div className="font-medium">{type.name}</div>
                  {type.description && (
                    <div className="text-xs text-gray-600">
                      {type.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level Selection */}
        {currentType && currentType.levels.length > 1 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Level:</h3>
            <div className="space-y-2">
              {currentType.levels.map((level) => (
                <button
                  key={level.id}
                  className={`w-full text-left p-2 rounded border ${
                    currentState.levelId === level.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleLevelChange(level.id)}
                >
                  <div className="font-medium">{level.name}</div>
                  {level.description && (
                    <div className="text-xs text-gray-600">
                      {level.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 active:bg-blue-600"
          onClick={() => setIsOpen(false)}
        >
          Start Training
        </button>
      </div>
    </div>
  );
};

export default ModeSwitcher;
