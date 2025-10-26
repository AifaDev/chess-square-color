import React, { useState, useEffect } from "react";
import { GameState, Question } from "../types/game";
import { gameConfig } from "../config/gameConfig";
import { getModeController } from "../modes";
import {
  getStreak,
  setStreak,
  getHighScore,
  setHighScore,
  resetStreak,
  addSessionEvent,
  checkAndSetMastery,
} from "../utils/storage";
import StreakHUD from "../components/StreakHUD";
import CheatOverlay from "../components/CheatOverlay";

interface PracticeProps {
  gameState: GameState;
  onExit: () => void;
}

const Practice: React.FC<PracticeProps> = ({ gameState, onExit }) => {
  const [question, setQuestion] = useState<Question & { levelId?: string }>(
    () => {
      const controller = getModeController(gameState.modeId);
      // For master level, use hard level logic
      const levelToUse =
        gameState.levelId === "master" ? "hard" : gameState.levelId;
      const q = controller.generateQuestion(gameState.typeId, levelToUse);
      return { ...q, levelId: gameState.levelId };
    }
  );

  const [streak, setStreakState] = useState(() =>
    getStreak(gameState.modeId, gameState.typeId, gameState.levelId)
  );
  const [highScore, setHighScoreState] = useState(() =>
    getHighScore(gameState.modeId, gameState.typeId, gameState.levelId)
  );

  // Timer state for Master level (60 seconds)
  const [timeLeft, setTimeLeft] = useState<number | null>(
    gameState.levelId === "master" ? 60 : null
  );
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    const controller = getModeController(gameState.modeId);
    // For master level, use hard level logic
    const levelToUse =
      gameState.levelId === "master" ? "hard" : gameState.levelId;
    const newQuestion = controller.generateQuestion(
      gameState.typeId,
      levelToUse
    );
    setQuestion({ ...newQuestion, levelId: gameState.levelId });

    const newStreak = getStreak(
      gameState.modeId,
      gameState.typeId,
      gameState.levelId
    );
    const newHighScore = getHighScore(
      gameState.modeId,
      gameState.typeId,
      gameState.levelId
    );
    setStreakState(newStreak);
    setHighScoreState(newHighScore);

    // Reset timer for Master level
    if (gameState.levelId === "master") {
      setTimeLeft(60);
      setTimerStarted(false);
    } else {
      setTimeLeft(null);
      setTimerStarted(false);
    }
  }, [gameState]);

  // Timer countdown effect for Master level
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || !timerStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          // Timer expired, reset streak
          resetStreak(gameState.modeId, gameState.typeId, gameState.levelId);
          setStreakState(0);
          setTimerStarted(false); // Stop timer

          // Update high score display
          const newHighScore = getHighScore(
            gameState.modeId,
            gameState.typeId,
            gameState.levelId
          );
          setHighScoreState(newHighScore);

          return 60; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerStarted, gameState]);

  // Auto-reset streak and timer when exiting Master level
  useEffect(() => {
    return () => {
      if (gameState.levelId === "master") {
        resetStreak(gameState.modeId, gameState.typeId, gameState.levelId);
      }
    };
  }, [gameState.modeId, gameState.typeId, gameState.levelId]);

  const handleAnswer = (answer: string) => {
    // Start timer on first answer for Master level
    if (gameState.levelId === "master" && !timerStarted) {
      setTimerStarted(true);
    }

    const controller = getModeController(gameState.modeId);
    const isCorrect = controller.checkAnswer(question, answer);

    // Track the event
    addSessionEvent(
      gameState.modeId,
      gameState.typeId,
      gameState.levelId,
      isCorrect,
      question.correctAnswer,
      answer
    );

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreakState(newStreak);
      setStreak(
        gameState.modeId,
        gameState.typeId,
        gameState.levelId,
        newStreak
      );
      setHighScore(
        gameState.modeId,
        gameState.typeId,
        gameState.levelId,
        newStreak
      );

      const newHighScore = getHighScore(
        gameState.modeId,
        gameState.typeId,
        gameState.levelId
      );
      setHighScoreState(newHighScore);

      // If Master level and reached 50, stop timer and show high score
      if (gameState.levelId === "master" && newStreak >= 50) {
        setTimerStarted(false);
        setTimeLeft(60);
      }
    } else {
      setStreakState(0);
      setStreak(gameState.modeId, gameState.typeId, gameState.levelId, 0);

      // If Master level and wrong answer, stop timer and reset
      if (gameState.levelId === "master") {
        setTimerStarted(false);
        setTimeLeft(60);
      }
    }

    // Check for mastery achievement
    checkAndSetMastery(gameState.modeId, gameState.typeId, gameState.levelId);

    // Generate next question
    // For master level, use hard level logic
    const levelToUse =
      gameState.levelId === "master" ? "hard" : gameState.levelId;
    const newQuestion = controller.generateQuestion(
      gameState.typeId,
      levelToUse
    );
    setQuestion({ ...newQuestion, levelId: gameState.levelId });
  };

  const handleCheat = () => {
    resetStreak(gameState.modeId, gameState.typeId, gameState.levelId);
    setStreakState(0);

    // If Master level, also stop timer and reset
    if (gameState.levelId === "master") {
      setTimerStarted(false);
      setTimeLeft(60);
    }
  };

  const currentMode = gameConfig.modes.find((m) => m.id === gameState.modeId);
  const currentType = currentMode?.types.find((t) => t.id === gameState.typeId);

  const controller = getModeController(gameState.modeId);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full bg-white p-6 rounded-lg flex flex-col items-center max-w-[400px]">
        {/* Header with Exit Button */}
        <div className="w-full flex justify-between items-center mb-2">
          <button
            onClick={onExit}
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
          <h1 className="text-2xl font-bold">♟️ Chess Vision</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <p className="text-sm text-gray-600 mb-2 text-center">
          {currentMode?.name} - {currentType?.name}
          {gameState.levelId === "master" && " - 👑 Master"}
        </p>

        {/* Streak and High Score - Hidden in Master Level */}
        {gameState.levelId !== "master" && (
          <StreakHUD streak={streak} highScore={highScore} />
        )}

        {/* Timer for Master Level */}
        {timeLeft !== null && (
          <div className="w-full mt-4">
            <div
              className={`p-4 rounded-lg border-2 ${
                !timerStarted
                  ? "bg-purple-50 border-purple-500"
                  : timeLeft <= 10
                  ? "bg-red-50 border-red-500 animate-pulse"
                  : timeLeft <= 30
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-blue-50 border-blue-500"
              }`}
            >
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">
                  {timerStarted ? "Time Remaining" : "High Score"}
                </p>
                <p
                  className={`text-3xl font-bold ${
                    !timerStarted
                      ? "text-purple-600"
                      : timeLeft <= 10
                      ? "text-red-600"
                      : timeLeft <= 30
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {timerStarted ? (
                    <>
                      {Math.floor(timeLeft / 60)}:
                      {String(timeLeft % 60).padStart(2, "0")}
                    </>
                  ) : (
                    highScore
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {timerStarted
                    ? streak >= 50
                      ? "🎉 You won!"
                      : `${50 - streak} more to win!`
                    : "Answer your first question to start"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full border-t border-gray-200 my-6"></div>

        {/* Question Area */}
        <div className="w-full flex flex-col items-center">
          {controller.renderQuestion(question, handleAnswer)}
        </div>

        {/* Divider - Only shown for non-Master levels */}
        {gameState.levelId !== "master" && (
          <div className="w-full border-t border-gray-200 my-6"></div>
        )}

        {/* Action Buttons - Hidden in Master Level */}
        {gameState.levelId !== "master" && (
          <div className="flex gap-4">
            <CheatOverlay
              currentSquare={question.correctAnswer}
              onCheat={handleCheat}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
