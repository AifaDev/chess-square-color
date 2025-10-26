import React, { useState, useMemo } from "react";
import { gameConfig } from "../config/gameConfig";
import { getHighScore, getSessionEvents, clearAllData } from "../utils/storage";

interface StatsProps {
  onBack: () => void;
}

const Stats: React.FC<StatsProps> = ({ onBack }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const events = useMemo(() => getSessionEvents(), []);

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalQuestions = events.length;
    const correctAnswers = events.filter((e) => e.correct).length;
    const accuracy =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      totalQuestions,
      correctAnswers,
      accuracy,
    };
  }, [events]);

  // Mode color mapping (avoid green/yellow/red - reserved for difficulty levels)
  const modeColors: Record<string, { bg: string; text: string }> = {
    "Chess Colors": { bg: "bg-blue-50", text: "text-blue-600" },
    "Board Visualization": { bg: "bg-teal-50", text: "text-teal-600" },
    "Piece Memory": { bg: "bg-violet-50", text: "text-violet-600" },
    "Spatial Reasoning": { bg: "bg-pink-50", text: "text-pink-600" },
  };

  // Get all high scores by mode/type/level
  const allHighScores = useMemo(() => {
    const scores: Array<{
      mode: string;
      type: string;
      level: string;
      score: number;
      plays: number;
      last100Accuracy: number;
    }> = [];

    gameConfig.modes.forEach((mode) => {
      if (mode.comingSoon) return;
      mode.types.forEach((type) => {
        if (type.comingSoon) return;
        type.levels.forEach((level) => {
          const score = getHighScore(mode.id, type.id, level.id);
          const gameEvents = events.filter(
            (e) =>
              e.modeId === mode.id &&
              e.typeId === type.id &&
              e.levelId === level.id
          );
          const plays = gameEvents.length;

          // Calculate last 100 games accuracy
          const last100Events = gameEvents.slice(-100);
          const last100Correct = last100Events.filter((e) => e.correct).length;
          const last100Accuracy =
            last100Events.length > 0
              ? (last100Correct / last100Events.length) * 100
              : 0;

          if (score > 0) {
            scores.push({
              mode: mode.name,
              type: type.name,
              level: level.name,
              score,
              plays,
              last100Accuracy,
            });
          }
        });
      });
    });

    return scores.sort((a, b) => b.score - a.score);
  }, [events]);

  const handleReset = () => {
    if (showResetConfirm) {
      clearAllData();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  // Helper function to get difficulty color for level text
  const getDifficultyTextColor = (levelName: string): string => {
    const name = levelName.toLowerCase();
    if (name === "easy") return "text-green-600";
    if (name === "medium") return "text-yellow-600";
    if (name === "hard") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[400px] mx-auto bg-white rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition mr-3"
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
          <h1 className="text-2xl font-bold">Stats</h1>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Accuracy</div>
            <div className="text-xl font-bold text-blue-600">
              {stats.accuracy.toFixed(1)}%
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Plays</div>
            <div className="text-xl font-bold text-green-600">
              {stats.totalQuestions}
            </div>
          </div>
        </div>

        {/* High Scores by Mode/Type/Level */}
        {allHighScores.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">High Scores</h3>
            <div className="space-y-2">
              {allHighScores.map((item, idx) => {
                const colors = modeColors[item.mode] || {
                  bg: "bg-gray-50",
                  text: "text-gray-600",
                };
                return (
                  <div key={idx} className={`p-3 ${colors.bg} rounded-lg`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{item.mode}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600">
                            {item.type}
                            {item.level !== "Default" && (
                              <>
                                {" - "}
                                <span
                                  className={`font-semibold ${getDifficultyTextColor(
                                    item.level
                                  )}`}
                                >
                                  {item.level}
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${colors.text}`}>
                        {item.score}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${colors.text}`}>
                        {item.plays} {item.plays === 1 ? "play" : "plays"}
                      </span>
                      <span className="text-gray-600">
                        Last 100:{" "}
                        <span className="font-semibold">
                          {item.last100Accuracy.toFixed(1)}%
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {stats.totalQuestions === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No practice data yet</p>
            <p className="text-sm">Start practicing to see your stats!</p>
          </div>
        )}

        {/* Reset Button */}
        <button
          className={`w-full py-3 rounded-lg font-semibold transition ${
            showResetConfirm
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={handleReset}
        >
          {showResetConfirm
            ? "⚠️ Click again to confirm reset"
            : "Reset All Data"}
        </button>
      </div>
    </div>
  );
};

export default Stats;
