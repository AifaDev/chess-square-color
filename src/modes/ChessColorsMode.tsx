import React from "react";
import { ModeController, Question } from "../types/game";
import {
  getRandomSquare,
  isSquareBlack,
  getRandomPieceStartingPosition,
} from "../utils/chess";
import ChessBoard from "../components/ChessBoard";

export const chessColorsController: ModeController = {
  generateQuestion: (typeId, levelId, boardFlipped) => {
    if (typeId === "randomSquareColor") {
      const square = getRandomSquare();
      const squareColor = isSquareBlack(square);
      const correctAnswer = squareColor === "black" ? "dark" : "light";

      if (levelId === "hard") {
        // Text only - no board
        return {
          type: "choice",
          prompt: `What color is ${square}?`,
          correctAnswer,
          options: ["dark", "light"],
          levelId: levelId,
        };
      } else {
        // Easy or Medium - show board with/without labels
        return {
          type: "choice",
          highlight: square,
          correctAnswer,
          options: ["dark", "light"],
          levelId: levelId,
        };
      }
    } else if (typeId === "pieceStartingColor") {
      const piece = getRandomPieceStartingPosition();
      const squareColor = isSquareBlack(piece.square);
      const correctAnswer = squareColor === "black" ? "dark" : "light";

      if (levelId === "hard") {
        // Text only - no board
        return {
          type: "choice",
          prompt: `What color is the ${piece.pieceName}'s starting square?`,
          correctAnswer,
          options: ["dark", "light"],
          levelId: levelId,
          pieceInfo: piece,
        };
      } else {
        // Easy or Medium - show board with/without labels
        return {
          type: "choice",
          prompt: `What color is the ${piece.pieceName}'s starting square?`,
          highlight: piece.square,
          correctAnswer,
          options: ["dark", "light"],
          levelId: levelId,
          pieceInfo: piece,
        };
      }
    }

    throw new Error(`Unknown type: ${typeId}`);
  },

  checkAnswer: (question, answer) => {
    return question.correctAnswer === answer;
  },

  renderQuestion: (question, onAnswer) => {
    const questionData = question as any;
    const showLabels = questionData.levelId === "easy";

    // Function to render prompt with highlighted text
    const renderPrompt = (prompt: string) => {
      // Match patterns like "c3" (coordinates) or piece names between quotes/special context
      // Pattern 1: "What color is c3?" - highlight the coordinate
      const coordinateMatch = prompt.match(/What color is ([a-h][1-8])\?/);
      if (coordinateMatch) {
        const coord = coordinateMatch[1];
        const parts = prompt.split(coord);
        return (
          <h2 className="text-xl mb-4 text-center">
            {parts[0]}
            <span className="font-bold text-green-600">{coord}</span>
            {parts[1]}
          </h2>
        );
      }

      // Pattern 2: "What color is the [piece name]'s starting square?" - highlight the piece name
      const pieceMatch = prompt.match(
        /What color is the (.+?)'s starting square\?/
      );
      if (pieceMatch) {
        const pieceName = pieceMatch[1];
        const parts = prompt.split(pieceName);
        return (
          <h2 className="text-xl mb-4 text-center">
            {parts[0]}
            <span className="font-bold text-green-600">{pieceName}</span>
            {parts[1]}
          </h2>
        );
      }

      // Default: no highlighting
      return <h2 className="text-xl mb-4 text-center">{prompt}</h2>;
    };

    return (
      <div className="flex flex-col items-center w-full">
        {question.prompt && renderPrompt(question.prompt)}
        {question.highlight && (
          <ChessBoard
            highlight={question.highlight}
            showLabels={showLabels}
            showColors={false}
          />
        )}
        <div className="flex gap-4 mt-4">
          <button
            className="bg-[#769656] text-white px-6 py-3 rounded-lg text-lg active:opacity-80 border-2 border-gray-300"
            onClick={() => onAnswer("dark")}
          >
            Dark
          </button>
          <button
            className="bg-[#EEEED2] text-gray-800 px-6 py-3 border-2 border-gray-300 rounded-lg text-lg active:opacity-80"
            onClick={() => onAnswer("light")}
          >
            Light
          </button>
        </div>
      </div>
    );
  },
};
