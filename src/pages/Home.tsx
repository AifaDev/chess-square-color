import React, { useState, useEffect } from "react";
import { gameConfig } from "../config/gameConfig";
import { GameState } from "../types/game";
import { getStreak, getHighScore, getMastery } from "../utils/storage";

interface HomeProps {
  onStartPractice: (state: GameState) => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
}

const Home: React.FC<HomeProps> = ({
  onStartPractice,
  onOpenStats,
  onOpenAchievements,
}) => {
  // Helper to get initial selection from localStorage
  const getInitialSelection = () => {
    const stored = localStorage.getItem("cv:lastSelection");
    if (stored) {
      try {
        const { modeId, typeId, levelId } = JSON.parse(stored);
        const mode = gameConfig.modes.find((m) => m.id === modeId);
        if (mode) {
          const type = mode.types.find((t) => t.id === typeId);
          if (type) {
            const level = type.levels.find((l) => l.id === levelId);
            if (level) {
              return { mode, type, level };
            }
          }
        }
      } catch (e) {
        // Invalid stored data, fall back to defaults
      }
    }
    // Default to first mode/type/level
    return {
      mode: gameConfig.modes[0],
      type: gameConfig.modes[0].types[0],
      level: gameConfig.modes[0].types[0].levels[0],
    };
  };

  const initial = getInitialSelection();

  // Helper functions to check mastery
  const isLevelMastered = (modeId: string, typeId: string, levelId: string) => {
    return getMastery(modeId, typeId, levelId);
  };

  const isTypeMastered = (modeId: string, typeId: string) => {
    const mode = gameConfig.modes.find((m) => m.id === modeId);
    const type = mode?.types.find((t) => t.id === typeId);
    if (!type) return false;
    // Type is mastered when all levels (including master) are mastered
    return type.levels.every((level) => getMastery(modeId, typeId, level.id));
  };

  const areRegularLevelsMastered = (modeId: string, typeId: string) => {
    const mode = gameConfig.modes.find((m) => m.id === modeId);
    const type = mode?.types.find((t) => t.id === typeId);
    if (!type) return false;
    // Check if all non-master levels are mastered
    return type.levels
      .filter((level) => level.id !== "master")
      .every((level) => getMastery(modeId, typeId, level.id));
  };

  const isModeMastered = (modeId: string) => {
    const mode = gameConfig.modes.find((m) => m.id === modeId);
    if (!mode) return false;
    return mode.types.every((type) =>
      type.levels.every((level) => getMastery(modeId, type.id, level.id))
    );
  };

  // Mode color mapping (avoid green/yellow/red - reserved for difficulty levels)
  const modeColors: Record<string, { bg: string; border: string }> = {
    "Chess Colors": { bg: "bg-blue-50", border: "border-blue-500" },
    "Board Visualization": { bg: "bg-teal-50", border: "border-teal-500" },
    "Piece Memory": { bg: "bg-violet-50", border: "border-violet-500" },
    "Spatial Reasoning": { bg: "bg-pink-50", border: "border-pink-500" },
  };

  // Mode icons
  const modeIcons: Record<string, React.ReactNode> = {
    "Chess Colors": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    "Board Visualization": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    ),
    "Piece Memory": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <circle cx="8" cy="9" r="1.5" />
        <circle cx="16" cy="9" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="8" cy="15" r="1.5" />
        <circle cx="16" cy="15" r="1.5" />
      </svg>
    ),
    "Spatial Reasoning": (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-3.72-.9-6.5-4.82-6.5-9.5V8.3l6.5-3.8 6.5 3.8V11c0 4.68-2.78 8.6-6.5 9.5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  };

  const [selectedMode, setSelectedMode] = useState(initial.mode);
  const [selectedType, setSelectedType] = useState(initial.type);
  const [selectedLevel, setSelectedLevel] = useState(initial.level);

  // Save selection to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "cv:lastSelection",
      JSON.stringify({
        modeId: selectedMode.id,
        typeId: selectedType.id,
        levelId: selectedLevel.id,
      })
    );
  }, [selectedMode, selectedType, selectedLevel]);

  const handleModeChange = (modeId: string) => {
    const mode = gameConfig.modes.find((m) => m.id === modeId);
    if (mode) {
      setSelectedMode(mode);
      const type = mode.types[0];
      setSelectedType(type);
      setSelectedLevel(type.levels[0]);
    }
  };

  const handleTypeChange = (typeId: string) => {
    const type = selectedMode.types.find((t) => t.id === typeId);
    if (type) {
      setSelectedType(type);
      setSelectedLevel(type.levels[0]);
    }
  };

  const handleLevelChange = (levelId: string) => {
    const level = selectedType.levels.find((l) => l.id === levelId);
    if (level) {
      setSelectedLevel(level);
    }
  };

  const handleStart = () => {
    if (selectedMode.comingSoon || selectedType.comingSoon) {
      return;
    }
    onStartPractice({
      modeId: selectedMode.id,
      typeId: selectedType.id,
      levelId: selectedLevel.id,
    });
  };

  const highScore = getHighScore(
    selectedMode.id,
    selectedType.id,
    selectedLevel.id
  );
  const currentStreak = getStreak(
    selectedMode.id,
    selectedType.id,
    selectedLevel.id
  );

  const isLocked = selectedMode.comingSoon || selectedType.comingSoon;

  // Get button colors based on selected mode (avoid green/yellow/red)
  const buttonColors: Record<
    string,
    { bg: string; hover: string; active: string }
  > = {
    "Chess Colors": {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      active: "active:bg-blue-700",
    },
    "Board Visualization": {
      bg: "bg-teal-500",
      hover: "hover:bg-teal-600",
      active: "active:bg-teal-700",
    },
    "Piece Memory": {
      bg: "bg-violet-500",
      hover: "hover:bg-violet-600",
      active: "active:bg-violet-700",
    },
    "Spatial Reasoning": {
      bg: "bg-pink-500",
      hover: "hover:bg-pink-600",
      active: "active:bg-pink-700",
    },
  };

  const btnColors = buttonColors[selectedMode.name] || {
    bg: "bg-blue-500",
    hover: "hover:bg-blue-600",
    active: "active:bg-blue-700",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full bg-white p-6 rounded-lg flex flex-col max-w-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">♟️ Chess Vision</h1>
          <div className="flex gap-2">
            <button
              onClick={onOpenAchievements}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Achievements"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </button>
            <button
              onClick={onOpenStats}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Stats"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mode Picker */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mode
          </label>
          <div className="space-y-2">
            {gameConfig.modes.map((mode) => {
              const modeMastered = !mode.comingSoon && isModeMastered(mode.id);
              const colors = modeColors[mode.name] || {
                bg: "bg-gray-50",
                border: "border-gray-500",
              };
              const iconColor =
                modeMastered && selectedMode.id === mode.id
                  ? "text-yellow-600"
                  : selectedMode.id === mode.id
                  ? buttonColors[mode.name]?.bg.replace("bg-", "text-") ||
                    "text-gray-600"
                  : "text-gray-400";

              return (
                <button
                  key={mode.id}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    modeMastered && selectedMode.id === mode.id
                      ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-500"
                      : modeMastered
                      ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-gray-300 hover:border-gray-400"
                      : selectedMode.id === mode.id
                      ? `${colors.border} ${colors.bg}`
                      : "border-gray-300 hover:border-gray-400"
                  } ${mode.comingSoon ? "opacity-50" : ""}`}
                  onClick={() => !mode.comingSoon && handleModeChange(mode.id)}
                  disabled={mode.comingSoon}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 flex-shrink-0 ${iconColor}`}>
                      {modeIcons[mode.name]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 min-h-[24px]">
                        <span className="font-medium">{mode.name}</span>
                        {modeMastered && (
                          <span className="text-lg leading-none">👑</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {mode.description}
                      </div>
                    </div>
                    {mode.comingSoon && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                        Soon
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Type Picker */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type
          </label>
          <div className="space-y-2">
            {selectedMode.types
              .slice()
              .sort(
                (a, b) => (a.difficultyOrder || 0) - (b.difficultyOrder || 0)
              )
              .map((type) => {
                const typeMastered =
                  !type.comingSoon && isTypeMastered(selectedMode.id, type.id);
                const colors = modeColors[selectedMode.name] || {
                  bg: "bg-gray-50",
                  border: "border-gray-500",
                };
                return (
                  <button
                    key={type.id}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      typeMastered && selectedType.id === type.id
                        ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-500"
                        : typeMastered
                        ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-gray-300 hover:border-gray-400"
                        : selectedType.id === type.id
                        ? `${colors.border} ${colors.bg}`
                        : "border-gray-300 hover:border-gray-400"
                    } ${type.comingSoon ? "opacity-50" : ""}`}
                    onClick={() =>
                      !type.comingSoon && handleTypeChange(type.id)
                    }
                    disabled={type.comingSoon}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 min-h-[24px]">
                          <span className="font-medium">{type.name}</span>
                          {typeMastered && (
                            <span className="text-lg leading-none">⭐</span>
                          )}
                          {type.difficulty && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium capitalize">
                              {type.difficulty}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {type.description}
                        </div>
                      </div>
                      {type.comingSoon && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                          Soon
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Level Picker */}
        {selectedType.levels.filter((l) => l.id !== "master").length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Level
            </label>
            <div className="flex gap-2">
              {selectedType.levels
                .filter((level) => level.id !== "master")
                .map((level) => {
                  const levelMastered = isLevelMastered(
                    selectedMode.id,
                    selectedType.id,
                    level.id
                  );

                  // Use mode colors for level selection
                  const colors = modeColors[selectedMode.name] || {
                    bg: "bg-gray-50",
                    border: "border-gray-500",
                  };

                  return (
                    <button
                      key={level.id}
                      className={`flex-1 p-3 rounded-lg border-2 transition ${
                        levelMastered && selectedLevel.id === level.id
                          ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-500 "
                          : levelMastered
                          ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-gray-300 hover:border-gray-400"
                          : selectedLevel.id === level.id
                          ? `${colors.border} ${colors.bg}`
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => handleLevelChange(level.id)}
                    >
                      <div className="flex items-center justify-center gap-1 min-h-[24px]">
                        <span className="font-medium text-sm">
                          {level.name}
                        </span>
                        {levelMastered && (
                          <span className="text-base leading-none">🏅</span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Master Level - Unlocks when all regular levels are mastered */}
        {areRegularLevelsMastered(selectedMode.id, selectedType.id) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              🔓 Secret Level Unlocked!
            </div>
            {(() => {
              const masterLevel = selectedType.levels.find(
                (l) => l.id === "master"
              );
              if (!masterLevel) return null;

              const masterLevelMastered = isLevelMastered(
                selectedMode.id,
                selectedType.id,
                "master"
              );

              // Use mode colors
              const colors = modeColors[selectedMode.name] || {
                bg: "bg-gray-50",
                border: "border-gray-500",
              };

              return (
                <button
                  className={`w-full p-4 rounded-lg border-2 transition ${
                    masterLevelMastered && selectedLevel.id === "master"
                      ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-500 shadow-lg"
                      : masterLevelMastered
                      ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-gray-300 hover:border-gray-400"
                      : selectedLevel.id === "master"
                      ? `${colors.border} ${colors.bg}`
                      : "border-gray-300 hover:border-gray-400 bg-gradient-to-r from-purple-50 to-indigo-50"
                  }`}
                  onClick={() => handleLevelChange("master")}
                >
                  <div className="flex items-center justify-center gap-2 min-h-[24px]">
                    <span className="text-lg">👑</span>
                    <span className="font-bold text-base">
                      {masterLevel.name}
                    </span>
                    {masterLevelMastered && (
                      <span className="text-lg leading-none">🏅</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {masterLevel.description}
                  </div>
                </button>
              );
            })()}
          </div>
        )}

        {/* Practice Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Practice Summary</h3>
          <p className="text-sm text-gray-600 mb-3">
            {selectedMode.name} → {selectedType.name}
            {selectedType.levels.length > 1 && ` → ${selectedLevel.name}`}
          </p>
          <p className="text-sm text-gray-700">{selectedType.description}</p>
        </div>

        {/* Quick Stats */}
        <div
          className={`flex justify-around ${
            modeColors[selectedMode.name]?.bg || "bg-blue-50"
          } p-3 rounded-lg mb-4`}
        >
          <div className="text-center">
            <div className="text-xs text-gray-600">High Score</div>
            <div
              className={`text-lg font-bold ${
                buttonColors[selectedMode.name]?.bg.replace("bg-", "text-") ||
                "text-blue-600"
              }`}
            >
              {highScore}
            </div>
          </div>
          {selectedLevel.id !== "master" && (
            <div className="text-center">
              <div className="text-xs text-gray-600">Current Streak</div>
              <div
                className={`text-lg font-bold ${
                  buttonColors[selectedMode.name]?.bg.replace("bg-", "text-") ||
                  "text-blue-600"
                }`}
              >
                {currentStreak}
              </div>
            </div>
          )}
        </div>

        {/* Start Button */}
        <button
          className={`w-full py-4 rounded-lg text-white text-lg font-semibold transition ${
            isLocked
              ? "bg-gray-400 cursor-not-allowed"
              : `${btnColors.bg} ${btnColors.hover} ${btnColors.active}`
          }`}
          onClick={handleStart}
          disabled={isLocked}
        >
          {isLocked ? "Coming Soon" : "Start Practice"}
        </button>

        {/* Footer Note */}
        {selectedLevel.id !== "master" && (
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>💡 Hold "Cheat" during practice to see the board</p>
            <p className="mt-1">(resets your streak)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
