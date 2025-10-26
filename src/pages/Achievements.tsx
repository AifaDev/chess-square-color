import React, { useMemo } from "react";
import { gameConfig } from "../config/gameConfig";
import { getMastery, getHighScore } from "../utils/storage";

interface AchievementsProps {
  onBack: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onBack }) => {
  // Mode color mapping
  const modeColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    "Chess Colors": {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-500",
    },
    "Board Visualization": {
      bg: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-500",
    },
    "Piece Memory": {
      bg: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-500",
    },
    "Spatial Reasoning": {
      bg: "bg-pink-50",
      text: "text-pink-600",
      border: "border-pink-500",
    },
  };

  // Check mastery for all levels
  const masteryData = useMemo(() => {
    const data: any[] = [];

    gameConfig.modes.forEach((mode) => {
      if (mode.comingSoon) return;

      mode.types.forEach((type) => {
        if (type.comingSoon) return;

        type.levels.forEach((level) => {
          const isMastered = getMastery(mode.id, type.id, level.id);
          const highScore = getHighScore(mode.id, type.id, level.id);

          data.push({
            mode: mode.name,
            type: type.name,
            level: level.name,
            isMastered,
            highScore,
            modeId: mode.id,
            typeId: type.id,
            levelId: level.id,
          });
        });
      });
    });

    return data;
  }, []);

  const totalMasteries = masteryData.length;
  const unlockedMasteries = masteryData.filter((m) => {
    const requiredScore = m.levelId === "master" ? 50 : 100;
    return m.isMastered || m.highScore >= requiredScore;
  }).length;

  // Get difficulty text color
  const getDifficultyTextColor = (levelName: string) => {
    const name = levelName.toLowerCase();
    if (name === "easy") return "text-green-600";
    if (name === "medium") return "text-yellow-600";
    if (name === "hard") return "text-red-600";
    if (name === "master") return "text-purple-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-3">
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
              🏆 Achievements
            </h1>
            <div className="w-10"></div>
          </div>

          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg p-3 md:p-4">
            <div className="text-center mb-2">
              <p className="text-xs md:text-sm text-gray-600">
                Total Masteries Unlocked
              </p>
              <p className="text-3xl md:text-4xl font-bold text-yellow-600">
                {unlockedMasteries} / {totalMasteries}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    totalMasteries > 0
                      ? (unlockedMasteries / totalMasteries) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">
              {totalMasteries > 0
                ? Math.round((unlockedMasteries / totalMasteries) * 100)
                : 0}
              % Complete
            </p>
          </div>
        </div>

        {/* Masteries by Mode */}
        {gameConfig.modes.map((mode) => {
          if (mode.comingSoon) return null;

          const modeMasteries = masteryData.filter((m) => m.mode === mode.name);
          const modeUnlocked = modeMasteries.filter((m) => {
            const requiredScore = m.levelId === "master" ? 50 : 100;
            return m.isMastered || m.highScore >= requiredScore;
          }).length;
          const modeTotal = modeMasteries.length;
          const colors = modeColors[mode.name] || {
            bg: "bg-gray-50",
            text: "text-gray-600",
            border: "border-gray-500",
          };

          // Check if all levels in this mode are mastered
          const allModeMastered = modeTotal > 0 && modeUnlocked === modeTotal;

          return (
            <div
              key={mode.id}
              className="bg-white rounded-lg  p-4 md:p-6 mb-4 md:mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2
                      className={`text-xl md:text-2xl font-bold ${colors.text}`}
                    >
                      {mode.name}
                    </h2>
                    {allModeMastered && (
                      <span className="text-xl md:text-2xl animate-pulse">
                        👑
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">
                    {mode.description}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs md:text-sm text-gray-600">Progress</p>
                  <p className={`text-lg md:text-xl font-bold ${colors.text}`}>
                    {modeUnlocked} / {modeTotal}
                  </p>
                </div>
              </div>

              {/* Types */}
              <div className="space-y-3 md:space-y-4">
                {mode.types
                  .slice()
                  .sort(
                    (a, b) =>
                      (a.difficultyOrder || 0) - (b.difficultyOrder || 0)
                  )
                  .map((type) => {
                    if (type.comingSoon) return null;

                    const typeMasteries = masteryData.filter(
                      (m) => m.mode === mode.name && m.type === type.name
                    );
                    const typeUnlocked = typeMasteries.filter((m) => {
                      const requiredScore = m.levelId === "master" ? 50 : 100;
                      return m.isMastered || m.highScore >= requiredScore;
                    }).length;
                    const typeTotal = typeMasteries.length;
                    const allTypeMastered =
                      typeTotal > 0 && typeUnlocked === typeTotal;

                    return (
                      <div
                        key={type.id}
                        className={`p-3 md:p-4 rounded-lg border-2 ${
                          allTypeMastered
                            ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400"
                            : colors.bg + " " + colors.border
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-3 gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm md:text-base">
                              {type.name}
                            </h3>
                            {allTypeMastered && (
                              <span className="text-lg md:text-xl animate-pulse">
                                ⭐
                              </span>
                            )}
                            {type.difficulty && (
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium capitalize">
                                {type.difficulty}
                              </span>
                            )}
                          </div>
                          <span className="text-xs md:text-sm font-medium text-gray-600">
                            {typeUnlocked} / {typeTotal}
                          </span>
                        </div>

                        {/* Levels */}
                        <div className="grid grid-cols-1 gap-2">
                          {type.levels.map((level) => {
                            const mastery = typeMasteries.find(
                              (m) => m.level === level.name
                            );
                            const highScore = mastery?.highScore || 0;
                            const isMasterLevel = level.id === "master";
                            const requiredScore = isMasterLevel ? 50 : 100;
                            const isMastered =
                              mastery?.isMastered || highScore >= requiredScore;

                            return (
                              <div
                                key={level.id}
                                className={`relative p-2 md:p-3 rounded-lg border-2 transition-all ${
                                  isMastered && isMasterLevel
                                    ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-500 shadow-xl"
                                    : isMastered
                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 shadow-lg"
                                    : isMasterLevel
                                    ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 opacity-60"
                                    : "bg-gray-50 border-gray-300 opacity-60"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                                    <div className="min-w-0 flex-1">
                                      <p
                                        className={`font-semibold text-sm md:text-base ${getDifficultyTextColor(
                                          level.name
                                        )} flex items-center gap-1`}
                                      >
                                        {isMasterLevel && <span>👑</span>}
                                        {level.name}
                                      </p>
                                      <p className="text-xs text-gray-600 break-words">
                                        {isMastered
                                          ? isMasterLevel
                                            ? "Mastered! 50+ in 60 seconds 👑"
                                            : "Mastered! Streak of 100+"
                                          : highScore > 0
                                          ? isMasterLevel
                                            ? `Best streak: ${highScore}/50`
                                            : `Best streak: ${highScore}/100`
                                          : isMasterLevel
                                          ? "🔒 Master all other levels first"
                                          : "Not started"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    {isMastered ? (
                                      <div className="w-14 h-14 flex items-center justify-center">
                                        <svg
                                          className="w-10 h-10 text-green-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                    ) : highScore > 0 ? (
                                      <div className="relative w-14 h-14 flex items-center justify-center">
                                        <svg className="w-14 h-14 transform -rotate-90">
                                          <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            className="text-gray-200"
                                          />
                                          <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray={`${
                                              2 * Math.PI * 24
                                            }`}
                                            strokeDashoffset={`${
                                              2 *
                                              Math.PI *
                                              24 *
                                              (1 -
                                                highScore /
                                                  (isMasterLevel ? 50 : 100))
                                            }`}
                                            className="text-blue-500 transition-all duration-300"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <span className="text-xs font-semibold text-gray-700">
                                            {highScore}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="relative w-14 h-14 flex items-center justify-center">
                                        <svg className="w-14 h-14 transform -rotate-90">
                                          <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            className="text-gray-300"
                                          />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <span className="text-xs font-semibold text-gray-700 opacity-0">
                                            0
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="bg-white rounded-lg p-4 md:p-6">
          <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">
            How to Unlock Masteries
          </h3>
          <div className="space-y-2 text-xs md:text-sm text-gray-600">
            <p>
              🏅 <strong>Level Mastery:</strong> Achieve a streak of 100 or more
            </p>
            <p>
              👑 <strong>Master Level:</strong> Secret level unlocked after
              mastering all other levels. Complete 50 correct answers within 60
              seconds!
            </p>
            <p>
              ⭐ <strong>Type Mastery:</strong> Master all levels (including
              Master) within a type
            </p>
            <p>
              👑 <strong>Mode Mastery:</strong> Master all types within a mode
            </p>
            <p className="text-xs mt-3 md:mt-4 text-gray-500">
              Note: Once mastered, achievements are permanent even if your
              streak resets later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
