// Core type definitions for the game system

export type ModeId =
  | "chessColors"
  | "boardVisualization"
  | "pieceMemory"
  | "spatialReasoning"
  | string;
export type TypeId = string;
export type LevelId = string;
export type PageType = "home" | "practice" | "stats" | "achievements";

export interface GameLevel {
  id: LevelId;
  name: string;
  description?: string;
}

export interface GameType {
  id: TypeId;
  name: string;
  description?: string;
  levels: GameLevel[];
  comingSoon?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
  difficultyOrder?: number;
}

export interface GameMode {
  id: ModeId;
  name: string;
  description: string;
  stage: number;
  types: GameType[];
  comingSoon?: boolean;
}

export interface GameConfig {
  modes: GameMode[];
}

export interface GameState {
  modeId: ModeId;
  typeId: TypeId;
  levelId: LevelId;
}

export interface Question {
  type: "choice" | "click" | "input" | "multiselect";
  prompt?: string;
  highlight?: string;
  correctAnswer: string;
  correctAnswers?: string[]; // For multiselect questions
  options?: string[];
  knightSquare?: string; // For knight path questions
  isSpecialQuestion?: boolean; // For hard mode special questions
  showPreview?: boolean; // For medium mode with preview
}

export interface ModeController {
  generateQuestion: (typeId: TypeId, levelId: LevelId) => Question;
  checkAnswer: (question: Question, answer: string) => boolean;
  renderQuestion: (
    question: Question,
    onAnswer: (answer: string) => void
  ) => React.ReactNode;
}

// Session tracking for stats
export interface SessionEvent {
  id: string;
  modeId: ModeId;
  typeId: TypeId;
  levelId: LevelId;
  timestamp: number;
  correct: boolean;
  question: string;
  answer: string;
}

export interface SessionStats {
  highScore: number;
  accuracy: number;
  sessionsCount: number;
  totalTime?: number;
  recentSessions: SessionSummary[];
  missedSquares: Record<string, number>;
}

export interface SessionSummary {
  date: number;
  modeId: ModeId;
  typeId: TypeId;
  levelId: LevelId;
  accuracy: number;
  bestStreak: number;
  totalQuestions: number;
}
