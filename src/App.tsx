import React, { useState, useEffect } from "react";

const getRandomSquare = () => {
  const letters = "abcdefgh";
  const numbers = "12345678";
  return (
    letters[Math.floor(Math.random() * 8)] +
    numbers[Math.floor(Math.random() * 8)]
  );
};

const isSquareGreen = (square: string) => {
  const letters = "abcdefgh";
  const numbers = "12345678";
  const letterIdx = letters.indexOf(square[0]);
  const numberIdx = numbers.indexOf(square[1]);
  return letterIdx % 2 === numberIdx % 2 ? "green" : "white";
};

interface ChessBoardProps {
  highlight: string;
  hidden?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ highlight, hidden }) => {
  const squares = Array(64)
    .fill(0)
    .map((_, idx) => {
      const letter = String.fromCharCode(97 + (7 - (idx % 8)));
      const number = 8 - Math.floor(idx / 8);
      const square = `${letter}${number}`;
      const isHighlighted = square === highlight;
      const borderColor =
        isHighlighted && !hidden ? "border-blue-500" : "border-gray-400";
      return <div key={square} className={`w-8 h-8 border-2 ${borderColor}`} />;
    });

  return (
    <div className="grid grid-cols-8 mb-8 gap-0.5 aspect-square ">
      {squares}
    </div>
  );
};

const App: React.FC = () => {
  const [currentSquare, setCurrentSquare] = useState(getRandomSquare());
  const [streak, setStreak] = useState(() => {
    const storedStreak = localStorage.getItem("streak");
    return storedStreak ? parseInt(storedStreak, 10) : 0;
  });
  const [mode, setMode] = useState("question");

  useEffect(() => {
    localStorage.setItem("streak", streak.toString());
  }, [streak]);

  const checkAnswer = (answer: string) => {
    if (answer === isSquareGreen(currentSquare)) {
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    setCurrentSquare(getRandomSquare());
  };

  const switchMode = () => {
    setMode(mode === "question" ? "board" : "question");
    setCurrentSquare(getRandomSquare());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-5/6 bg-white p-8 rounded shadow flex flex-col items-center max-w-[400px]">
        <h1 className="text-3xl mb-6">Chess Square Color Quiz</h1>
        {mode === "board" && <ChessBoard highlight={currentSquare} />}
        {mode === "question" && (
          <h2 className="text-xl mb-4">What color is {currentSquare}?</h2>
        )}
        <div className="mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 mr-4 rounded"
            onClick={() => checkAnswer("green")}
          >
            Green
          </button>
          <button
            className="bg-white text-black px-4 py-2 border-2 border-gray-500 rounded"
            onClick={() => checkAnswer("white")}
          >
            White
          </button>
        </div>
        <div className="mb-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={switchMode}
          >
            Switch Mode
          </button>
        </div>
        <p className="text-xl mt-4">Streak: {streak}</p>
      </div>
    </div>
  );
};

export default App;
