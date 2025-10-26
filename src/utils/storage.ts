// LocalStorage utilities for tracking streaks and high scores

import { ModeId, TypeId, LevelId } from "../types/game";

const getKey = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId,
  type: "streak" | "highscore"
): string => {
  return `${type}:${modeId}:${typeId}:${levelId}`;
};

export const getStreak = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId
): number => {
  const key = getKey(modeId, typeId, levelId, "streak");
  const value = localStorage.getItem(key);
  return value ? parseInt(value, 10) : 0;
};

export const setStreak = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId,
  streak: number
): void => {
  const key = getKey(modeId, typeId, levelId, "streak");
  localStorage.setItem(key, streak.toString());
};

export const getHighScore = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId
): number => {
  const key = getKey(modeId, typeId, levelId, "highscore");
  const value = localStorage.getItem(key);
  return value ? parseInt(value, 10) : 0;
};

export const setHighScore = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId,
  score: number
): void => {
  const key = getKey(modeId, typeId, levelId, "highscore");
  const currentHighScore = getHighScore(modeId, typeId, levelId);
  if (score > currentHighScore) {
    localStorage.setItem(key, score.toString());
  }
};

export const resetStreak = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId
): void => {
  setStreak(modeId, typeId, levelId, 0);
};

// Session event tracking
export const addSessionEvent = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId,
  correct: boolean,
  question: string,
  answer: string
): void => {
  const events = getSessionEvents();
  const newEvent = {
    id: `${Date.now()}-${Math.random()}`,
    modeId,
    typeId,
    levelId,
    timestamp: Date.now(),
    correct,
    question,
    answer,
  };
  events.push(newEvent);
  localStorage.setItem("cv:events", JSON.stringify(events));
};

export const getSessionEvents = (): any[] => {
  const data = localStorage.getItem("cv:events");
  return data ? JSON.parse(data) : [];
};

export const clearAllData = (): void => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (
      key.startsWith("streak:") ||
      key.startsWith("highscore:") ||
      key === "cv:events" ||
      key.startsWith("mastery:")
    ) {
      localStorage.removeItem(key);
    }
  });
};

// Mastery tracking (once 100% last 100 games achieved, stays mastered)
export const getMastery = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId
): boolean => {
  const key = `mastery:${modeId}:${typeId}:${levelId}`;
  return localStorage.getItem(key) === "true";
};

export const setMastery = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId
): void => {
  const key = `mastery:${modeId}:${typeId}:${levelId}`;
  localStorage.setItem(key, "true");
};

// Check if high score is 100 or more (achieved mastery), or 50 for master level
export const checkAndSetMastery = (
  modeId: ModeId,
  typeId: TypeId,
  levelId: LevelId
): boolean => {
  // If already mastered, return true
  if (getMastery(modeId, typeId, levelId)) {
    return true;
  }

  // Master level requires 50, regular levels require 100
  const requiredScore = levelId === "master" ? 50 : 100;
  const highScore = getHighScore(modeId, typeId, levelId);
  if (highScore >= requiredScore) {
    setMastery(modeId, typeId, levelId);
    return true;
  }

  return false;
};
