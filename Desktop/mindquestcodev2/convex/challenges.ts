import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const completeChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
    score: v.optional(v.number()),
    answers: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) throw new Error("Challenge not found");

    // Check if already completed
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_and_challenge", (q) => 
        q.eq("userId", userId).eq("challengeId", args.challengeId)
      )
      .first();

    if (existing?.completed) {
      throw new Error("Challenge already completed");
    }

    const xpEarned = challenge.xpReward;
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    // Record progress
    if (existing) {
      await ctx.db.patch(existing._id, {
        completed: true,
        completedAt: now,
        score: args.score,
        xpEarned,
      });
    } else {
      await ctx.db.insert("progress", {
        userId,
        trackId: challenge.trackId,
        challengeId: args.challengeId,
        completed: true,
        completedAt: now,
        score: args.score,
        xpEarned,
      });
    }

    // Update profile XP and level
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      const newTotalXp = profile.totalXp + xpEarned;
      const newLevel = Math.floor(newTotalXp / 1000) + 1; // 1000 XP per level

      // Update streak
      let newStreak = profile.currentStreak;
      let newLongestStreak = profile.longestStreak;

      if (profile.lastActivityDate === today) {
        // Already completed something today, don't increment streak
      } else if (profile.lastActivityDate === getPreviousDay(today)) {
        // Consecutive day, increment streak
        newStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newStreak);
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }

      await ctx.db.patch(profile._id, {
        totalXp: newTotalXp,
        level: newLevel,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      });

      // Update daily activity
      const dailyActivity = await ctx.db
        .query("dailyActivity")
        .withIndex("by_user_and_date", (q) => 
          q.eq("userId", userId).eq("date", today)
        )
        .first();

      if (dailyActivity) {
        await ctx.db.patch(dailyActivity._id, {
          challengesCompleted: dailyActivity.challengesCompleted + 1,
          xpEarned: dailyActivity.xpEarned + xpEarned,
        });
      } else {
        await ctx.db.insert("dailyActivity", {
          userId,
          date: today,
          challengesCompleted: 1,
          xpEarned,
          streakDay: newStreak,
        });
      }
    }

    return { xpEarned, newLevel: Math.floor((profile?.totalXp || 0) + xpEarned) / 1000 + 1 };
  },
});

export const getUserProgress = query({
  args: { trackId: v.id("mentalHealthTracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_and_track", (q) => 
        q.eq("userId", userId).eq("trackId", args.trackId)
      )
      .collect();

    return progress;
  },
});

function getPreviousDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}
