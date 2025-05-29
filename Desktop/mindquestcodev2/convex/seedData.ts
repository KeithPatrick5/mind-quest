import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { addMemoryGamesToTracks } from "./memoryGameData";
import { addResponseTrainerToTracks } from "./responseTrainerData";

export const seedMentalHealthData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingTracks = await ctx.db.query("mentalHealthTracks").first();
    if (existingTracks) {
      return "Data already seeded";
    }

    // Create mental health tracks
    const tracks = [
      // Mood Disorders
      { name: "Major Depression", category: "mood", description: "Learn about depression symptoms, coping strategies, and treatment options", color: "#4F46E5", totalChallenges: 30, estimatedDays: 30 },
      { name: "Bipolar I Disorder", category: "mood", description: "Understanding manic and depressive episodes", color: "#7C3AED", totalChallenges: 25, estimatedDays: 25 },
      { name: "Bipolar II Disorder", category: "mood", description: "Managing hypomanic and depressive episodes", color: "#8B5CF6", totalChallenges: 25, estimatedDays: 25 },
      { name: "Dysthymia", category: "mood", description: "Persistent depressive disorder management", color: "#6366F1", totalChallenges: 20, estimatedDays: 20 },
      { name: "Cyclothymia", category: "mood", description: "Understanding cyclothymic mood patterns", color: "#818CF8", totalChallenges: 18, estimatedDays: 18 },

      // Anxiety Disorders
      { name: "Generalized Anxiety", category: "anxiety", description: "Managing excessive worry and anxiety", color: "#EF4444", totalChallenges: 28, estimatedDays: 28 },
      { name: "Panic Disorder", category: "anxiety", description: "Understanding and managing panic attacks", color: "#F87171", totalChallenges: 22, estimatedDays: 22 },
      { name: "Social Anxiety", category: "anxiety", description: "Overcoming social fears and building confidence", color: "#FCA5A5", totalChallenges: 26, estimatedDays: 26 },
      { name: "Specific Phobia", category: "anxiety", description: "Confronting and managing specific fears", color: "#DC2626", totalChallenges: 20, estimatedDays: 20 },
      { name: "Agoraphobia", category: "anxiety", description: "Managing fear of open or crowded spaces", color: "#B91C1C", totalChallenges: 24, estimatedDays: 24 },
      { name: "Separation Anxiety", category: "anxiety", description: "Coping with separation fears", color: "#FEE2E2", totalChallenges: 18, estimatedDays: 18 },

      // Trauma and Stress
      { name: "PTSD", category: "trauma", description: "Post-traumatic stress disorder recovery", color: "#059669", totalChallenges: 35, estimatedDays: 35 },
      { name: "Acute Stress Disorder", category: "trauma", description: "Managing acute stress responses", color: "#10B981", totalChallenges: 15, estimatedDays: 15 },
      { name: "OCD", category: "anxiety", description: "Obsessive-compulsive disorder management", color: "#F59E0B", totalChallenges: 30, estimatedDays: 30 },

      // Neurodevelopmental
      { name: "ADHD", category: "neurodevelopmental", description: "Attention deficit hyperactivity disorder strategies", color: "#3B82F6", totalChallenges: 28, estimatedDays: 28 },
      { name: "Autism Spectrum Disorder", category: "neurodevelopmental", description: "Understanding and thriving with autism", color: "#1D4ED8", totalChallenges: 32, estimatedDays: 32 },
      { name: "Tourette's Syndrome", category: "neurodevelopmental", description: "Managing tics and related challenges", color: "#2563EB", totalChallenges: 20, estimatedDays: 20 },
      { name: "Learning Disorders", category: "neurodevelopmental", description: "Strategies for learning differences", color: "#60A5FA", totalChallenges: 25, estimatedDays: 25 },

      // Personality Disorders
      { name: "Borderline Personality Disorder", category: "personality", description: "DBT skills and emotional regulation", color: "#EC4899", totalChallenges: 40, estimatedDays: 40 },
      { name: "Narcissistic Personality Disorder", category: "personality", description: "Understanding narcissistic patterns", color: "#F472B6", totalChallenges: 30, estimatedDays: 30 },
      { name: "Antisocial Personality Disorder", category: "personality", description: "Social responsibility and empathy", color: "#BE185D", totalChallenges: 35, estimatedDays: 35 },
      { name: "Avoidant Personality Disorder", category: "personality", description: "Building social confidence", color: "#F9A8D4", totalChallenges: 28, estimatedDays: 28 },
      { name: "Schizoid Personality Disorder", category: "personality", description: "Social connection strategies", color: "#FBCFE8", totalChallenges: 25, estimatedDays: 25 },

      // Eating Disorders
      { name: "Anorexia Nervosa", category: "eating", description: "Recovery from restrictive eating", color: "#84CC16", totalChallenges: 45, estimatedDays: 45 },
      { name: "Bulimia Nervosa", category: "eating", description: "Breaking binge-purge cycles", color: "#A3E635", totalChallenges: 40, estimatedDays: 40 },
      { name: "Binge Eating Disorder", category: "eating", description: "Managing compulsive eating", color: "#BEF264", totalChallenges: 35, estimatedDays: 35 },
      { name: "Body Dysmorphia", category: "eating", description: "Improving body image and self-perception", color: "#65A30D", totalChallenges: 30, estimatedDays: 30 },

      // Other Disorders
      { name: "Schizophrenia", category: "psychotic", description: "Managing symptoms and daily functioning", color: "#6B7280", totalChallenges: 50, estimatedDays: 50 },
      { name: "Substance Use Disorder", category: "substance", description: "Recovery and relapse prevention", color: "#9CA3AF", totalChallenges: 60, estimatedDays: 60 },
      { name: "Insomnia", category: "sleep", description: "Sleep hygiene and insomnia management", color: "#374151", totalChallenges: 21, estimatedDays: 21 },
    ];

    const trackIds: Record<string, any> = {};
    
    for (const track of tracks) {
      const id = await ctx.db.insert("mentalHealthTracks", track);
      trackIds[track.name] = id;
    }

    // Create detailed challenges for Depression track
    const depressionChallenges = [
      {
        day: 1,
        title: "Understanding Depression",
        type: "quiz",
        content: {
          question: "Which of the following is a core symptom of major depression?",
          options: [
            "Persistent sadness or empty mood",
            "Occasional mood swings",
            "High energy levels",
            "Increased appetite"
          ],
          correctAnswer: 0,
          explanation: "Persistent sadness or empty mood lasting most of the day, nearly every day, is one of the core symptoms of major depression."
        },
        xpReward: 50
      },
      {
        day: 2,
        title: "Identifying Negative Thoughts",
        type: "reframe",
        content: {
          scenario: "You made a mistake at work and think: 'I'm completely useless and will never succeed at anything.'",
          prompt: "Reframe this thought in a more balanced way:",
          sampleReframe: "I made a mistake, which is normal and human. This doesn't define my entire worth or ability. I can learn from this and do better next time."
        },
        xpReward: 75
      },
      {
        day: 3,
        title: "Deep Breathing Exercise",
        type: "breathing",
        content: {
          technique: "4-7-8 Breathing",
          instructions: [
            "Inhale through your nose for 4 counts",
            "Hold your breath for 7 counts",
            "Exhale through your mouth for 8 counts",
            "Repeat 4 times"
          ],
          duration: 120
        },
        xpReward: 60
      },
      {
        day: 4,
        title: "Depression Myths vs Facts",
        type: "quiz",
        content: {
          question: "True or False: Depression is just feeling sad and you can 'snap out of it' if you try hard enough.",
          options: ["True", "False"],
          correctAnswer: 1,
          explanation: "False. Depression is a serious medical condition that affects brain chemistry and cannot be overcome by willpower alone. It requires proper treatment and support."
        },
        xpReward: 50
      },
      {
        day: 5,
        title: "Gratitude Practice",
        type: "reframe",
        content: {
          scenario: "Today feels overwhelming and nothing seems to be going right.",
          prompt: "List three small things you can be grateful for today, no matter how minor:",
          sampleReframe: "1. I have a warm place to sleep tonight. 2. I had access to clean water today. 3. Someone smiled at me or I saw something beautiful in nature."
        },
        xpReward: 75
      }
    ];

    for (const challenge of depressionChallenges) {
      await ctx.db.insert("challenges", {
        trackId: trackIds["Major Depression"],
        ...challenge
      });
    }

    // Add memory games for key tracks
    await addMemoryGamesToTracks(ctx, trackIds);

    // Add response trainer for key tracks
    await addResponseTrainerToTracks(ctx, trackIds);

    return "Mental health data seeded successfully";
  },
});
