import { PracticeExercise } from '../types';

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  {
    id: 'prac-interview-1',
    title: 'The Classic Dilemma: "Tell Me About Yourself"',
    type: 'speaking',
    category: 'PERSPECTIVE',
    difficulty: 'Beginner',
    contextBrief: 'You are interviewing for your dream role. The hiring manager leans back, smiles warmly, and opens with: "To get started, tell me about yourself."',
    prompt: 'Deliver a structured, confident 60-to-90 second introduction that connects your past, your core superpower, and why this specific opportunity aligns with your trajectory. Avoid reciting your chronological resume.',
    constraints: [
      'Do not start with where you went to school unless it directly provides the core narrative anchor.',
      'Highlight exactly one defining professional superpower.',
      'End with a forward-looking statement connecting you to this company.'
    ],
    recommendedFramework: 'PREP / Past-Present-Future'
  },
  {
    id: 'prac-choice-deescalation',
    title: 'De-escalating an Accusatory Client Email',
    type: 'conversation_choice',
    category: 'SOCIAL_SITUATION',
    difficulty: 'Intermediate',
    contextBrief: 'A major enterprise client sends an angry email at 6:30 PM: "Your team completely dropped the ball on today\'s deployment! Our sales reps couldn\'t access their dashboards for three hours. Who is responsible for this incompetence?"',
    prompt: 'Select the response that demonstrates executive maturity, defuses hostility, and maintains constructive partnership.',
    choices: [
      {
        id: 'c1',
        label: 'Defensive Counter-attack',
        isOptimal: false,
        explanation: '"First of all, our team didn\'t drop the ball. Your IT team failed to whitelist our IP addresses as we instructed last week, which caused the timeout. Please check your own infrastructure before accusing us."',
        psychologicalInsight: 'Technically accurate, but emotionally catastrophic. It turns a vendor partnership into a defensive blame game and guarantees the client will seek to terminate the contract.'
      },
      {
        id: 'c2',
        label: 'Apologetic Groveling',
        isOptimal: false,
        explanation: '"I am so, so terribly sorry! We are completely horrified this happened. It was totally our fault and I promise we will punish whoever pushed that build. Please forgive us!"',
        psychologicalInsight: 'Submissive groveling destroys professional authority. It signals panic, throws a teammate under the bus, and invites further abuse from high-pressure clients.'
      },
      {
        id: 'c3',
        label: 'Calm Executive Anchor (Optimal)',
        isOptimal: true,
        explanation: '"I completely understand why your sales reps being locked out during business hours is alarming—especially at month-end. The dashboard service was fully restored at 5:45 PM and is operating normally. I am personally conducting an incident post-mortem with our engineering and integration leads tomorrow morning at 8:00 AM, and I will deliver a full root-cause report with preventative safeguards to your desk by 11:00 AM. Let\'s review it together on a quick 10-minute call tomorrow."',
        psychologicalInsight: 'Validates their high stakes without adopting victim posture. Confirms the current stable state, provides concrete timeline, and leads with authoritative accountability.'
      }
    ]
  },
  {
    id: 'prac-pressure-crisis',
    title: 'Crisis Briefing Under 2-Minute Pressure',
    type: 'pressure',
    category: 'PRESSURE',
    difficulty: 'Advanced',
    contextBrief: 'An unexpected security vulnerability was reported 15 minutes ago. Senior leadership and 40 team members are assembled on an emergency bridge. Everyone is anxious and rumors are spreading.',
    prompt: 'Deliver a calm 60-second status brief. You must acknowledge the incident, establish immediate facts, quash speculation, and outline the exact triage plan for the next 60 minutes.',
    constraints: [
      'Speak at a deliberate, steady cadence (do not rush).',
      'Explicitly distinguish between verified facts and unverified rumors.',
      'Give one clear instruction to the team to prevent panic.'
    ],
    recommendedFramework: 'Bottom-Line Up Front (BLUF)'
  },
  {
    id: 'prac-framework-salary',
    title: 'Negotiating a Salary Raise Using PREP',
    type: 'framework',
    category: 'DILEMMA',
    difficulty: 'Intermediate',
    contextBrief: 'You have consistently exceeded your quarterly goals for the past twelve months, taken on the duties of a departed team lead, and saved the department $40,000 in software vendor costs.',
    prompt: 'Structure your opening request for a 15% compensation adjustment using the PREP framework (Point, Reason, Example, Point).',
    constraints: [
      'Anchor on value delivered to the organization, never personal expenses (e.g. rent increases).',
      'State the exact proposed figure or percentage clearly.'
    ],
    recommendedFramework: 'PREP'
  },
  {
    id: 'prac-deep-conviction',
    title: 'Defending an Unpopular Principle',
    type: 'written',
    category: 'DEEP_QUESTION',
    difficulty: 'Advanced',
    contextBrief: 'In leadership and human relationships, popular consensus often conflicts with long-term integrity and truth.',
    prompt: 'Explain an unpopular principle or boundary that you strictly adhere to in your personal or professional life. Defend its necessity without moral superiority or apologetic hedging.',
    constraints: [
      'Explain the short-term friction it causes.',
      'Articulate the profound long-term protection or clarity it guarantees.'
    ],
    recommendedFramework: 'Steelmanning / What-Why-How'
  },
  {
    id: 'prac-presentation-pitch',
    title: 'The 60-Second Elevator Pitch',
    type: 'presentation',
    category: 'PERSPECTIVE',
    difficulty: 'Beginner',
    contextBrief: 'You step into an elevator with an investor or key executive who asks: "What problem does your initiative solve?"',
    prompt: 'Deliver a captivating 45-to-60 second pitch using What / Why / How that makes them want to schedule a 30-minute follow-up.',
    constraints: [
      'Zero technical jargon.',
      'One vivid analogy or relatable problem statement.'
    ],
    recommendedFramework: 'What / Why / How'
  }
];
