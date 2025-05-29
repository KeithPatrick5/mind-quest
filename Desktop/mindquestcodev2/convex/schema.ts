import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // User profiles with mental health app specific data
  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    totalXp: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    level: v.number(),
    lastActivityDate: v.optional(v.string()), // YYYY-MM-DD format
    selectedTracks: v.array(v.id("mentalHealthTracks")),
    joinedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_total_xp", ["totalXp"]),

  // Mental health disorder tracks
  mentalHealthTracks: defineTable({
    name: v.string(),
    category: v.string(), // "mood", "anxiety", "trauma", "neurodevelopmental", "personality", "eating", "psychotic", "substance"
    description: v.string(),
    color: v.string(), // hex color for UI
    totalChallenges: v.number(),
    estimatedDays: v.number(),
  }),

  // Daily challenges for each track
  challenges: defineTable({
    trackId: v.id("mentalHealthTracks"),
    day: v.number(), // 1-based day number in the track
    title: v.string(),
    type: v.string(), // "quiz", "reframe", "breathing", "minigame"
    content: v.any(), // Challenge-specific data
    xpReward: v.number(),
  }).index("by_track_and_day", ["trackId", "day"]),

  // User progress on challenges
  progress: defineTable({
    userId: v.id("users"),
    trackId: v.id("mentalHealthTracks"),
    challengeId: v.id("challenges"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    score: v.optional(v.number()), // For quizzes
    xpEarned: v.number(),
  }).index("by_user_and_track", ["userId", "trackId"])
    .index("by_user_and_challenge", ["userId", "challengeId"]),

  // Daily activity tracking
  dailyActivity: defineTable({
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD format
    challengesCompleted: v.number(),
    xpEarned: v.number(),
    streakDay: v.number(),
  }).index("by_user_and_date", ["userId", "date"]),

  // Memory game high scores
  memoryGameScores: defineTable({
    userId: v.id("users"),
    trackId: v.id("mentalHealthTracks"),
    timeInSeconds: v.number(),
    turns: v.number(),
    completedAt: v.number(),
    difficulty: v.string(), // "easy", "medium", "hard"
  }).index("by_user_and_track", ["userId", "trackId"])
    .index("by_track_and_time", ["trackId", "timeInSeconds"]),

  // Response trainer progress
  responseTrainerProgress: defineTable({
    userId: v.id("users"),
    trackId: v.id("mentalHealthTracks"),
    scenarioId: v.string(), // Unique identifier for each scenario
    selectedResponse: v.number(), // Index of chosen response
    isCorrect: v.boolean(),
    completedAt: v.number(),
    attempts: v.number(), // Number of attempts for this scenario
  }).index("by_user_and_track", ["userId", "trackId"])
    .index("by_user_and_scenario", ["userId", "scenarioId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
