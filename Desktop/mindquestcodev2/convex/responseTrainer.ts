import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitResponse = mutation({
  args: {
    trackId: v.id("mentalHealthTracks"),
    scenarioId: v.string(),
    selectedResponse: v.number(),
    isCorrect: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user has already completed this scenario
    const existing = await ctx.db
      .query("responseTrainerProgress")
      .withIndex("by_user_and_scenario", (q) => 
        q.eq("userId", userId).eq("scenarioId", args.scenarioId)
      )
      .first();

    let xpEarned = 0;
    
    if (existing) {
      // Update existing record
      const newAttempts = existing.attempts + 1;
      await ctx.db.patch(existing._id, {
        selectedResponse: args.selectedResponse,
        isCorrect: args.isCorrect,
        completedAt: Date.now(),
        attempts: newAttempts,
      });
      
      // Only award XP if this is the first correct answer
      if (args.isCorrect && !existing.isCorrect) {
        xpEarned = Math.max(10, 30 - (newAttempts - 1) * 5); // Decreasing XP for multiple attempts
      }
    } else {
      // Create new record
      await ctx.db.insert("responseTrainerProgress", {
        userId,
        trackId: args.trackId,
        scenarioId: args.scenarioId,
        selectedResponse: args.selectedResponse,
        isCorrect: args.isCorrect,
        completedAt: Date.now(),
        attempts: 1,
      });
      
      if (args.isCorrect) {
        xpEarned = 30; // Full XP for first correct attempt
      }
    }

    // Update user's total XP if they earned any
    if (xpEarned > 0) {
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
    }

    return { xpEarned };
  },
});

export const getResponseTrainerProgress = query({
  args: { trackId: v.id("mentalHealthTracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const progress = await ctx.db
      .query("responseTrainerProgress")
      .withIndex("by_user_and_track", (q) => 
        q.eq("userId", userId).eq("trackId", args.trackId)
      )
      .collect();

    return progress;
  },
});

export const getResponseTrainerStats = query({
  args: { trackId: v.id("mentalHealthTracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const progress = await ctx.db
      .query("responseTrainerProgress")
      .withIndex("by_user_and_track", (q) => 
        q.eq("userId", userId).eq("trackId", args.trackId)
      )
      .collect();

    const totalScenarios = progress.length;
    const correctResponses = progress.filter(p => p.isCorrect).length;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const averageAttempts = totalScenarios > 0 ? totalAttempts / totalScenarios : 0;

    return {
      totalScenarios,
      correctResponses,
      accuracy: totalScenarios > 0 ? (correctResponses / totalScenarios) * 100 : 0,
      averageAttempts: Math.round(averageAttempts * 10) / 10,
    };
  },
});
