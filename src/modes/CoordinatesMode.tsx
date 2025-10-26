import React, { useState } from "react";
import { ModeController, Question } from "../types/game";
import {
  getRandomSquare,
  FILES,
  RANKS,
  getKnightMoves,
  getRandomKnightSquare,
  getRandomPieceStartingPosition,
} from "../utils/chess";
import ChessBoard from "../components/ChessBoard";
import whitePawn from "../assets/Pawn-white.svg.png";
import blackPawn from "../assets/Pawn-black.svg.png";

// Helper function to render prompts with highlighted text
const renderHighlightedPrompt = (
  prompt: string,
  className: string = "text-xl mb-4 font-bold text-center"
) => {
  // Pattern 1: "Find [coordinate]" - highlight the coordinate
  let match = prompt.match(/Find (the )?([a-h][1-8])/);
  if (match) {
    const coord = match[2];
    const parts = prompt.split(coord);
    return (
      <h2 className={className}>
        {parts[0]}
        <span className="text-green-600">{coord}</span>
        {parts[1]}
      </h2>
    );
  }

  // Pattern 2: Piece names like "black kingside rook"
  match = prompt.match(
    /(the )?((?:white|black) (?:queenside|kingside) (?:rook|knight|bishop)|(?:white|black) (?:king|queen))/i
  );
  if (match) {
    const pieceName = match[2];
    const parts = prompt.split(pieceName);
    return (
      <h2 className={className}>
        {parts[0]}
        <span className="text-green-600">{pieceName}</span>
        {parts[1]}
      </h2>
    );
  }

  // Pattern 3: "What [file/rank] is this?" - highlight the type
  match = prompt.match(/What (file|rank) is this\?/);
  if (match) {
    const type = match[1];
    const parts = prompt.split(type);
    return (
      <h2 className={className}>
        {parts[0]}
        <span className="text-green-600">{type}</span>
        {parts[1]}
      </h2>
    );
  }

  // Pattern 4: "Knight on [square]" - highlight the square
  match = prompt.match(/Knight on ([a-h][1-8])/);
  if (match) {
    const square = match[1];
    const parts = prompt.split(square);
    return (
      <h2 className={className}>
        {parts[0]}
        <span className="text-green-600">{square}</span>
        {parts[1]}
      </h2>
    );
  }

  // Default: no highlighting
  return <h2 className={className}>{prompt}</h2>;
};

// Helper to get random file or rank
const getRandomFileOrRank = (): { type: "file" | "rank"; value: string } => {
  const isFile = Math.random() > 0.5;
  if (isFile) {
    return { type: "file", value: FILES[Math.floor(Math.random() * 8)] };
  } else {
    return { type: "rank", value: RANKS[Math.floor(Math.random() * 8)] };
  }
};

// Generate wrong options for multiple choice
const generateWrongOptions = (
  correct: string,
  isFile: boolean,
  count: number = 3
): string[] => {
  const options = isFile ? FILES.split("") : RANKS.split("");
  const wrong = options.filter((o) => o !== correct);
  const shuffled = wrong.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const boardVisualizationController: ModeController = {
  generateQuestion: (typeId, levelId, boardFlipped) => {
    if (typeId === "coordinateLocation") {
      // Click on board to find coordinate
      const square = getRandomSquare();
      return {
        type: "click",
        prompt: `Find ${square}`,
        correctAnswer: square,
        levelId: levelId,
      };
    }

    if (typeId === "pieceStartingPositions") {
      const piece = getRandomPieceStartingPosition();

      if (levelId === "hard") {
        // Hard: Type coordinate from memory
        return {
          type: "input",
          prompt: `What coordinate is the ${piece.pieceName}'s starting position?`,
          correctAnswer: piece.square,
          levelId: levelId,
          pieceInfo: piece,
        };
      } else {
        // Easy or Medium: Click on board
        return {
          type: "click",
          prompt: `Find the ${piece.pieceName}'s starting position`,
          correctAnswer: piece.square,
          levelId: levelId,
          pieceInfo: piece,
        };
      }
    }

    if (typeId === "fileRankRecognition") {
      const { type, value } = getRandomFileOrRank();

      if (levelId === "easy") {
        // Multiple choice - no flipping
        const wrongOptions = generateWrongOptions(value, type === "file");
        const allOptions = [value, ...wrongOptions].sort(
          () => Math.random() - 0.5
        );

        return {
          type: "choice",
          prompt: `What ${type} is this?`,
          correctAnswer: value,
          options: allOptions,
          levelId: levelId,
          fileRankType: type,
          isFlipped: false,
        };
      } else if (levelId === "medium") {
        // Medium - text input + board flips only on rank reset
        const isFlipped = boardFlipped !== undefined ? boardFlipped : false;
        return {
          type: "input",
          prompt: `What ${type} is this?`,
          correctAnswer: value,
          levelId: levelId,
          fileRankType: type,
          isFlipped: isFlipped,
        };
      } else {
        // Hard - text input + board flips every question
        const isFlipped = Math.random() > 0.5;
        return {
          type: "input",
          prompt: `What ${type} is this?`,
          correctAnswer: value,
          levelId: levelId,
          fileRankType: type,
          isFlipped: isFlipped,
        };
      }
    }

    if (typeId === "knightPath") {
      if (levelId === "easy") {
        // Easy: Show board with knight, user clicks all valid squares
        const square = getRandomKnightSquare();
        const validMoves = getKnightMoves(square);

        return {
          type: "multiselect",
          prompt: `Select all valid knight moves`,
          knightSquare: square,
          correctAnswer: validMoves.join(","), // For storage/tracking
          correctAnswers: validMoves,
          levelId: levelId,
        };
      } else if (levelId === "medium") {
        // Medium: Show board briefly, then hide it and type from memory
        const square = getRandomKnightSquare();
        const validMoves = getKnightMoves(square);

        return {
          type: "input",
          prompt: `Where can the knight move? (comma-separated)`,
          knightSquare: square,
          correctAnswer: validMoves.sort().join(","),
          correctAnswers: validMoves,
          levelId: levelId,
          showPreview: true,
        };
      } else {
        // Hard: Text only, sometimes special questions
        const isSpecialQuestion = Math.random() < 0.15; // 15% chance

        if (isSpecialQuestion) {
          // Special question about starting position
          const side = Math.random() > 0.5 ? "kingside" : "queenside";
          const color = Math.random() > 0.5 ? "black" : "white";
          const square =
            side === "kingside"
              ? color === "black"
                ? "g8"
                : "g1"
              : color === "black"
              ? "b8"
              : "b1";
          const validMoves = getKnightMoves(square);

          return {
            type: "input",
            prompt: `It's your first turn, where can the ${color} ${side} knight move? (comma-separated, e.g. a1,b2)`,
            correctAnswer: validMoves.sort().join(","),
            correctAnswers: validMoves,
            levelId: levelId,
            isSpecialQuestion: true,
            knightSquare: square,
          };
        } else {
          // Normal question
          const square = getRandomKnightSquare();
          const validMoves = getKnightMoves(square);

          return {
            type: "input",
            prompt: `Knight on ${square}. Where can it move? (comma-separated, e.g. a1,b2)`,
            correctAnswer: validMoves.sort().join(","),
            correctAnswers: validMoves,
            levelId: levelId,
            knightSquare: square,
          };
        }
      }
    }

    throw new Error(`Unknown type: ${typeId}`);
  },

  checkAnswer: (question, answer) => {
    // For multiselect or comma-separated answers
    if (question.correctAnswers && question.correctAnswers.length > 0) {
      // Normalize the answer: split by comma, trim, lowercase, sort
      const userAnswers = answer
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .sort();

      const correctAnswers = question.correctAnswers
        .map((s) => s.toLowerCase())
        .sort();

      // Check if arrays are equal
      if (userAnswers.length !== correctAnswers.length) return false;
      return userAnswers.every((val, idx) => val === correctAnswers[idx]);
    }

    // Case-insensitive comparison for text input
    return question.correctAnswer.toLowerCase() === answer.toLowerCase();
  },

  renderQuestion: (question, onAnswer) => {
    const questionData = question as any;
    const showLabels = questionData.levelId === "easy";
    const isFlipped = questionData.isFlipped || false;

    // Coordinate Location & Piece Starting Positions - Click on board
    if (question.type === "click") {
      return (
        <div className="flex flex-col items-center w-full">
          {renderHighlightedPrompt(
            question.prompt || "",
            "text-2xl mb-4 font-bold"
          )}
          <ChessBoard
            showLabels={showLabels}
            showColors={true}
            onSquareClick={onAnswer}
            flipped={isFlipped}
          />
        </div>
      );
    }

    // Piece Starting Positions - Text Input (Hard mode)
    if (
      question.type === "input" &&
      questionData.pieceInfo &&
      !questionData.fileRankType
    ) {
      return (
        <PieceStartingPositionInput question={question} onAnswer={onAnswer} />
      );
    }

    // File/Rank Recognition - Multiple Choice (Easy)
    if (question.type === "choice" && question.options) {
      const fileRankType = questionData.fileRankType;
      return (
        <div className="flex flex-col items-center w-full">
          {renderHighlightedPrompt(
            question.prompt || "",
            "text-2xl mb-4 font-bold"
          )}
          <PerspectiveIndicator isFlipped={isFlipped} />
          <ChessBoard
            showLabels={false}
            showColors={true}
            highlightFile={
              fileRankType === "file" ? question.correctAnswer : undefined
            }
            highlightRank={
              fileRankType === "rank" ? question.correctAnswer : undefined
            }
            flipped={isFlipped}
          />
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {question.options.map((option) => (
              <button
                key={option}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg active:opacity-80 min-w-[60px]"
                onClick={() => onAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // File/Rank Recognition - Text Input (Hard)
    if (question.type === "input" && questionData.fileRankType) {
      const fileRankType = questionData.fileRankType;
      return (
        <FileRankInput
          question={question}
          onAnswer={onAnswer}
          fileRankType={fileRankType}
          isFlipped={isFlipped}
        />
      );
    }

    // Knight Path - Multiselect (Easy)
    if (question.type === "multiselect") {
      return <KnightPathMultiselect question={question} onAnswer={onAnswer} />;
    }

    // Knight Path - Text Input with Preview (Medium)
    if (
      question.type === "input" &&
      questionData.knightSquare &&
      questionData.showPreview
    ) {
      return <KnightPathPreview question={question} onAnswer={onAnswer} />;
    }

    // Knight Path - Text Input (Hard)
    if (question.type === "input" && questionData.knightSquare) {
      return <KnightPathInput question={question} onAnswer={onAnswer} />;
    }

    return null;
  },
};

// Piece Starting Position Input component (Coordinate Location Hard)
const PieceStartingPositionInput: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
}> = ({ question, onAnswer }) => {
  const [input, setInput] = useState("");
  const isMaster = (question as any).levelId === "master";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnswer(input.trim().toLowerCase());
      setInput("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Auto-submit in Master level when input reaches 2 characters
    if (isMaster && value.length === 2) {
      onAnswer(value.trim().toLowerCase());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {renderHighlightedPrompt(
        question.prompt || "",
        "text-xl mb-4 font-bold text-center"
      )}

      <form onSubmit={handleSubmit} className="mt-4 w-full max-w-xs">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="e.g. e4"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg text-center font-mono"
          autoFocus
          maxLength={2}
        />
        {!isMaster && (
          <button
            type="submit"
            className="w-full mt-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg active:opacity-80"
          >
            Submit
          </button>
        )}
      </form>

      {!isMaster && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Enter the coordinate (e.g., a1, e4, h8)</p>
        </div>
      )}
    </div>
  );
};

// Text input component for hard mode
const FileRankInput: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
  fileRankType: "file" | "rank";
  isFlipped: boolean;
}> = ({ question, onAnswer, fileRankType, isFlipped }) => {
  const [input, setInput] = useState("");
  const isMaster = (question as any).levelId === "master";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnswer(input.trim().toLowerCase());
      setInput("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Auto-submit in Master level when input reaches 1 character
    if (isMaster && value.length === 1) {
      onAnswer(value.trim().toLowerCase());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {renderHighlightedPrompt(
        question.prompt || "",
        "text-2xl mb-4 font-bold"
      )}
      <PerspectiveIndicator isFlipped={isFlipped} />
      <ChessBoard
        showLabels={false}
        showColors={true}
        highlightFile={
          fileRankType === "file" ? question.correctAnswer : undefined
        }
        highlightRank={
          fileRankType === "rank" ? question.correctAnswer : undefined
        }
        flipped={isFlipped}
      />
      <form onSubmit={handleSubmit} className="mt-4 w-full max-w-xs">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder={`Type ${fileRankType} (${
            fileRankType === "file" ? "a-h" : "1-8"
          })`}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg text-center font-mono"
          autoFocus
          maxLength={1}
        />
        {!isMaster && (
          <button
            type="submit"
            className="w-full mt-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg active:opacity-80"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

// Perspective Indicator Component
const PerspectiveIndicator: React.FC<{ isFlipped: boolean }> = ({
  isFlipped,
}) => {
  return (
    <div className="flex items-center justify-center gap-0.5 mb-2 text-base font-semibold text-gray-700">
      <img
        src={isFlipped ? blackPawn : whitePawn}
        alt={isFlipped ? "Black piece" : "White piece"}
        className="w-5 h-5"
      />
      <span>{isFlipped ? "Black" : "White"} perspective</span>
    </div>
  );
};

// Knight Path Multiselect component (Easy mode)
const KnightPathMultiselect: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
}> = ({ question, onAnswer }) => {
  const [selectedSquares, setSelectedSquares] = useState<Set<string>>(
    new Set()
  );
  const knightSquare = (question as any).knightSquare;
  const correctAnswers = question.correctAnswers || [];

  const handleSquareClick = (square: string) => {
    // Don't allow clicking the knight's square
    if (square === knightSquare) return;

    const newSelected = new Set(selectedSquares);
    if (newSelected.has(square)) {
      newSelected.delete(square);
    } else {
      newSelected.add(square);
    }
    setSelectedSquares(newSelected);
  };

  const handleSubmit = () => {
    const answer = Array.from(selectedSquares).sort().join(",");
    onAnswer(answer);
    setSelectedSquares(new Set());
  };

  return (
    <div className="flex flex-col items-center w-full">
      {renderHighlightedPrompt(
        question.prompt || "",
        "text-2xl mb-4 font-bold"
      )}
      <div className="mb-3 text-sm text-gray-600">
        Knight on{" "}
        <span className="font-mono font-bold text-green-600">
          {knightSquare}
        </span>
      </div>

      {/* Board with knight indicator */}
      <div className="relative mb-4">
        <ChessBoard
          showLabels={false}
          showColors={true}
          onSquareClick={handleSquareClick}
          knightSquare={knightSquare}
          selectedSquares={Array.from(selectedSquares)}
        />
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Selected: {selectedSquares.size} / {correctAnswers.length}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedSquares.size === 0}
        className={`px-8 py-3 rounded-lg text-lg font-semibold transition ${
          selectedSquares.size === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
        }`}
      >
        Submit ({selectedSquares.size} moves)
      </button>
    </div>
  );
};

// Knight Path Preview component (Medium mode)
const KnightPathPreview: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
}> = ({ question, onAnswer }) => {
  const [showBoard, setShowBoard] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [input, setInput] = useState("");
  const knightSquare = (question as any).knightSquare;

  React.useEffect(() => {
    if (timeLeft > 0 && showBoard) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && showBoard) {
      setShowBoard(false);
    }
  }, [timeLeft, showBoard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnswer(input.trim().toLowerCase());
      setInput("");
      // Reset for next question
      setShowBoard(true);
      setTimeLeft(5);
    }
  };

  if (showBoard) {
    return (
      <div className="flex flex-col items-center w-full">
        {renderHighlightedPrompt(
          "Memorize the knight's moves",
          "text-2xl mb-4 font-bold"
        )}
        <div className="mb-3 text-lg font-semibold text-orange-600">
          Time left: {timeLeft}s
        </div>
        <div className="mb-3 text-sm text-gray-600">
          Knight on{" "}
          <span className="font-mono font-bold text-green-600">
            {knightSquare}
          </span>
        </div>
        <ChessBoard
          showLabels={false}
          showColors={true}
          highlight={knightSquare}
          knightSquare={knightSquare}
        />
        <div className="mt-4 text-sm text-gray-500 text-center">
          Study the board and remember all valid knight moves
        </div>
      </div>
    );
  }

  const isMaster = (question as any).levelId === "master";

  return (
    <div className="flex flex-col items-center w-full">
      {renderHighlightedPrompt(
        question.prompt || "",
        "text-xl mb-4 font-bold text-center"
      )}
      <div className="mb-3 text-sm text-gray-600">
        Knight was on{" "}
        <span className="font-mono font-bold text-green-600">
          {knightSquare}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 w-full max-w-sm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. c3,e3,f4 (comma-separated)"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-mono"
          autoFocus
          rows={3}
          onKeyDown={(e) => {
            // Allow Enter to submit in Master level
            if (isMaster && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
        />
        {!isMaster && (
          <button
            type="submit"
            className="w-full mt-2 bg-green-500 text-white px-6 py-3 rounded-lg text-lg active:opacity-80 hover:bg-green-600"
          >
            Submit
          </button>
        )}
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {!isMaster ? (
          <>
            <p>Enter all valid knight moves separated by commas</p>
            <p className="mt-1">Example format: a1, b2, c3</p>
          </>
        ) : (
          <p>Press Enter to submit</p>
        )}
      </div>
    </div>
  );
};

// Knight Path Text Input component (Hard mode)
const KnightPathInput: React.FC<{
  question: Question;
  onAnswer: (answer: string) => void;
}> = ({ question, onAnswer }) => {
  const [input, setInput] = useState("");
  const isMaster = (question as any).levelId === "master";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnswer(input.trim().toLowerCase());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {renderHighlightedPrompt(
        question.prompt || "",
        "text-xl mb-4 font-bold text-center"
      )}

      <form onSubmit={handleSubmit} className="mt-4 w-full max-w-sm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. c3,e3,f4 (comma-separated)"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-mono"
          autoFocus
          rows={3}
          onKeyDown={(e) => {
            // Allow Enter to submit in Master level
            if (isMaster && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
        />
        {!isMaster && (
          <button
            type="submit"
            className="w-full mt-2 bg-green-500 text-white px-6 py-3 rounded-lg text-lg active:opacity-80 hover:bg-green-600"
          >
            Submit
          </button>
        )}
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {!isMaster ? (
          <>
            <p>Enter all valid knight moves separated by commas</p>
            <p className="mt-1">Example format: a1, b2, c3</p>
          </>
        ) : (
          <p>Press Enter to submit</p>
        )}
      </div>
    </div>
  );
};
