import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllTracks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("mentalHealthTracks").collect();
  },
});

export const getTrackById = query({
  args: { trackId: v.id("mentalHealthTracks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.trackId);
  },
});

export const getChallengesForTrack = query({
  args: { trackId: v.id("mentalHealthTracks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challenges")
      .withIndex("by_track_and_day", (q) => q.eq("trackId", args.trackId))
      .collect();
  },
});

export const getTodaysChallenge = query({
  args: { 
    userId: v.id("users"),
    trackId: v.id("mentalHealthTracks") 
  },
  handler: async (ctx, args) => {
    // Get user's progress on this track
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_and_track", (q) => 
        q.eq("userId", args.userId).eq("trackId", args.trackId)
      )
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    const completedDays = progress.length;
    const nextDay = completedDays + 1;

    // Get the next challenge
    const challenge = await ctx.db
      .query("challenges")
      .withIndex("by_track_and_day", (q) => 
        q.eq("trackId", args.trackId).eq("day", nextDay)
      )
      .first();

    return challenge;
  },
});
