import React, { useState, useEffect } from "react";

const getRandomSquare = () => {
  const letters = "abcdefgh";
  const numbers = "12345678";
  return (
    letters[Math.floor(Math.random() * 8)] +
    numbers[Math.floor(Math.random() * 8)]
  );
};

const isSquareblack = (square: string) => {
  const letters = "abcdefgh";
  const numbers = "12345678";
  const letterIdx = letters.indexOf(square[0]);
  const numberIdx = numbers.indexOf(square[1]);
  return letterIdx % 2 === numberIdx % 2 ? "white" : "black";
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
    <div className="grid grid-cols-8 mb-8 gap-1 aspect-square ">{squares}</div>
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
    if (answer === isSquareblack(currentSquare)) {
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
      <div className="fixed bottom-4 right-4 flex gap-4">
        <a
          href="https://twitter.com/AifaMain"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-current text-blue-400 hover:text-blue-500"
          >
            <path d="M23.998 4.571c-.882.389-1.825.654-2.812.772 1.008-.611 1.78-1.574 2.145-2.723-.942.555-1.985.96-3.099 1.185-.89-.948-2.158-1.541-3.564-1.541-2.698 0-4.882 2.183-4.882 4.882 0 .383.044.755.129 1.111-4.057-.204-7.666-2.15-10.081-5.108-.422.723-.663 1.563-.663 2.465 0 1.7.866 3.198 2.182 4.076-.805-.025-1.561-.247-2.224-.617v.062c0 2.377 1.688 4.356 3.938 4.815-.412.111-.846.171-1.292.171-.315 0-.62-.03-.921-.085.622 1.924 2.428 3.324 4.581 3.36-1.674 1.309-3.786 2.084-6.055 2.084-.393 0-.782-.023-1.171-.068 2.155 1.385 4.708 2.194 7.469 2.194 8.962 0 13.868-7.425 13.868-13.868 0-.2-.005-.399-.014-.597.95-.689 1.775-1.551 2.427-2.53l-.047-.02z" />
          </svg>
        </a>
        <a
          href="https://github.com/AifaDev/chess-square-color"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-current text-gray-600 hover:text-gray-700"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.817-.258.817-.576 0-.284-.011-1.04-.017-2.04-3.338.723-4.042-1.609-4.042-1.609-.546-1.387-1.332-1.756-1.332-1.756-1.088-.745.083-.729.083-.729 1.204.084 1.838 1.236 1.838 1.236 1.07 1.836 2.808 1.304 3.495.997.108-.776.418-1.305.761-1.605-2.665-.301-5.466-1.332-5.466-5.931 0-1.31.468-2.383 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.007-.322 3.3 1.23.958-.267 1.98-.4 3-.405 1.02.005 2.042.138 3 .405 2.292-1.552 3.297-1.23 3.297-1.23.656 1.652.245 2.873.12 3.176.765.838 1.236 1.911 1.236 3.221 0 4.609-2.805 5.625-5.475 5.92.429.372.817 1.102.817 2.222 0 1.604-.015 2.895-.015 3.289 0 .319.213.693.825.575C20.565 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12"
            />
          </svg>
        </a>
      </div>

      <div className="w-6/7 bg-white p-8 rounded shadow flex flex-col items-center max-w-[400px]">
        <h1 className="text-3xl mb-6">Chess Colors</h1>
        {mode === "board" && <ChessBoard highlight={currentSquare} />}
        {mode === "question" && (
          <h2 className="text-xl mb-4">What color is {currentSquare}?</h2>
        )}
        <div className="mb-4">
          <button
            className="bg-black text-white px-[calc(1rem+2px)] py-[calc(0.5rem+2px)] mr-4 rounded"
            onClick={() => checkAnswer("black")}
          >
            Black
          </button>
          <button
            className="bg-white text-black px-4 py-2 border-2  border-black rounded"
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
