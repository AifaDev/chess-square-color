import { GameConfig } from "../types/game";

export const gameConfig: GameConfig = {
  modes: [
    {
      id: "boardVisualization",
      name: "Board Visualization",
      description:
        "Train spatial awareness and mental mapping of the chessboard",
      stage: 1,
      types: [
        {
          id: "fileRankRecognition",
          name: "File/Rank Recognition",
          description: "Identify files and ranks by their position",
          difficulty: "beginner",
          difficultyOrder: 1,
          levels: [
            {
              id: "easy",
              name: "Easy",
              description: "Multiple choice",
            },
            {
              id: "hard",
              name: "Hard",
              description: "Type answer + board flips",
            },
            {
              id: "master",
              name: "Master",
              description: "1 minute to complete the challenge",
            },
          ],
        },
        {
          id: "coordinateLocation",
          name: "Coordinate Location",
          description: "Find any coordinate on the board",
          difficulty: "beginner",
          difficultyOrder: 2,
          levels: [
            {
              id: "easy",
              name: "Easy",
              description: "Board with labels",
            },
            {
              id: "hard",
              name: "Hard",
              description: "Board without labels",
            },
            {
              id: "master",
              name: "Master",
              description: "1 minute to complete the challenge",
            },
          ],
        },
        {
          id: "pieceStartingPositions",
          name: "Piece Starting Positions",
          description: "Recall where pieces start the game",
          difficulty: "intermediate",
          difficultyOrder: 3,
          levels: [
            {
              id: "easy",
              name: "Easy",
              description: "Click on board with labels",
            },
            {
              id: "medium",
              name: "Medium",
              description: "Click on board without labels",
            },
            {
              id: "hard",
              name: "Hard",
              description: "Type coordinate from memory",
            },
            {
              id: "master",
              name: "Master",
              description: "1 minute to complete the challenge",
            },
          ],
        },
        {
          id: "knightPath",
          name: "Knight Path Visualization",
          description: "Visualize all valid knight moves",
          difficulty: "advanced",
          difficultyOrder: 4,
          levels: [
            {
              id: "easy",
              name: "Easy",
              description: "Click valid squares on board",
            },
            {
              id: "medium",
              name: "Medium",
              description: "Board preview then type from memory",
            },
            {
              id: "hard",
              name: "Hard",
              description: "Type coordinates without board",
            },
            {
              id: "master",
              name: "Master",
              description: "1 minute to complete the challenge",
            },
          ],
        },
      ],
    },
    {
      id: "chessColors",
      name: "Chess Colors",
      description: "Build instant recognition of dark and light squares",
      stage: 2,
      types: [
        {
          id: "pieceStartingColor",
          name: "Piece Starting Color",
          description: "Know the color of pieces' starting squares",
          difficulty: "beginner",
          difficultyOrder: 1,
          levels: [
            {
              id: "easy",
              name: "Easy",
              description: "Board with labels",
            },
            {
              id: "medium",
              name: "Medium",
              description: "Board without labels",
            },
            {
              id: "hard",
              name: "Hard",
              description: "Text only, no board",
            },
            {
              id: "master",
              name: "Master",
              description: "1 minute to complete the challenge",
            },
          ],
        },
        {
          id: "randomSquareColor",
          name: "Random Square Color",
          description: "Identify the color of any square",
          difficulty: "intermediate",
          difficultyOrder: 2,
          levels: [
            {
              id: "easy",
              name: "Easy",
              description: "Board with labels",
            },
            {
              id: "medium",
              name: "Medium",
              description: "Board without labels",
            },
            {
              id: "hard",
              name: "Hard",
              description: "Text only, no board",
            },
            {
              id: "master",
              name: "Master",
              description: "1 minute to complete the challenge",
            },
          ],
        },
      ],
    },
    {
      id: "pieceMemory",
      name: "Piece Memory",
      description: "Train memory for piece positions and control patterns",
      stage: 3,
      types: [
        {
          id: "placementRecall",
          name: "Piece Placement Recall",
          description: "Memorize and recall piece positions",
          levels: [
            {
              id: "default",
              name: "Default",
            },
          ],
          comingSoon: true,
        },
      ],
      comingSoon: true,
    },
    {
      id: "spatialReasoning",
      name: "Spatial Reasoning",
      description: "Train understanding of spatial relationships",
      stage: 4,
      types: [
        {
          id: "directionDistance",
          name: "Direction and Distance",
          description: "Understand spatial relations between squares",
          levels: [
            {
              id: "default",
              name: "Default",
            },
          ],
          comingSoon: true,
        },
      ],
      comingSoon: true,
    },
  ],
};
