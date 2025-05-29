import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveMemoryGameScore = mutation({
  args: {
    trackId: v.id("mentalHealthTracks"),
    timeInSeconds: v.number(),
    turns: v.number(),
    difficulty: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Calculate XP based on performance
    let xpEarned = 50; // Base XP
    
    // Bonus for difficulty
    if (args.difficulty === "medium") xpEarned += 25;
    if (args.difficulty === "hard") xpEarned += 50;
    
    // Time bonus (faster = more XP)
    const timeBonus = Math.max(0, 100 - args.timeInSeconds);
    xpEarned += Math.floor(timeBonus / 10);
    
    // Turn bonus (fewer turns = more XP)
    const turnBonus = Math.max(0, 50 - args.turns);
    xpEarned += turnBonus;

    // Save the score
    await ctx.db.insert("memoryGameScores", {
      userId,
      trackId: args.trackId,
      timeInSeconds: args.timeInSeconds,
      turns: args.turns,
      completedAt: Date.now(),
      difficulty: args.difficulty,
    });

    // Update user's total XP
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      const newTotalXp = profile.totalXp + xpEarned;
      const newLevel = Math.floor(newTotalXp / 1000) + 1;

      await ctx.db.patch(profile._id, {
        totalXp: newTotalXp,
        level: newLevel,
      });
    }

    return { xpEarned };
  },
});

export const getMemoryGameScores = query({
  args: { trackId: v.id("mentalHealthTracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const scores = await ctx.db
      .query("memoryGameScores")
      .withIndex("by_user_and_track", (q) => 
        q.eq("userId", userId).eq("trackId", args.trackId)
      )
      .order("desc")
      .take(10);

    return scores;
  },
});

export const getMemoryGameLeaderboard = query({
  args: { trackId: v.id("mentalHealthTracks"), difficulty: v.string() },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query("memoryGameScores")
      .withIndex("by_track_and_time")
      .filter((q) => 
        q.and(
          q.eq(q.field("trackId"), args.trackId),
          q.eq(q.field("difficulty"), args.difficulty)
        )
      )
      .order("asc") // Best time first
      .take(10);

    // Get user profiles for the scores
    const scoresWithProfiles = await Promise.all(
      scores.map(async (score) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", score.userId))
          .first();
        return {
          ...score,
          username: profile?.username || "Anonymous",
        };
      })
    );

    return scoresWithProfiles;
  },
});

export const getMemoryGameAffirmations = query({
  args: { trackId: v.id("mentalHealthTracks") },
  handler: async (ctx, args) => {
    // Get the memory game challenge for this track
    const challenge = await ctx.db
      .query("challenges")
      .withIndex("by_track_and_day", (q) => 
        q.eq("trackId", args.trackId).eq("day", 0)
      )
      .filter((q) => q.eq(q.field("type"), "memory"))
      .first();

    if (!challenge) {
      // Return default affirmations if no specific ones exist
      return {
        affirmations: [
          "I am worthy of love and respect",
          "I choose to focus on what I can control",
          "Every day I am getting stronger",
          "I deserve happiness and peace",
          "I am capable of overcoming challenges",
          "My feelings are valid and temporary",
          "I am making progress, even if it's small",
          "I have the strength to face today"
        ],
        difficulties: {
          easy: { pairs: 6, timeBonus: 120 },
          medium: { pairs: 8, timeBonus: 180 },
          hard: { pairs: 12, timeBonus: 240 }
        }
      };
    }

    return challenge.content;
  },
});
