export const memoryGameAffirmations = {
  "Major Depression": [
    "I am worthy of love and respect",
    "I choose to focus on what I can control", 
    "Every day I am getting stronger",
    "I deserve happiness and peace",
    "I am capable of overcoming challenges",
    "My feelings are valid and temporary",
    "I am making progress, even if it's small",
    "I have the strength to face today",
    "I am enough, just as I am",
    "I choose hope over fear",
    "I am resilient and adaptable",
    "I deserve to take care of myself"
  ],
  "Generalized Anxiety": [
    "I am safe in this moment",
    "I can handle whatever comes my way",
    "My anxiety does not define me",
    "I choose calm over chaos",
    "I trust in my ability to cope",
    "This feeling will pass",
    "I am stronger than my worries",
    "I breathe in peace, I breathe out tension",
    "I focus on what I can control",
    "I am learning to let go",
    "I deserve peace and tranquility",
    "I am capable of finding solutions"
  ],
  "ADHD": [
    "My brain works differently and that's okay",
    "I celebrate my unique strengths",
    "I am creative and innovative",
    "I can focus when it matters",
    "My energy is a gift",
    "I am learning to work with my brain",
    "I deserve patience and understanding",
    "I am more than my challenges",
    "I can find systems that work for me",
    "My differences make me special",
    "I am capable of great things",
    "I embrace my authentic self"
  ],
  "PTSD": [
    "I am safe now",
    "I am healing at my own pace",
    "I am stronger than my trauma",
    "I deserve peace and healing",
    "I can create new, positive memories",
    "I am in control of my present",
    "I am worthy of support and love",
    "I choose to focus on my recovery",
    "I am brave for surviving",
    "I trust in my resilience",
    "I am creating a better future",
    "I honor my journey to healing"
  ]
};

export async function addMemoryGamesToTracks(ctx: any, trackIds: Record<string, any>) {
  for (const [trackName, affirmations] of Object.entries(memoryGameAffirmations)) {
    if (trackIds[trackName]) {
      await ctx.db.insert("challenges", {
        trackId: trackIds[trackName],
        day: 0, // Special challenge available anytime
        title: "Positive Affirmations Memory Game",
        type: "memory",
        content: {
          affirmations,
          difficulties: {
            easy: { pairs: 6, timeBonus: 120 },
            medium: { pairs: 8, timeBonus: 180 },
            hard: { pairs: 12, timeBonus: 240 }
          }
        },
        xpReward: 100
      });
    }
  }
}
