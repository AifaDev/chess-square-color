import React from "react";

interface StreakHUDProps {
  streak: number;
  highScore: number;
}

const StreakHUD: React.FC<StreakHUDProps> = ({
  streak,
  highScore,
}) => {
  return (
    <div className="w-full flex justify-around text-center mt-4">
      <div>
        <p className="text-sm text-gray-600">Streak</p>
        <p className="text-2xl font-bold">{streak}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">High Score</p>
        <p className="text-2xl font-bold">{highScore}</p>
      </div>
    </div>
  );
};

export default StreakHUD;
