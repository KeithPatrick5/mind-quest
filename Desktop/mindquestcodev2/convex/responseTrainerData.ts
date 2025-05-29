export const responseTrainerScenarios = {
  "Major Depression": [
    {
      id: "depression_1",
      title: "Friend Cancels Plans",
      scenario: "Your friend cancels plans with you last minute, saying they're not feeling well. Your first thought is 'They probably just don't want to hang out with me.'",
      responses: [
        "Text them saying 'Fine, whatever. I guess I'm not important to you.'",
        "Assume they're lying and confront them about it.",
        "Accept their explanation and offer support, suggesting to reschedule when they feel better.",
        "Don't respond and avoid making plans with them in the future."
      ],
      correctIndex: 2,
      explanation: "The healthiest response shows empathy and understanding. Depression often involves negative thought patterns that assume the worst about situations. Taking people at face value and offering support builds stronger relationships.",
      category: "Social Situations"
    },
    {
      id: "depression_2",
      title: "Work Criticism",
      scenario: "Your boss gives you feedback on a project, pointing out several areas for improvement. You immediately think 'I'm terrible at my job and everyone knows it.'",
      responses: [
        "Argue with your boss about why their feedback is wrong.",
        "Thank them for the feedback and ask for specific suggestions on how to improve.",
        "Agree completely and apologize profusely for being incompetent.",
        "Ignore the feedback and assume they just don't like you."
      ],
      correctIndex: 1,
      explanation: "Constructive feedback is an opportunity for growth. The healthy response involves accepting feedback gracefully and seeking specific ways to improve, rather than catastrophizing or taking it as a personal attack.",
      category: "Work/Professional"
    },
    {
      id: "depression_3",
      title: "Social Gathering Anxiety",
      scenario: "You're invited to a party but feel overwhelmed by the thought of socializing. You think 'I'll just bring everyone down if I go.'",
      responses: [
        "Force yourself to go and pretend to be happy the whole time.",
        "Don't go and don't tell anyone why you're not coming.",
        "Politely decline but suggest meeting the host for coffee one-on-one later.",
        "Go but leave immediately if you feel uncomfortable."
      ],
      correctIndex: 2,
      explanation: "It's important to honor your emotional needs while maintaining social connections. Suggesting an alternative that feels more manageable shows self-awareness and keeps relationships intact.",
      category: "Social Situations"
    }
  ],
  "Generalized Anxiety": [
    {
      id: "anxiety_1",
      title: "Running Late",
      scenario: "You're running 10 minutes late for a meeting due to unexpected traffic. You start thinking 'Everyone will think I'm irresponsible and unprofessional.'",
      responses: [
        "Speed dangerously to try to make up time.",
        "Call ahead to let them know you're running late and apologize.",
        "Don't show up at all because you're too embarrassed.",
        "Arrive late without explanation and act like nothing happened."
      ],
      correctIndex: 1,
      explanation: "Communication is key when dealing with unexpected delays. Most people understand that traffic happens, and calling ahead shows responsibility and respect for others' time.",
      category: "Work/Professional"
    },
    {
      id: "anxiety_2",
      title: "Health Worry",
      scenario: "You notice a small bump on your skin and immediately start worrying it could be something serious. You think 'What if it's cancer?'",
      responses: [
        "Spend hours researching symptoms online and convince yourself it's serious.",
        "Ignore it completely and hope it goes away.",
        "Schedule a routine appointment with your doctor to have it checked.",
        "Ask everyone you know what they think it could be."
      ],
      correctIndex: 2,
      explanation: "When health concerns arise, the most balanced approach is to seek professional medical advice rather than catastrophizing or avoiding the issue entirely.",
      category: "Health/Self-Care"
    },
    {
      id: "anxiety_3",
      title: "Social Media Silence",
      scenario: "You posted something on social media an hour ago and no one has liked or commented yet. You think 'Everyone must think I'm boring or annoying.'",
      responses: [
        "Delete the post immediately out of embarrassment.",
        "Keep checking every few minutes and get more anxious.",
        "Remind yourself that people have their own lives and may not be online right now.",
        "Post something else to try to get more attention."
      ],
      correctIndex: 2,
      explanation: "Social media engagement doesn't reflect your worth as a person. People have busy lives and may not see or respond to posts immediately. Practicing self-compassion helps reduce anxiety.",
      category: "Social Situations"
    }
  ],
  "ADHD": [
    {
      id: "adhd_1",
      title: "Forgotten Deadline",
      scenario: "You realize you completely forgot about an important deadline that's tomorrow. You think 'I'm so disorganized, I'll never be successful.'",
      responses: [
        "Panic and stay up all night trying to complete everything perfectly.",
        "Give up because there's not enough time to do it well.",
        "Contact the relevant person to explain the situation and ask for a brief extension if possible.",
        "Rush through the work carelessly just to get something submitted."
      ],
      correctIndex: 2,
      explanation: "ADHD can affect time management and organization. The healthiest response involves honest communication and problem-solving rather than self-criticism or panic.",
      category: "Work/Professional"
    },
    {
      id: "adhd_2",
      title: "Hyperfocus Interruption",
      scenario: "You're deeply focused on a project you enjoy when someone interrupts you for a meeting. You feel frustrated and think 'Why can't people just leave me alone when I'm productive?'",
      responses: [
        "Snap at the person and refuse to go to the meeting.",
        "Reluctantly go but be visibly annoyed the entire time.",
        "Acknowledge your frustration internally, then politely transition to the meeting.",
        "Ignore the interruption and continue working."
      ],
      correctIndex: 2,
      explanation: "Hyperfocus is common with ADHD, and interruptions can be jarring. The healthy response involves recognizing your feelings while still meeting your responsibilities professionally.",
      category: "Work/Professional"
    },
    {
      id: "adhd_3",
      title: "Fidgeting in Meeting",
      scenario: "During a long meeting, you find yourself fidgeting and having trouble sitting still. You notice others looking at you and think 'Everyone thinks I'm being disruptive.'",
      responses: [
        "Force yourself to sit completely still even though it's uncomfortable.",
        "Get up and leave the meeting to avoid being disruptive.",
        "Use discrete fidget tools or take notes to channel your energy productively.",
        "Continue fidgeting and ignore what others might think."
      ],
      correctIndex: 2,
      explanation: "Fidgeting is a natural way for people with ADHD to help maintain focus. Using appropriate outlets like fidget tools or note-taking can be both helpful and professional.",
      category: "Work/Professional"
    }
  ],
  "PTSD": [
    {
      id: "ptsd_1",
      title: "Unexpected Trigger",
      scenario: "You're watching a movie when a scene unexpectedly triggers memories of your trauma. You feel your heart racing and think 'I should be over this by now.'",
      responses: [
        "Force yourself to keep watching to 'get over it.'",
        "Leave the room and use grounding techniques you've learned.",
        "Get angry at yourself for still being affected.",
        "Avoid all movies and TV shows from now on."
      ],
      correctIndex: 1,
      explanation: "Triggers can happen unexpectedly, and that's normal in PTSD recovery. The healthiest response is to remove yourself from the trigger and use coping strategies rather than forcing exposure or avoiding everything.",
      category: "Self-Care/Coping"
    },
    {
      id: "ptsd_2",
      title: "Friend Asks About Trauma",
      scenario: "A well-meaning friend asks you about your traumatic experience, saying 'You can talk to me about anything.' You feel uncomfortable but think 'Maybe I should just tell them.'",
      responses: [
        "Share all the details even though it makes you uncomfortable.",
        "Thank them for caring but explain you're not ready to discuss it right now.",
        "Get angry and tell them to mind their own business.",
        "Lie and say you're completely fine and over it."
      ],
      correctIndex: 1,
      explanation: "You have the right to control when and how you share your experiences. A healthy response acknowledges their care while maintaining your boundaries about what you're comfortable discussing.",
      category: "Social Situations"
    },
    {
      id: "ptsd_3",
      title: "Hypervigilance in Public",
      scenario: "You're in a crowded restaurant and feel on edge, constantly scanning for exits and potential threats. You think 'I'm being paranoid and ruining everyone's time.'",
      responses: [
        "Force yourself to ignore these feelings and act normal.",
        "Leave immediately without explanation.",
        "Acknowledge these feelings as part of your healing process and use calming techniques.",
        "Drink alcohol to numb the anxiety."
      ],
      correctIndex: 2,
      explanation: "Hypervigilance is a common PTSD symptom. The healthiest approach is to acknowledge these feelings without judgment and use healthy coping strategies rather than forcing yourself to ignore them or using unhealthy numbing methods.",
      category: "Self-Care/Coping"
    }
  ]
};

export async function addResponseTrainerToTracks(ctx: any, trackIds: Record<string, any>) {
  for (const [trackName, scenarios] of Object.entries(responseTrainerScenarios)) {
    if (trackIds[trackName]) {
      await ctx.db.insert("challenges", {
        trackId: trackIds[trackName],
        day: -1, // Special challenge available anytime (different from memory game day 0)
        title: "Response Trainer",
        type: "response_trainer",
        content: {
          scenarios,
          description: "Practice choosing healthy responses to challenging situations"
        },
        xpReward: 30
      });
    }
  }
}
