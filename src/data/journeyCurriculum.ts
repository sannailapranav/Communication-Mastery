import { JourneyStage, JourneyLevelData } from '../types';

/**
 * PROGRESSION & LEVEL LOCKING SYSTEM
 * When CURRICULUM_LOCKING_ENABLED is true:
 * - Level 1 is unlocked for new users.
 * - Level N+1 unlocks only after Level N is successfully completed with a passing score.
 * - All subsequent levels are strictly locked.
 */
export const CURRICULUM_LOCKING_ENABLED = true;
export const PASSING_SCORE = 70; // Passing score threshold (percentage)

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'world-1-foundations',
    stageNumber: 1,
    title: 'The Foundation of a Good Answer',
    subtitle: 'Question intent, directness, point-first clarity, reasoning, and grounded examples',
    description: 'Teach the basic architecture of a clear answer: what to say, where to start, and how to stop wandering before reaching your point.',
    purpose: 'Master the fundamental grammar of an answer so listeners understand your thought within the first five seconds.',
    levelRange: [1, 5],
    iconName: 'Compass',
    colorTheme: 'stone'
  },
  {
    id: 'world-2-core-frameworks',
    stageNumber: 2,
    title: 'Core Answer Frameworks',
    subtitle: 'What/Why/How, PREP, 5W1H, Situation-Problem-Response, Situation-Action-Result',
    description: 'Equip your mind with battle-tested answer structures so you never struggle to organize thoughts under scrutiny.',
    purpose: 'Learn five foundational architectures that immediately transform chaotic thoughts into organized verbal precision.',
    levelRange: [6, 10],
    iconName: 'Layers',
    colorTheme: 'amber'
  },
  {
    id: 'world-3-explaining-ideas',
    stageNumber: 3,
    title: 'Explaining Ideas',
    subtitle: 'Simplicity, definition-explanation-example, compare and contrast, cause and effect, problem-cause-solution',
    description: 'How to explain complicated ideas simply without losing depth, confusing the listener, or drowning in jargon.',
    purpose: 'Translate abstract or complex thoughts into clean conceptual models anyone can follow.',
    levelRange: [11, 15],
    iconName: 'Lightbulb',
    colorTheme: 'blue'
  },
  {
    id: 'world-4-opinions-arguments',
    stageNumber: 4,
    title: 'Opinions and Arguments',
    subtitle: 'Stating viewpoints, opinion-reason-example, agreeing with substance, respectful disagreement, supporting claims, handling "Why?"',
    description: 'Clearly state what you think, defend claims with evidence, and engage counter-arguments without aggression or timid retreat.',
    purpose: 'Build conviction and persuasive clarity so your positions carry weight in discussion.',
    levelRange: [16, 21],
    iconName: 'ShieldCheck',
    colorTheme: 'emerald'
  },
  {
    id: 'world-5-storytelling',
    stageNumber: 5,
    title: 'Storytelling Frameworks',
    subtitle: 'Why stories work, beginning-middle-end, situation-conflict-resolution, STAR, story relevance, story with a point',
    description: 'Transform personal and professional experiences into engaging narrative structures that make ideas unforgettable.',
    purpose: 'Use narrative tension and meaningful resolution to connect with listeners and make lessons stick.',
    levelRange: [22, 27],
    iconName: 'BookOpen',
    colorTheme: 'indigo'
  },
  {
    id: 'world-6-real-questions',
    stageNumber: 6,
    title: 'Answering Real Questions',
    subtitle: 'Tell me about yourself, what do you think, why choose you, weaknesses, hypothetical choices, unexpected questions',
    description: 'Master the high-frequency questions that decide career trajectories, interview outcomes, and personal impressions.',
    purpose: 'Replace scripted anxiety with adaptable, structured responses to real-world questions.',
    levelRange: [28, 33],
    iconName: 'UserCheck',
    colorTheme: 'violet'
  },
  {
    id: 'world-7-thinking-speaking',
    stageNumber: 7,
    title: 'Thinking While Speaking',
    subtitle: 'Rapid mental organization, information filtering, one idea at a time, transitions, thought recovery, composure under pressure',
    description: 'How to structure thoughts in the 2-second pause before speaking, filter noise, and maintain coherence under scrutiny.',
    purpose: 'Eliminate rambling and verbal panic by keeping your mental outline ahead of your spoken words.',
    levelRange: [34, 39],
    iconName: 'Brain',
    colorTheme: 'cyan'
  },
  {
    id: 'world-8-advanced-frameworks',
    stageNumber: 8,
    title: 'Advanced Communication Frameworks',
    subtitle: 'Claim-Evidence-Explanation, Problem-Options-Recommendation, Before-Change-After, Context-Point-Implication, Principle-Example-Application, Layered Answers',
    description: 'Executive-level communication architectures for leadership, high-stakes decisions, and strategic communication.',
    purpose: 'Deliver concise recommendations, strategic proposals, and layered insights that inspire decisive action.',
    levelRange: [40, 45],
    iconName: 'Target',
    colorTheme: 'rose'
  },
  {
    id: 'world-9-adapting-audience',
    stageNumber: 9,
    title: 'Adapting the Same Answer',
    subtitle: 'Speaking to a friend, teacher, interviewer, professional, stranger, and cross-audience translation',
    description: 'Understand that there is no universal perfect answer. Learn to modulate vocabulary, depth, framing, and tone by context.',
    purpose: 'Cultivate empathetic calibration so your core message resonates with any audience.',
    levelRange: [46, 51],
    iconName: 'Users',
    colorTheme: 'teal'
  },
  {
    id: 'world-10-conversational-mastery',
    stageNumber: 10,
    title: 'Conversational Mastery',
    subtitle: 'Asking better questions, follow-ups, responsive listening, clarifying before answering, misunderstandings, knowing when to stop',
    description: 'Move past static answering into dynamic conversational flow, perceptive questions, and active listening.',
    purpose: 'Transform two-way dialogue from competitive exchanges into collaborative exploration.',
    levelRange: [52, 58],
    iconName: 'MessageSquare',
    colorTheme: 'sky'
  },
  {
    id: 'world-11-difficult-communication',
    stageNumber: 11,
    title: 'Difficult Communication',
    subtitle: 'Saying no, giving criticism, receiving feedback, non-combative disagreement, explaining mistakes, apologies, hard conversations',
    description: 'Communicate with calm boundaries and unshakeable dignity in moments of tension, mistake, conflict, and pressure.',
    purpose: 'Preserve relationships and personal integrity when communicating through stress and friction.',
    levelRange: [59, 65],
    iconName: 'ShieldAlert',
    colorTheme: 'orange'
  },
  {
    id: 'world-12-communication-mastery',
    stageNumber: 12,
    title: 'Communication Mastery',
    subtitle: 'Framework selection, blending models, flexibility, natural speaking, 5 angles on one question, real-time synthesis, final capstone',
    description: 'The culmination: frameworks dissolve into instinctive, natural, authentic, and charismatic verbal mastery.',
    purpose: 'Speak effortlessly without rigid scripts, commanding any room with natural clarity and conviction.',
    levelRange: [66, 75],
    iconName: 'Crown',
    colorTheme: 'amber'
  }
];

// Helper to construct rich LevelData
interface LevelConfig {
  levelNumber: number;
  stageNumber: number;
  title: string;
  subtitle: string;
  frameworkName: string;
  frameworkFormula: string;
  frameworkSteps: string[];
  idealSituations: string[];
  whenToAvoid?: string[];
  headline: string;
  greetingContext: string;
  whyItMatters: string;
  whatYouWillUnderstand: string;
  corePremise: string;
  mechanisms: string[];
  commonPitfall: string;
  mentalModel: string;
  weakContext: string;
  weakResponse: string;
  weakCritique: string;
  strongResponse: string;
  strongBreakdown: string;
  keyDistinction: string;
  prompt: string;
  scenario: string;
  frameworkGuidance: string;
  sampleFrameworkApplication: string;
  placeholder: string;
  rule: string;
  actionableHabit: string;
  closingReflection: string;
}

const RAW_LEVELS: LevelConfig[] = [
  // ==========================================
  // WORLD 1: THE FOUNDATION OF A GOOD ANSWER (1 - 5)
  // ==========================================
  {
    levelNumber: 1,
    stageNumber: 1,
    title: 'Understand the Question',
    subtitle: 'Identify what the question is actually asking before formulating words',
    frameworkName: 'Question Intent Classification',
    frameworkFormula: 'Intent Check → Question Category (Opinion | Fact | Reason | Definition) → Direct Target',
    frameworkSteps: [
      '1. Pause: Suppress the urge to speak instantly upon hearing the final syllable.',
      '2. Classify: Is the speaker asking for your personal stance, an objective explanation, a cause, or a boundary?',
      '3. Target: Lock onto the specific verdict requested without drifting into tangential facts.'
    ],
    idealSituations: ['Unexpected questions in meetings', 'Interview prompts', 'Casual debate with friends'],
    whenToAvoid: ['When the question is simply rhetorical or a conversational pleasantry'],
    headline: 'You cannot deliver a brilliant answer if you answer a question that was never asked.',
    greetingContext: 'Welcome to Level 1. In communication, 60% of weak responses occur not because people lack vocabulary, but because they start speaking before understanding what the question actually requires.',
    whyItMatters: 'When you identify the true intent of a question, you save listeners from having to interrupt you to redirect the conversation.',
    whatYouWillUnderstand: 'How to distinguish between an opinion request ("What do you think?") and an informational query ("What is it?").',
    corePremise: 'Questions fall into distinct categories. "What do you think of social media?" asks for your personal value judgment and stance, not an encyclopedic history of Mark Zuckerberg or how algorithms work.',
    mechanisms: [
      'Intent isolation: Separate the core question from conversational setup.',
      'Category calibration: Align your answer structure to the question type (Opinion requires a stance; Definition requires simple boundaries).',
      'The 2-second breath: Giving yourself a two-second pause increases cognitive accuracy by over 40%.'
    ],
    commonPitfall: 'Hearing a topic keyword (e.g. "social media") and dumping everything you know about it instead of answering the specific question.',
    mentalModel: 'The Bullseye Target: The question is an arrow hitting an exact spot. Do not spray words over the entire archery field.',
    weakContext: 'A friend or colleague asks: "What do you think about social media?"',
    weakResponse: 'Social media started in the early 2000s with Orkut and MySpace. Facebook has billions of users now and algorithms feed people videos based on AI engagement models.',
    weakCritique: 'This is an encyclopedia definition, not an answer. The listener asked "What do you think?" (your opinion), but received a history lesson.',
    strongResponse: 'I think social media is an incredible amplifier. If you use it to build skills and connect with creators, it expands your world. But if you consume it passively without intention, it quietly eats your attention span.',
    strongBreakdown: 'Directly stated opinion ("an incredible amplifier") → Nuanced perspective on active vs passive usage.',
    keyDistinction: 'Weak response gives detached trivia; strong response delivers a clear, thoughtful personal stance.',
    prompt: 'A colleague asks: "What do you think about people working remotely from home?"',
    scenario: 'You are having lunch with a coworker who wants to hear your genuine viewpoint.',
    frameworkGuidance: 'Identify intent: This asks for your stance, not a history of Zoom. State what you believe clearly.',
    sampleFrameworkApplication: 'Point: Remote work creates autonomy. Reason: Eliminates commuting stress. Tradeoff: Requires proactive relationship building.',
    placeholder: 'State what you think about remote work directly...',
    rule: 'Never answer before you determine whether the question asks for an opinion, a reason, or a fact.',
    actionableHabit: 'When asked any question today, take a 2-second silent breath and name the question type in your head before speaking.',
    closingReflection: 'A clear answer begins with an accurate diagnosis of the question.'
  },
  {
    levelNumber: 2,
    stageNumber: 1,
    title: 'Answer the Actual Question',
    subtitle: 'Stop talking around the prompt and eliminate evasive filler',
    frameworkName: 'Direct Target Alignment',
    frameworkFormula: 'Acknowledge Question → Address Exact Core → Hold Boundaries',
    frameworkSteps: [
      '1. Match the verb: If asked "Will you...?", start with your commitment or limitation.',
      '2. Ban conversational deflections: Cut out "That is an interesting question..." or "It depends on many things...".',
      '3. Check alignment: Did your first 15 words answer the prompt?'
    ],
    idealSituations: ['Project deadlines', 'Direct interview inquiries', 'Budget and resource conversations'],
    headline: 'Evasive answers sound like hiding, even when you have nothing to hide.',
    greetingContext: 'Welcome to Level 2. Most people do not answer the question asked because they fear making a definitive commitment.',
    whyItMatters: 'Directness builds trust. When listeners know you answer directly, they stop second-guessing your motivations.',
    whatYouWillUnderstand: 'The difference between directly answering, talking around the subject, and providing distracting fluff.',
    corePremise: 'If someone asks "Can you finish the report by 5 PM?", the only valid initial response is "Yes", "No", or "Not completely, but here is what will be ready." Saying "Well, the database had slow queries this morning..." leaves the listener frustrated.',
    mechanisms: [
      'Verbal honesty: Deliver the bottom line first, context second.',
      'Eliminate padding: Ban filler phrases like "To be honest" or "That is a complex inquiry".',
      'The listener relief principle: Listeners feel calm the moment they receive the specific data point requested.'
    ],
    commonPitfall: 'Giving your justification before giving your answer because you are afraid the answer will displease the listener.',
    mentalModel: 'The Receipt: Hand the customer the item first before explaining the delivery logistics.',
    weakContext: 'Manager asks: "Can you take lead on the client demo this Thursday?"',
    weakResponse: 'Well, Thursday is quite busy for me because I have three meetings in the morning and I was planning to review code with the design team in the afternoon...',
    weakCritique: 'The manager still has no idea whether you are doing the demo or not. They must ask again.',
    strongResponse: 'Yes, I can take the demo on Thursday. I will reschedule my afternoon design sync so I can spend two hours preparing beforehand.',
    strongBreakdown: 'Direct confirmation ("Yes, I can") → Immediate mitigation plan for existing commitments.',
    keyDistinction: 'Weak response forces the listener to decode your schedule; strong response solves their problem instantly.',
    prompt: 'Your team lead asks: "Did you manage to fix the login bug reported yesterday?"',
    scenario: 'Standup meeting where the team needs an immediate status update.',
    frameworkGuidance: 'Do not explain how hard the bug was first. State whether it is fixed, in progress, or blocked.',
    sampleFrameworkApplication: 'Direct Answer: Not yet. Context: Found the root cause in the session token. Next step: Patch will be tested by noon.',
    placeholder: 'Answer the question directly first, then explain...',
    rule: 'Deliver your answer in your very first sentence; place your explanations in the second.',
    actionableHabit: 'Answer yes/no/status questions with the verdict within your first three words.',
    closingReflection: 'Directness is not bluntness; directness is respect for the listener’s cognitive bandwidth.'
  },
  {
    levelNumber: 3,
    stageNumber: 1,
    title: 'Start With the Point',
    subtitle: 'Lead with your conclusion rather than making the listener hunt for it',
    frameworkName: 'BLUF (Bottom Line Up Front)',
    frameworkFormula: 'Bottom Line Conclusion → Supporting Rationale → Elaboration',
    frameworkSteps: [
      '1. Formulate your final takeaway in one punchy sentence.',
      '2. Deliver that sentence as your opening phrase.',
      '3. Walk backward into the background only as much as necessary.'
    ],
    idealSituations: ['Status updates', 'Executive summaries', 'Answering "Should we do X?"'],
    headline: 'If your listener has to wait until minute three to understand your point, you have already lost them.',
    greetingContext: 'Welcome to Level 3. In school, we are taught to write essays by building up historical context, presenting arguments, and revealing our thesis at the end. In real communication, that structure is lethal.',
    whyItMatters: 'Busy people listen with divided attention. If you provide your point upfront, they can evaluate your reasons in context.',
    whatYouWillUnderstand: 'Why inverted pyramid communication commands attention while narrative suspense causes listeners to tune out.',
    corePremise: 'State your conclusion before your evidence. Point first → explanation after.',
    mechanisms: [
      'Anchor effect: The listener frames all incoming data against your declared conclusion.',
      'Reduced anxiety: Listeners don’t spend energy wondering "Where is this going?".',
      'Crisp editing: When your point is already on the table, you naturally speak less fluff.'
    ],
    commonPitfall: 'Telling the chronological story of how you reached the conclusion instead of stating the conclusion itself.',
    mentalModel: 'The Newspaper Headline: The title gives the news; the paragraphs underneath provide the details.',
    weakContext: 'Asked during a product meeting: "Should we launch the new onboarding flow next Monday?"',
    weakResponse: 'Well, last week we ran user tests with 12 people. Four had minor issues on mobile, six loved the animations, and our engineer was sick on Tuesday, but we tested again yesterday and the bug is resolved, so overall I think yes.',
    weakCritique: 'The listener had to endure 40 seconds of rambling storytelling just to hear a single "yes" at the finish line.',
    strongResponse: 'Yes, we should launch next Monday. User testing confirmed the flow is stable, and our engineers already resolved the mobile edge case yesterday.',
    strongBreakdown: 'Point first ("Yes, we should launch next Monday") → Primary evidence in two brief sentences.',
    keyDistinction: 'The strong response provides the verdict in one second; the weak response buries it at the bottom.',
    prompt: 'Your manager asks: "Do you recommend we hire the junior designer we interviewed today?"',
    scenario: 'Post-interview debrief in the hallway.',
    frameworkGuidance: 'Start with your recommendation: "Yes, I recommend hiring her" or "No, I do not think she is the right fit". Then support it.',
    sampleFrameworkApplication: 'Point: Yes, we should hire him. Reason: His portfolio demonstrates strong typography and he explained his design decisions with clarity.',
    placeholder: 'Start with your recommendation in sentence one...',
    rule: 'State your headline first. Context is an explanation, not an introduction.',
    actionableHabit: 'In your next meeting or message, write or say the conclusion before you explain why.',
    closingReflection: 'Putting the bottom line up front is the single highest-ROI habit in verbal communication.'
  },
  {
    levelNumber: 4,
    stageNumber: 1,
    title: 'Point → Reason',
    subtitle: 'Never leave an assertion hanging without its supporting anchor',
    frameworkName: 'Point-Reason Architecture',
    frameworkFormula: 'Claim / Stance (What I Think) + Rational Justification (Why I Think It)',
    frameworkSteps: [
      '1. State your Point clearly.',
      '2. Immediately connect with a causal connector ("because...", "the reason is...").',
      '3. Provide one distinct, logical driver.'
    ],
    idealSituations: ['Making proposals', 'Explaining a choice', 'Casual disagreements'],
    headline: 'An opinion without a reason is just noise; an opinion with a reason is an argument.',
    greetingContext: 'Welcome to Level 4. Many people state what they think, but stop before explaining why. The listener is left with a bare assertion they cannot evaluate.',
    whyItMatters: 'Adding even one crisp reason increases persuasion and cooperation dramatically.',
    whatYouWillUnderstand: 'How linking your point with "because" transforms an arbitrary declaration into a reasoned perspective.',
    corePremise: 'A complete answer pairs What I Think with Why I Think It. "We should change vendors because our current provider has had three outages this month."',
    mechanisms: [
      'Cognitive grounding: The brain naturally seeks causality; supplying the reason closes the loop.',
      'Credibility: Explaining "why" signals that your stance is deliberate rather than impulsive.',
      'Economy of words: One good reason is far stronger than three vague opinions.'
    ],
    commonPitfall: 'Repeating the point with different adjectives instead of giving an actual causal reason ("I like this design because it looks really nice and good").',
    mentalModel: 'The Hammer and Nail: The Point is the nail; the Reason is the hammer driving it home.',
    weakContext: 'Asked in a strategy session: "Which cloud provider should we migrate to?"',
    weakResponse: 'We should definitely pick AWS. It is just way better and everybody uses it. It is clearly the right choice.',
    weakCritique: 'Zero reasons provided. Saying "it is way better" is merely repeating the point with hype words.',
    strongResponse: 'We should choose AWS because their managed database services reduce our infrastructure maintenance overhead by at least half.',
    strongBreakdown: 'Point ("We should choose AWS") + Specific Reason ("managed database services reduce maintenance overhead").',
    keyDistinction: 'Weak answer uses circular opinion; strong answer provides a tangible mechanism of benefit.',
    prompt: 'A colleague asks: "Why do you prefer working in short 90-minute focus blocks?"',
    scenario: 'Explaining your productivity routine.',
    frameworkGuidance: 'State your preference (Point), then explain the cognitive or physical benefit (Reason).',
    sampleFrameworkApplication: 'Point: I work in 90-minute blocks. Reason: Because human attention naturally wanes after an hour, and taking a break prevents late-afternoon burnout.',
    placeholder: 'I prefer this because...',
    rule: 'Never say what you think without immediately pairing it with why you think it.',
    actionableHabit: 'Whenever you state an opinion today, force yourself to finish the sentence with "because [one clear reason]".',
    closingReflection: 'Reasoning is the bridge between your mind and the listener’s agreement.'
  },
  {
    levelNumber: 5,
    stageNumber: 1,
    title: 'Point → Reason → Example',
    subtitle: 'Ground your abstract reason in a concrete, undeniable instance',
    frameworkName: 'P-R-E Structure',
    frameworkFormula: 'Point (What) → Reason (Why) → Example (Proof in Action)',
    frameworkSteps: [
      '1. Deliver the Point.',
      '2. Follow with the Reason.',
      '3. Introduce a concrete instance with "For example..." or "For instance...".'
    ],
    idealSituations: ['Interviews', 'Client presentations', 'Mentoring team members', 'Explaining concepts'],
    headline: 'People may argue with your opinions, but they cannot argue with a concrete example.',
    greetingContext: 'Welcome to Level 5. You are now mastering one of the fundamental answer structures in human communication: Point → Reason → Example.',
    whyItMatters: 'Points are abstract. Reasons are conceptual. Examples are visual. When you give an example, the listener sees a movie in their head.',
    whatYouWillUnderstand: 'How a brief real-world example turns a theoretical statement into believable truth.',
    corePremise: 'Point: Online learning is revolutionary. Reason: It democratizes access to elite instruction. Example: A student in a remote village can study machine learning directly from Stanford lectures.',
    mechanisms: [
      'Dual coding: Abstract logic pairs with episodic memory.',
      'Instant verification: The example proves you have grounded experience, not just textbook theory.',
      'Closure: An example provides a natural resting point so you don’t ramble.'
    ],
    commonPitfall: 'Letting the example run away into a 5-minute story with trivial side characters and lost focus.',
    mentalModel: 'The Stool: Point is the seat; Reason is the first leg; Example is the stabilizing leg that keeps it standing.',
    weakContext: 'Asked during an interview: "Why is automated testing important?"',
    weakResponse: 'Automated testing is very important because manual testing takes too much time and developers make mistakes and bugs are bad for companies.',
    weakCritique: 'Abstract clichés without any vivid real-world grounding.',
    strongResponse: 'Automated testing is essential (Point) because it catches regressions before they reach paying customers (Reason). For example, last month an automated unit test caught a billing currency bug that would have overcharged 200 European users (Example).',
    strongBreakdown: 'Point → Reason → Specific, quantified real-world instance that ends cleanly.',
    keyDistinction: 'The example transforms a generic platitude into proof of practical competence.',
    prompt: 'Explain why taking structured notes during meetings improves execution.',
    scenario: 'Advising a junior teammate who keeps forgetting action items.',
    frameworkGuidance: 'Follow Point → Reason → Example. Use a specific micro-scenario as your example.',
    sampleFrameworkApplication: 'Point: Note-taking guarantees follow-through. Reason: Verbal agreements fade within hours. Example: When we documented our sprint scope last week, we avoided three days of rework.',
    placeholder: 'State your Point, give your Reason, then say "For example..."',
    rule: 'An idea is incomplete until it has touched ground with a concrete example.',
    actionableHabit: 'Use the phrase "For example..." at least twice today when explaining anything to anyone.',
    closingReflection: 'Abstract thoughts enlighten the mind, but concrete examples convince the heart.'
  },

  // ==========================================
  // WORLD 2: CORE ANSWER FRAMEWORKS (6 - 10)
  // ==========================================
  {
    levelNumber: 6,
    stageNumber: 2,
    title: 'What / Why / How',
    subtitle: 'The golden triad for explaining products, systems, and initiatives',
    frameworkName: 'What-Why-How Triad',
    frameworkFormula: 'What it is (Essence) → Why it matters (Purpose) → How it works (Process)',
    frameworkSteps: [
      '1. WHAT: Define the entity in one crisp sentence without jargon.',
      '2. WHY: Explain the primary human or business benefit.',
      '3. HOW: Outline the 2 or 3 steps of execution.'
    ],
    idealSituations: ['Explaining a new project', 'Pitching a tool', 'Onboarding new team members'],
    headline: 'Never explain how something works until people understand what it is and why they should care.',
    greetingContext: 'Welcome to Level 6. Engineers and technical experts almost always make the mistake of jumping directly into HOW. The listener is left confused because they don’t yet understand WHAT or WHY.',
    whyItMatters: 'What/Why/How provides complete conceptual closure in under 60 seconds.',
    whatYouWillUnderstand: 'How to structure product and project explanations so non-technical stakeholders instantly comprehend them.',
    corePremise: 'Define the subject first (What), ignite relevance second (Why), and detail the mechanism third (How).',
    mechanisms: [
      'Top-down cognitive ingestion: The brain needs the box before it can organize the contents.',
      'Value before mechanics: Establishing "Why" creates motivational investment to understand "How".',
      'Structured brevity: Keeps technical overviews disciplined and high-impact.'
    ],
    commonPitfall: 'Explaining the mechanical gears (How) before telling the listener what machine you are even building.',
    mentalModel: 'The Blueprint: Name the building (What), state who lives there (Why), show the plumbing (How).',
    weakContext: 'A stakeholder asks: "What is this new Design System initiative you are proposing?"',
    weakResponse: 'We are creating React tokens with Tailwind utility configurations and writing documentation in Storybook with Figma auto-layout synchronization.',
    weakCritique: 'Pure "How" jargon. The stakeholder has no idea what a Design System actually is or why the company should fund it.',
    strongResponse: 'Our Design System is a shared library of standardized visual components (What). It matters because it cuts our feature development time in half and eliminates brand inconsistencies (Why). We are building it by auditing existing screens, standardizing our buttons and typography, and publishing them as reusable code components (How).',
    strongBreakdown: 'Clean definition (What) → Concrete business outcome (Why) → 3-step rollout plan (How).',
    keyDistinction: 'The strong response speaks to business value; the weak response drowns in tooling minutiae.',
    prompt: 'Explain what a "Daily Standup Meeting" is to someone who has never worked in tech.',
    scenario: 'Explaining modern team practices to a newcomer.',
    frameworkGuidance: 'Use What (definition), Why (purpose), and How (15-minute quick format).',
    sampleFrameworkApplication: 'What: A 15-minute daily sync. Why: To keep team priorities aligned and unblock bottlenecks. How: Everyone answers three quick questions: what they did, what they are doing, and what is blocking them.',
    placeholder: 'What is it? Why does it matter? How does it operate?',
    rule: 'Never dive into mechanics until the listener understands identity and value.',
    actionableHabit: 'When pitching any idea, force yourself to complete What and Why before uttering a single sentence of How.',
    closingReflection: 'Clarity is knowing what layer of information the listener needs right now.'
  },
  {
    levelNumber: 7,
    stageNumber: 2,
    title: 'PREP Framework',
    subtitle: 'The premier framework for opinions, meeting contributions, and quick answers',
    frameworkName: 'P-R-E-P Framework',
    frameworkFormula: 'Point → Reason → Example → Point (Reiteration / Call to Action)',
    frameworkSteps: [
      '1. Point: State your main thesis clearly.',
      '2. Reason: Provide the underlying logic.',
      '3. Example: Illustrate with a concrete story or evidence.',
      '4. Point: Restate the point with conclusion or forward momentum.'
    ],
    idealSituations: ['Answering spontaneous questions in meetings', 'Interviews', 'Executive Q&A'],
    headline: 'PREP prevents you from trailing off with "...so yeah, that is basically what I think."',
    greetingContext: 'Welcome to Level 7. PREP is the world’s most trusted framework for structured speaking. It adds a final "P" to create symmetrical closure.',
    whyItMatters: 'Without the final Point, speakers drift into awkward silence or trail off with nervous chuckles.',
    whatYouWillUnderstand: 'How closing your answer by restating the main Point leaves a memorable, authoritative impression.',
    corePremise: 'Point: We should invest in customer onboarding. Reason: First-week retention drives 80% of long-term lifetime value. Example: When we added welcome tutorials last quarter, 30-day churn dropped 15%. Point: That is why optimizing onboarding should be our Q3 priority.',
    mechanisms: [
      'The bookend effect: Opening and closing with the same point reinforces message recall.',
      'Clean landing gear: Gives you an unmistakable, graceful cue to stop speaking.',
      'Confidence signaling: Eliminates trailing fillers like "...and stuff like that".'
    ],
    commonPitfall: 'Forgetting the closing Point and continuing to add extra examples until the answer dissolves into rambling.',
    mentalModel: 'The Sandwich: Point (top bread), Reason & Example (the filling), Point (bottom bread holding it firm).',
    weakContext: 'In an executive meeting: "Do you think our marketing budget should shift toward short-form video?"',
    weakResponse: 'Short-form video is really popular right now on Instagram and TikTok. People are watching reels all the time. Our competitors are making videos too. So yeah, I guess we should probably do that too.',
    weakCritique: 'Lacks structure, sounds like casual gossip, and ends on a hesitant whimper.',
    strongResponse: 'Yes, we should shift 30% of our marketing budget into short-form video (Point). Modern buyers discover products through algorithmic feeds rather than static banner ads (Reason). For instance, our two short product demos last month generated triple the signups of our paid search ads (Example). Reallocating our budget to video is our fastest path to customer growth (Point).',
    strongBreakdown: 'Crisp thesis → Consumer behavior reason → Hard proof metric → Decisive closing restatement.',
    keyDistinction: 'The weak answer trails off with "So yeah"; the strong answer lands with executive authority.',
    prompt: 'Your company asks: "Should college students learn personal financial literacy before graduating?"',
    scenario: 'Panel discussion on practical education.',
    frameworkGuidance: 'Execute PREP cleanly: Point → Reason → Example → Final Point.',
    sampleFrameworkApplication: 'Point: Financial literacy should be mandatory. Reason: Earning money without budgeting leads to immediate debt traps. Example: Many new graduates commit 60% of income to loans without an emergency buffer. Point: Financial basics protect students from years of avoidable stress.',
    placeholder: 'Point: ... Reason: ... Example: ... Point: ...',
    rule: 'Never finish an answer with "...so yeah." Finish with your Point restated as a conclusion.',
    actionableHabit: 'In your next meeting question, consciously land your final sentence with: "And that is why [my point]."',
    closingReflection: 'A powerful opening captures attention; a structured closing commands respect.'
  },
  {
    levelNumber: 8,
    stageNumber: 2,
    title: '5W1H',
    subtitle: 'Ensure zero missing information when explaining situations and incidents',
    frameworkName: '5W1H Framework',
    frameworkFormula: 'Who + What + When + Where + Why + How',
    frameworkSteps: [
      '1. Anchor the essentials: Who was involved, What occurred, and When did it take place.',
      '2. Anchor the geography & context: Where did it happen.',
      '3. Anchor the causality & mechanism: Why did it happen and How was it resolved.'
    ],
    idealSituations: ['Incident reporting', 'Briefing a manager', 'Handover notes', 'Summarizing events'],
    headline: 'If you leave out Who or When, your listener is forced to turn your update into an interrogation.',
    greetingContext: 'Welcome to Level 8. 5W1H is the universal standard used by journalists, military commanders, and emergency responders to communicate events with total completeness.',
    whyItMatters: 'Eliminates back-and-forth friction by anticipating every factual dimension upfront.',
    whatYouWillUnderstand: 'How to deliver situation summaries that leave zero loose ends.',
    corePremise: 'A complete operational briefing covers Who, What, When, Where, Why, and How in under 45 seconds.',
    mechanisms: [
      'Comprehensive data coverage: Prevents omission of critical dependencies.',
      'Calm factual pacing: Replaces emotional storytelling with objective clarity.',
      'Immediate situational awareness: Puts all stakeholders on the exact same page.'
    ],
    commonPitfall: 'Focusing entirely on Why (the drama) while forgetting When, Where, or exactly Who was involved.',
    mentalModel: 'The Investigation Dossier: Fill out all six fields so the judge needs to ask nothing more.',
    weakContext: 'Briefing your director about a server outage that happened over the weekend.',
    weakResponse: 'Our servers totally crashed over the weekend! It was a disaster. The database went crazy and users were complaining on Twitter and everyone was panicking until we finally got it back online.',
    weakCritique: 'High emotion, zero actionable facts. When did it crash? Who noticed? Where was the failure? How was it fixed?',
    strongResponse: 'Our primary payments database (Where/What) experienced a deadlock outage on Saturday at 2:15 AM (When), affecting approximately 400 checkout attempts (Who). The issue occurred because an automated backup script exhausted system memory (Why). Our on-call engineering team restarted the service and isolated the script within 30 minutes, restoring full traffic by 2:45 AM (How).',
    strongBreakdown: 'Systematic delivery of all six components without emotional noise or missing metrics.',
    keyDistinction: 'Weak update creates panic; strong update creates calm situational mastery.',
    prompt: 'Brief your manager on a customer complaint that arrived this morning regarding delayed delivery.',
    scenario: 'Operations briefing.',
    frameworkGuidance: 'Cover Who (customer), What (complaint), When (timeline), Where (order route), Why (delay cause), How (resolution).',
    sampleFrameworkApplication: 'Who: Premium client Apex Corp. What: Reported missing shipment. When: Ordered Tuesday, delayed today. Where: Chicago distribution hub. Why: Weather reroute. How: Expedited courier dispatched with delivery by 3 PM.',
    placeholder: 'Who was involved? What happened? When? Where? Why? How was it resolved?',
    rule: 'When reporting an incident, answer the six questions before the listener has to ask them.',
    actionableHabit: 'Write your next status email using bullet points for Who, What, When, Why, and How.',
    closingReflection: 'Precision in facts eliminates panic in leadership.'
  },
  {
    levelNumber: 9,
    stageNumber: 2,
    title: 'Situation → Problem → Response',
    subtitle: 'Structured explanation of operational challenges and managerial crises',
    frameworkName: 'S-P-R Architecture',
    frameworkFormula: 'Situation (Baseline Context) → Problem (The Complication) → Response (The Action Taken)',
    frameworkSteps: [
      '1. Situation: Establish the normal state or context in 15 seconds.',
      '2. Problem: State the conflict or unexpected obstacle clearly.',
      '3. Response: Describe the immediate and strategic actions implemented.'
    ],
    idealSituations: ['Project updates', 'Problem reviews', 'Client escalation meetings'],
    headline: 'Do not tell people what you did until they understand the exact problem you were solving.',
    greetingContext: 'Welcome to Level 9. S-P-R provides the perfect narrative arc for business problem solving. It frames your actions as logical solutions to real challenges.',
    whyItMatters: 'Prevents listeners from judging your decisions prematurely by establishing the difficulty of the situation first.',
    whatYouWillUnderstand: 'How to structure crisis and challenge updates so leadership appreciates your composure.',
    corePremise: 'Set the baseline (Situation), define the break in reality (Problem), and reveal your calculated intervention (Response).',
    mechanisms: [
      'Contrast dynamics: Contrast between the normal state and the problem highlights the value of the response.',
      'Accountability display: Shows that when unexpected problems arise, you take decisive action.',
      'Forward momentum: Leaves the focus on the resolution rather than the blame.'
    ],
    commonPitfall: 'Spending 80% of the time complaining about the problem and rushing through the response in one sentence.',
    mentalModel: 'The Doctor’s Visit: Patient baseline (Situation) → Diagnosis (Problem) → Treatment plan (Response).',
    weakContext: 'Asked in a retrospective: "What happened with the marketing campaign delay?"',
    weakResponse: 'The creative agency completely dropped the ball. They sent us terrible assets on Friday, and nothing was ready, so we couldn’t launch. It was totally unacceptable on their part.',
    weakCritique: 'Sounds like helpless finger-pointing with no constructive solution or ownership.',
    strongResponse: 'We planned to launch our summer campaign across three channels on Monday (Situation). On Friday, our creative agency delivered video assets that did not meet our brand accessibility guidelines (Problem). Rather than launch flawed material, we deployed our internal design team to re-edit the top two videos over the weekend, allowing us to launch our primary channel today while the agency fixes the remainder (Response).',
    strongBreakdown: 'Context set → Exact hurdle defined professionally → Decisive leadership response detailed.',
    keyDistinction: 'Weak answer whines about blame; strong answer demonstrates proactive problem resolution.',
    prompt: 'Explain to your team why a scheduled software deployment had to be paused.',
    scenario: 'Team standup announcement.',
    frameworkGuidance: 'Follow Situation (planned release) → Problem (unexpected test failure) → Response (rollback and fix plan).',
    sampleFrameworkApplication: 'Situation: Version 2.4 was scheduled for release today. Problem: Final load testing revealed a memory spike at 5,000 concurrent users. Response: We paused the release, isolated the memory leak, and rescheduled deployment for tomorrow at 8 AM.',
    placeholder: 'Situation: ... Problem: ... Response: ...',
    rule: 'Never present a problem without immediately proposing your response.',
    actionableHabit: 'Whenever you escalate an issue to someone, always bring at least one proposed response.',
    closingReflection: 'Leadership is defined not by the absence of problems, but by the composure of your response.'
  },
  {
    levelNumber: 10,
    stageNumber: 2,
    title: 'Situation → Action → Result',
    subtitle: 'Demonstrate real-world impact and execution capability',
    frameworkName: 'SAR Framework',
    frameworkFormula: 'Situation (Context) → Action (What YOU Did) → Result (The Measurable Outcome)',
    frameworkSteps: [
      '1. Situation: Set up the environment and challenge in 1–2 sentences.',
      '2. Action: Focus specifically on the strategic and tactical steps you personally executed.',
      '3. Result: Conclude with the tangible, measurable outcome and business impact.'
    ],
    idealSituations: ['Behavioral interviews', 'Performance reviews', 'Case study presentations'],
    headline: 'Actions without measurable results sound like busywork; results without clear actions sound like luck.',
    greetingContext: 'Welcome to Level 10. The SAR framework is the undisputed gold standard for demonstrating personal competence in professional evaluations.',
    whyItMatters: 'Interviewer attention spikes when they hear tangible results. SAR connects your effort directly to business outcomes.',
    whatYouWillUnderstand: 'How to showcase your personal contribution without sounding arrogant or overly self-effacing.',
    corePremise: 'Set the stage (Situation), describe your deliberate initiative (Action), and prove the value with data (Result).',
    mechanisms: [
      'Attribution clarity: Uses "I decided", "I designed", and "I led" to clarify individual contribution.',
      'Outcome quantification: Concludes with percentages, hours saved, or dollars earned.',
      'Cognitive closure: Gives the story a triumphant, verified ending.'
    ],
    commonPitfall: 'Using "we" throughout the entire action section, leaving the evaluator unsure of what you actually contributed.',
    mentalModel: 'The Scoreboard: Name the game (Situation), highlight your key play (Action), show the final score (Result).',
    weakContext: 'Interview question: "Tell me about a time you improved an inefficient process."',
    weakResponse: 'At my last job our meetings were way too long. We spent all day in syncs. So we talked about it as a team and decided to do better, and things felt a lot smoother after that.',
    weakCritique: 'Completely vague. What did YOU do? What process changed? How do you know it was smoother?',
    strongResponse: 'Our engineering team was spending six hours a week in redundant status meetings, which delayed feature delivery (Situation). I designed an automated Slack check-in workflow and established a rule that meetings require a 24-hour agenda or they are canceled (Action). Within one month, we reduced meeting time by 65% and shipped our sprint backlog two days ahead of schedule (Result).',
    strongBreakdown: 'Crisp context with pain point → Specific personal system implemented → Quantified, verified outcome.',
    keyDistinction: 'Weak response offers vague feelings; strong response delivers hard metrics and personal leadership.',
    prompt: 'Describe a project where you resolved customer confusion or miscommunication.',
    scenario: 'Performance review discussion.',
    frameworkGuidance: 'Structure using Situation (what was confusing), Action (what you created/clarified), Result (measurable customer improvement).',
    sampleFrameworkApplication: 'Situation: Clients kept submitting support tickets on how to export reports. Action: I recorded a 60-second video walkthrough and placed it directly inside the export modal. Result: Related support tickets dropped 80% within two weeks.',
    placeholder: 'Situation: ... Action: ... Result: ...',
    rule: 'Anchor every story of your work in a measurable result.',
    actionableHabit: 'In your resume and self-reviews, rewrite every bullet point into Action + Result.',
    closingReflection: 'Competence becomes undeniable when backed by structured proof.'
  }
];

// Generate comprehensive data for Worlds 3 to 12 (Levels 11 to 75)
interface LevelFactoryInput {
  levelNumber: number;
  stageNumber: number;
  title: string;
  subtitle: string;
  frameworkName: string;
  frameworkFormula: string;
  frameworkSteps: string[];
  headline: string;
  corePremise: string;
  mechanisms: string[];
  commonPitfall: string;
  mentalModel: string;
  weakContext: string;
  weakResponse: string;
  weakCritique: string;
  strongResponse: string;
  strongBreakdown: string;
  prompt: string;
  scenario?: string;
  guidance: string;
  rule: string;
}

const EXTENDED_LEVEL_SEEDS: LevelFactoryInput[] = [
  // WORLD 3: EXPLAINING IDEAS (11 - 15)
  {
    levelNumber: 11,
    stageNumber: 3,
    title: 'Simple Explanation',
    subtitle: 'Explain a complicated idea using clean, accessible language',
    frameworkName: 'Feynman Simplification Method',
    frameworkFormula: 'De-jargonize → Everyday Metaphor → Concrete Verification',
    frameworkSteps: ['1. Strip away all technical acronyms', '2. Connect to an everyday physical concept', '3. Verify understanding'],
    headline: 'If you cannot explain it to a 12-year-old, you do not understand it deeply yourself.',
    corePremise: 'True mastery is the ability to explain complex concepts without hiding behind specialized jargon.',
    mechanisms: ['Conceptual distillation', 'Familiar analogical mapping', 'Cognitive accessibility'],
    commonPitfall: 'Using heavy technical terms to sound intelligent while alienating the listener.',
    mentalModel: 'The Translator: Converting foreign dialect into native spoken comfort.',
    weakContext: 'Explaining Cloud Computing to non-technical parents.',
    weakResponse: 'It is a distributed virtualization architecture leveraging multitenant server clusters with elasticity.',
    weakCritique: 'Completely opaque and alienating to the listener.',
    strongResponse: 'It is like renting electricity. Instead of building your own power generator in the backyard, you just plug into a giant power plant and pay for what you use.',
    strongBreakdown: 'Metaphorical grounding that anyone instantly understands.',
    prompt: 'Explain what an "API" is to someone who has never written code.',
    guidance: 'Use the restaurant waiter metaphor: You are customer, kitchen is system, waiter is API.',
    rule: 'Simplicity is the highest form of intellectual sophistication.'
  },
  {
    levelNumber: 12,
    stageNumber: 3,
    title: 'Definition → Explanation → Example',
    subtitle: 'The gold standard for educational and conceptual answers',
    frameworkName: 'D-E-E Framework',
    frameworkFormula: 'Definition (What it is) → Explanation (How it operates) → Example (Instance in reality)',
    frameworkSteps: ['1. Crisp single-sentence definition', '2. Deeper conceptual explanation', '3. Relatable concrete example'],
    headline: 'Never give an example before you have anchored the definition.',
    corePremise: 'Anchor identity first, explain dynamics second, illustrate third.',
    mechanisms: ['Progressive disclosure', 'Logical hierarchy', 'Episodic retention'],
    commonPitfall: 'Starting with an isolated example before the listener knows what category you are discussing.',
    mentalModel: 'The Tree: Root (Definition) → Trunk (Explanation) → Fruit (Example).',
    weakContext: 'Asked in training: "What is Technical Debt?"',
    weakResponse: 'Well like when we don’t write tests and then three months later everything crashes because code was rushed.',
    weakCritique: 'Jumps directly into a messy scenario without defining the term.',
    strongResponse: 'Technical debt is the implied future cost of taking quick shortcuts today (Definition). When you write quick, messy code to hit a deadline, you borrow time from the future that you eventually have to pay back with interest (Explanation). For example, skipping database indexing let us launch on Friday, but forced our engineers to spend three days fixing server timeouts next month (Example).',
    strongBreakdown: 'Clean boundary defined → Financial metaphor explained → Specific operational proof provided.',
    prompt: 'Explain "Cognitive Bias" using Definition → Explanation → Example.',
    guidance: 'Define it as a mental shortcut, explain why human brains evolved it, and give a quick example.',
    rule: 'Define the category before you describe the instance.'
  },
  {
    levelNumber: 13,
    stageNumber: 3,
    title: 'Compare and Contrast',
    subtitle: 'A vs B with meaningful differences instead of random descriptions',
    frameworkName: 'Matrix Contrast Framework',
    frameworkFormula: 'Common Ground → Dimension of Divergence → Contextual Recommendation',
    frameworkSteps: ['1. Acknowledge shared foundation', '2. Isolate 2 key criteria of difference', '3. Give recommendation based on use-case'],
    headline: 'Comparing is not listing features; comparing is illuminating trade-offs.',
    corePremise: 'Meaningful comparison evaluates options along clear criteria rather than rambling through disconnected facts.',
    mechanisms: ['Dimensional contrast', 'Trade-off transparency', 'Decision enabling'],
    commonPitfall: 'Describing option A for 2 minutes and option B for 2 minutes without matching criteria.',
    mentalModel: 'The Scale: Place both choices on the same balance along exact metric weights.',
    weakContext: 'A coworker asks: "Should we use React or Vue for our new portal?"',
    weakResponse: 'React is made by Meta and uses JSX. Vue has single file components and is made by Evan You. Both are nice.',
    weakCritique: 'Random trivia that offers zero decision-making clarity.',
    strongResponse: 'Both are modern, component-driven UI libraries (Common Ground). The core trade-off is ecosystem scale versus simplicity (Criterion). React has a vast hiring pool and ecosystem, which suits complex enterprise projects. Vue has a gentler learning curve and integrated tooling, making it faster for lean teams to ship immediately (Contrast). For our small team, Vue gets us to market faster (Recommendation).',
    strongBreakdown: 'Identified baseline → Isolated decision criterion → Provided contextual recommendation.',
    prompt: 'Compare working at a fast-growing startup versus an established corporate enterprise.',
    guidance: 'State the common ground (building a career), contrast learning velocity vs stability, and recommend who each fits.',
    rule: 'A comparison without clear decision criteria is just aimless description.'
  },
  {
    levelNumber: 14,
    stageNumber: 3,
    title: 'Cause → Effect',
    subtitle: 'Explain why something happens and what it produces downstream',
    frameworkName: 'Causal Chain Architecture',
    frameworkFormula: 'Trigger Mechanism (Cause) → Transmission Dynamics → Downstream Consequence (Effect)',
    frameworkSteps: ['1. Identify root driver', '2. Show how it influences the middle step', '3. Reveal the inevitable outcome'],
    headline: 'Show the domino falling, not just the mess on the floor.',
    corePremise: 'Connect root triggers directly to downstream consequences with clean logical links.',
    mechanisms: ['Causal tracing', 'Elimination of spurious correlation', 'Predictive clarity'],
    commonPitfall: 'Confusing correlation with causation or skipping the transmission mechanism.',
    mentalModel: 'The Domino Line: Push the first piece and trace the energy to the end.',
    weakContext: 'Explaining why team morale dipped this quarter.',
    weakResponse: 'Everyone is just tired and stressed out and nobody is smiling anymore.',
    weakCritique: 'Describes symptoms without revealing the systemic cause.',
    strongResponse: 'Three senior engineers departed last month without backfills (Cause). This forced our remaining developers to absorb double on-call shifts while maintaining the same sprint deadlines (Transmission). The resulting sleep deprivation and context-switching is what caused the noticeable drop in team morale and code quality (Effect).',
    strongBreakdown: 'Identified specific root event → Described operational mechanism → Proved the direct effect.',
    prompt: 'Explain how poor sleep causes decreased verbal communication clarity.',
    guidance: 'Trace from prefrontal cortex fatigue to slow word retrieval and increased filler words.',
    rule: 'Always reveal the transmission mechanism between the cause and the effect.'
  },
  {
    levelNumber: 15,
    stageNumber: 3,
    title: 'Problem → Cause → Solution',
    subtitle: 'Structured problem solving through communication',
    frameworkName: 'P-C-S Framework',
    frameworkFormula: 'Problem (Symptom) → Cause (Root Origin) → Solution (Actionable Fix)',
    frameworkSteps: ['1. Define the acute problem', '2. Expose the hidden root cause', '3. Prescribe the targeted solution'],
    headline: 'Do not treat symptoms with band-aids; treat the cause with structural fixes.',
    corePremise: 'Separate the painful symptom from the underlying disease before proposing the cure.',
    mechanisms: ['Root cause isolation', 'Symptom de-escalation', 'Solution targeting'],
    commonPitfall: 'Proposing solutions to surface symptoms while leaving the root cause untouched.',
    mentalModel: 'The Root System: Pull the weed from beneath the soil, don’t just snip the green leaf.',
    weakContext: 'Addressing high user drop-off during checkout.',
    weakResponse: 'Users are dropping off at checkout. We should send them 20% discount emails to win them back.',
    weakCritique: 'Treats the symptom with discounts without finding out why they left.',
    strongResponse: 'Our checkout drop-off rate jumped to 45% on the final payment page (Problem). Analytics showed that mandatory account registration with email verification was triggering user frustration on mobile devices (Root Cause). We should enable one-click guest checkout via Apple Pay and Google Pay to remove that barrier immediately (Solution).',
    strongBreakdown: 'Quantified problem → Diagnosed structural root cause → Prescribed targeted technical remedy.',
    prompt: 'A student is struggling to retain information after reading textbooks for 3 hours. Use Problem → Cause → Solution.',
    guidance: 'Problem: Low retention. Cause: Passive reading without testing. Solution: Active recall with flashcards.',
    rule: 'Diagnose the cause before prescribing the solution.'
  },

  // WORLD 4: OPINIONS AND ARGUMENTS (16 - 21)
  {
    levelNumber: 16,
    stageNumber: 4,
    title: 'Giving an Opinion',
    subtitle: 'Clearly state what you think without timid hedging or aggressive overreach',
    frameworkName: 'Firm Stance Architecture',
    frameworkFormula: 'Clean Verdict → Primary Premise → Welcoming of Dialogue',
    frameworkSteps: ['1. Remove qualifiers ("I could be wrong but...")', '2. State stance with quiet confidence', '3. Invite reasoned exchange'],
    headline: 'Hedging does not make you sound polite; it makes you sound unsure.',
    corePremise: 'State your position cleanly without self-diminishing apologies or aggressive bluster.',
    mechanisms: ['Assertion ownership', 'De-hedging', 'Poised equilibrium'],
    commonPitfall: 'Softening your opinion with so many apologies that your true thought disappears.',
    mentalModel: 'The Cornerstone: Placed firmly, square, and unmoving.',
    weakContext: 'Asked: "Do you think artificial intelligence will replace junior programmers?"',
    weakResponse: 'I mean, I don’t really know for sure and I am definitely no expert, but maybe sort of in some ways it might?',
    weakCritique: 'Full of self-erasing hedges that signal zero conviction.',
    strongResponse: 'In my view, AI will not replace junior programmers, but it will dramatically redefine their job. Developers who learn to steer AI tools effectively will outpace those who write code by hand from scratch.',
    strongBreakdown: 'Direct, clear perspective delivered without apologies or false bravado.',
    prompt: 'Give your clear opinion on whether social media should ban algorithmic recommendation feeds for teenagers.',
    guidance: 'State your position in one firm sentence without using "I am not sure but...".',
    rule: 'Own your perspective; never apologize for having a reasoned thought.'
  },
  {
    levelNumber: 17,
    stageNumber: 4,
    title: 'Opinion → Reason → Example',
    subtitle: 'Strengthen your reasoning into an airtight perspective',
    frameworkName: 'Reinforced Stance Loop',
    frameworkFormula: 'Stance (Clear claim) → Strategic Justification → Observable Proof Point',
    frameworkSteps: ['1. Direct stance', '2. Deep reasoning mechanism', '3. Tangible observational proof'],
    headline: 'Opinions are cheap; grounded reasoning is valuable.',
    corePremise: 'Solidify your viewpoint by immediately tying it to cause-and-effect and verified instances.',
    mechanisms: ['Logical scaffolding', 'Empirical grounding', 'Debate resilience'],
    commonPitfall: 'Stacking three opinions on top of each other without a single real-world proof point.',
    mentalModel: 'The Concrete Pillar: Stance is the frame, Reason is the rebar, Example is the poured stone.',
    weakContext: 'Asked: "Is higher education still worth the investment today?"',
    weakResponse: 'Yes it is good because degrees are important and companies like degrees.',
    weakCritique: 'Circular assertion that convinces nobody.',
    strongResponse: 'Higher education remains deeply valuable (Opinion) because it builds structured critical thinking and social networks that are difficult to replicate in self-study (Reason). For instance, 70% of tech founders cite their university roommates and early alumni networks as their primary source of initial capital and key hires (Example).',
    strongBreakdown: 'Clear stance → Multi-layered rationale → Concrete industry data point.',
    prompt: 'Use Opinion → Reason → Example to argue whether remote work improves or hurts company culture.',
    guidance: 'Pick one side, provide a cultural/human reason, and illustrate with a specific team practice.',
    rule: 'An opinion reinforced with reason and example is impossible to dismiss casually.'
  },
  {
    levelNumber: 18,
    stageNumber: 4,
    title: 'Agreeing Clearly',
    subtitle: 'Agree with substance instead of merely saying "Yes, I agree"',
    frameworkName: 'Value-Add Agreement',
    frameworkFormula: 'Affirmation of Core Point + Additional Dimension + Practical Extension',
    frameworkSteps: ['1. Affirm the exact merit in their statement', '2. Add one fresh angle or insight', '3. Extend to action'],
    headline: 'Merely saying "I agree" adds zero momentum to a conversation.',
    corePremise: 'True agreement is additive. You validate the speaker’s premise and build the next floor of the building.',
    mechanisms: ['Validating alignment', 'Additive contribution', 'Collaborative momentum'],
    commonPitfall: 'Repeating the other person’s exact sentence in different words.',
    mentalModel: 'The Relay Baton: Take their insight and sprint the next 50 meters forward.',
    weakContext: 'Colleague says: "We need to simplify our signup flow because users get overwhelmed."',
    weakResponse: 'Yes, I agree. I totally agree with that.',
    weakCritique: 'Dead end. Leaves the room sitting in silence.',
    strongResponse: 'I completely agree with simplifying the flow, especially on mobile. If we remove the phone verification step during initial signup and defer it until their first transaction, we can likely increase completion rates by 20%.',
    strongBreakdown: 'Direct agreement → Specific mobile focal point added → Concrete tactical benefit proposed.',
    prompt: 'Your colleague says: "Team members should have dedicated quiet hours without Slack notifications."',
    guidance: 'Agree, add a specific insight about deep cognitive work, and propose how to implement it.',
    rule: 'Never just agree; validate their premise and add one brick to the wall.'
  },
  {
    levelNumber: 19,
    stageNumber: 4,
    title: 'Disagreeing Clearly',
    subtitle: 'Respectful, poised disagreement anchored in principles, not personality',
    frameworkName: 'Principled Disagreement',
    frameworkFormula: 'Acknowledge Intent / Shared Goal → Isolate the Point of Divergence → Present Alternative Path',
    frameworkSteps: ['1. Validate the shared positive intention', '2. Frame difference around criteria, not competence', '3. Propose reasoned alternative'],
    headline: 'Disagree with the hypothesis, never attack the person.',
    corePremise: 'You can disagree completely while making the other person feel respected and intellectually valued.',
    mechanisms: ['Intent validation', 'Depersonalized framing', 'Constructive counter-proposal'],
    commonPitfall: 'Starting with "You are wrong" or attacking the other person’s intelligence.',
    mentalModel: 'Two Architects: Both want a sturdy bridge, but you are pointing out a soil fissure under one pillar.',
    weakContext: 'A coworker proposes slashing QA testing time to hit an artificial deadline.',
    weakResponse: 'That is a ridiculous idea. You clearly don’t understand how software works.',
    weakCritique: 'Aggressive attack that triggers immediate defensive hostility.',
    strongResponse: 'I completely share your urgency to hit our launch target on Friday (Shared Goal). However, skipping regression testing introduces a high risk of payment outages in production (Point of Divergence). What if we launch on Friday with the core feature set, but disable the experimental beta tab until it finishes full testing on Monday (Alternative)?',
    strongBreakdown: 'Aligned on goal → Highlighted objective risk → Offered workable compromise.',
    prompt: 'Disagree with a manager who wants everyone to work mandatory weekends to make up for a missed deadline.',
    guidance: 'Acknowledge deadline pressure, explain why weekend fatigue creates more bugs, and offer an alternative.',
    rule: 'Validate the goal before you challenge the method.'
  },
  {
    levelNumber: 20,
    stageNumber: 4,
    title: 'Supporting a Claim',
    subtitle: 'Provide verifiable evidence, logic, or case precedent',
    frameworkName: 'Evidence Anchoring',
    frameworkFormula: 'Bold Claim → Independent Evidence / Precedent → Logical Bridge',
    frameworkSteps: ['1. Articulate the claim', '2. Bring third-party proof or verified data', '3. Show why the proof applies here'],
    headline: 'A claim without evidence is just wishful thinking.',
    corePremise: 'Back every significant recommendation with external data, historical precedent, or mathematical logic.',
    mechanisms: ['Empirical authority', 'Precedent citation', 'Deductive bridging'],
    commonPitfall: 'Quoting unverified rumors or using "Everyone knows that..." as evidence.',
    mentalModel: 'The Subpoena: Present the exhibits to court before demanding a verdict.',
    weakContext: 'Claiming in a budget meeting: "Our website is way too slow."',
    weakResponse: 'Our website feels super sluggish on my laptop and my brother said it took forever to load.',
    weakCritique: 'Subjective anecdotes that finance and engineering can easily brush aside.',
    strongResponse: 'Our website load times are directly costing us conversions (Claim). Google Lighthouse telemetry shows our mobile landing page takes 4.8 seconds to load, while industry benchmark research shows every second beyond 2 seconds decreases checkout by 7% (Evidence). Fixing our image bundle will immediately recover lost checkout revenue (Bridge).',
    strongBreakdown: 'Clear commercial claim → Objective telemetry and empirical research cited → Direct financial link forged.',
    prompt: 'Support the claim that regular physical exercise improves cognitive performance at work.',
    guidance: 'Cite biological evidence (blood flow, neurogenesis) or reputable productivity studies.',
    rule: 'Replace subjective feelings with objective measurements.'
  },
  {
    levelNumber: 21,
    stageNumber: 4,
    title: 'Handling "Why?"',
    subtitle: 'Maintain structure and composure when someone aggressively challenges your answer',
    frameworkName: 'The Multi-Tier Why Defense',
    frameworkFormula: 'Pause & Breathe → Root Principle → First-Principles Justification',
    frameworkSteps: ['1. Welcome the challenge without defensiveness', '2. Elevate to core underlying principle', '3. Show first-principles logic'],
    headline: 'When challenged with "Why?", do not panic; it is an invitation to display depth.',
    corePremise: 'A challenge is not an attack; it is an opportunity to reveal the foundational bedrock beneath your position.',
    mechanisms: ['Defensiveness de-escalation', 'First-principles grounding', 'Emotional steadiness'],
    commonPitfall: 'Getting flustered, blushing, and retreating with "Well, that is just my opinion."',
    mentalModel: 'The Iceberg: You showed the tip of the ice; now calmly reveal the mountain beneath the water.',
    weakContext: 'You propose cutting an old feature and an executive sharply asks: "Why on earth would we do that?"',
    weakResponse: 'Uh, well... because I just thought it would be cleaner? But we don’t have to if you don’t like it.',
    weakCritique: 'Collapses instantly under the slightest pressure.',
    strongResponse: 'Because less than 1% of our active users clicked that tab in the last 90 days, yet maintaining it consumes 25% of our monthly QA testing budget. Sunsetting it frees up two full engineers to accelerate our core mobile redesign.',
    strongBreakdown: 'Zero fluster → Hard usage metrics delivered → Strategic reallocation upside demonstrated.',
    prompt: 'You recommend declining a lucrative client project because it does not match your team’s expertise. A teammate asks: "Why?"',
    scenario: 'Internal team strategy meeting.',
    guidance: 'State the long-term cost of taking off-brand work and the risk of client dissatisfaction.',
    rule: 'When someone asks why, step down from opinion into first principles.'
  }
];

// Combine blueprints for Worlds 1 to 4 and Worlds 5 to 12
export const ALL_LEVEL_BLUEPRINTS: JourneyLevelData[] = [
  // Levels 1 - 10 from RAW_LEVELS
  ...RAW_LEVELS.map(l => ({
    levelNumber: l.levelNumber,
    stageNumber: l.stageNumber,
    stageId: JOURNEY_STAGES[l.stageNumber - 1].id,
    stageTitle: JOURNEY_STAGES[l.stageNumber - 1].title,
    title: l.title,
    subtitle: l.subtitle,
    frameworkName: l.frameworkName,
    frameworkFormula: l.frameworkFormula,
    frameworkSteps: l.frameworkSteps,
    estimatedMinutes: 8,
    whenToUse: {
      idealSituations: l.idealSituations,
      whenToAvoid: l.whenToAvoid
    },
    introduction: {
      headline: l.headline,
      greetingContext: l.greetingContext,
      whyItMatters: l.whyItMatters,
      whatYouWillUnderstand: l.whatYouWillUnderstand,
      connectionToMastery: 'Internalizing this framework eliminates hesitation and builds instinctual confidence.'
    },
    coreExplanation: {
      corePremise: l.corePremise,
      mechanisms: l.mechanisms,
      commonPitfall: l.commonPitfall,
      mentalModel: l.mentalModel
    },
    frameworkExamples: [
      {
        context: l.weakContext,
        weakResponse: l.weakResponse,
        weakCritique: l.weakCritique,
        strongResponse: l.strongResponse,
        strongBreakdown: l.strongBreakdown,
        keyDistinction: l.keyDistinction
      }
    ],
    exercise: {
      prompt: l.prompt,
      scenario: l.scenario,
      frameworkGuidance: l.frameworkGuidance,
      sampleFrameworkApplication: l.sampleFrameworkApplication,
      placeholder: l.placeholder
    },
    questions: [
      {
        q: l.prompt,
        guide: l.frameworkGuidance,
        placeholder: l.placeholder,
        focus: l.frameworkName
      }
    ],
    keyPrinciple: {
      rule: l.rule,
      actionableHabit: l.actionableHabit,
      closingReflection: l.closingReflection
    },
    corePremise: l.corePremise
  })),

  // Levels 11 - 21 from EXTENDED_LEVEL_SEEDS
  ...EXTENDED_LEVEL_SEEDS.map(s => ({
    levelNumber: s.levelNumber,
    stageNumber: s.stageNumber,
    stageId: JOURNEY_STAGES[s.stageNumber - 1].id,
    stageTitle: JOURNEY_STAGES[s.stageNumber - 1].title,
    title: s.title,
    subtitle: s.subtitle,
    frameworkName: s.frameworkName,
    frameworkFormula: s.frameworkFormula,
    frameworkSteps: s.frameworkSteps,
    estimatedMinutes: 8,
    whenToUse: {
      idealSituations: ['Professional discussions', 'Presentations', 'High-stakes dialogue']
    },
    introduction: {
      headline: s.headline,
      greetingContext: `Welcome to Level ${s.levelNumber}. Here we master ${s.frameworkName} so you can think and communicate with structured impact.`,
      whyItMatters: 'Structuring your thoughts gives your audience immediate clarity.',
      whatYouWillUnderstand: `How ${s.frameworkName} transforms messy ideas into compelling communication.`,
      connectionToMastery: 'Practicing this principle refines your ability to express complex thoughts simply.'
    },
    coreExplanation: {
      corePremise: s.corePremise,
      mechanisms: s.mechanisms,
      commonPitfall: s.commonPitfall,
      mentalModel: s.mentalModel
    },
    frameworkExamples: [
      {
        context: s.weakContext,
        weakResponse: s.weakResponse,
        weakCritique: s.weakCritique,
        strongResponse: s.strongResponse,
        strongBreakdown: s.strongBreakdown,
        keyDistinction: 'Weak response lacks structured thinking; strong response demonstrates organized intent.'
      }
    ],
    exercise: {
      prompt: s.prompt,
      scenario: 'Real-world communication scenario',
      frameworkGuidance: s.guidance,
      sampleFrameworkApplication: 'Follow the core steps of the framework to construct your response.',
      placeholder: 'Construct your structured answer here...'
    },
    questions: [
      {
        q: s.prompt,
        guide: s.guidance,
        placeholder: 'Construct your structured answer here...',
        focus: s.frameworkName
      }
    ],
    keyPrinciple: {
      rule: s.rule,
      actionableHabit: `Practice using ${s.frameworkName} in at least one conversation today.`,
      closingReflection: 'Clarity in thought precedes authority in speech.'
    },
    corePremise: s.corePremise
  }))
];

// Helper to fill remaining levels 22 to 75 programmatically with rich curriculum titles & concepts
const LEVEL_DEFINITIONS_22_TO_75: Array<{
  levelNumber: number;
  stageNumber: number;
  title: string;
  subtitle: string;
  frameworkName: string;
  frameworkFormula: string;
  prompt: string;
  guidance: string;
  corePremise: string;
}> = [
  // WORLD 5: STORYTELLING FRAMEWORKS (22 - 27)
  {
    levelNumber: 22,
    stageNumber: 5,
    title: 'Why Stories Work',
    subtitle: 'The communication function of narrative over raw data',
    frameworkName: 'The Narrative Transmission Principle',
    frameworkFormula: 'Human Relatability + Emotional Stakes + Universal Lesson',
    prompt: 'Why do teams remember a customer failure story far more vividly than a spreadsheet of drop-off metrics?',
    guidance: 'Explain how narrative memory activates emotional empathy and creates lasting behavioral change.',
    corePremise: 'Data tells; stories demonstrate. A well-crafted story communicates human stakes that spreadsheets cannot.'
  },
  {
    levelNumber: 23,
    stageNumber: 5,
    title: 'Beginning → Middle → End',
    subtitle: 'Classic narrative pacing without losing direction',
    frameworkName: 'Three-Act Arc',
    frameworkFormula: 'Beginning (Status Quo) → Middle (The Journey/Struggle) → End (Transformation)',
    prompt: 'Tell a 60-second story about a difficult skill you learned from scratch.',
    guidance: 'Set the initial struggle (Beginning), describe the practice hurdle (Middle), and celebrate the breakthrough (End).',
    corePremise: 'Every great narrative carries a beginning that anchors context, a middle that explores tension, and an end that delivers meaning.'
  },
  {
    levelNumber: 24,
    stageNumber: 5,
    title: 'Situation → Conflict → Resolution',
    subtitle: 'Create meaningful narrative tension that hooks the listener',
    frameworkName: 'S-C-R Framework',
    frameworkFormula: 'Situation (Comfort) → Conflict (Disruption) → Resolution (Mastery)',
    prompt: 'Describe a moment when unexpected technology failure threatened an important presentation.',
    guidance: 'Frame the baseline, highlight the spike of conflict, and show the calm resolution.',
    corePremise: 'Without conflict, a story is just a dry status log. Tension creates engagement.'
  },
  {
    levelNumber: 25,
    stageNumber: 5,
    title: 'STAR Framework',
    subtitle: 'The premier interview storytelling framework',
    frameworkName: 'S-T-A-R Framework',
    frameworkFormula: 'Situation → Task → Action → Result',
    prompt: 'Answer the interview question: "Tell me about a time you handled a toxic team disagreement."',
    guidance: 'Brief Situation & Task, spend 60% of time on your specific personal Actions, and end with the positive Result.',
    corePremise: 'STAR ensures behavioral interview answers showcase individual agency and tangible outcomes.'
  },
  {
    levelNumber: 26,
    stageNumber: 5,
    title: 'Making Stories Relevant',
    subtitle: 'Aggressively cut unnecessary details that dilute your point',
    frameworkName: 'Narrative Signal Filtering',
    frameworkFormula: 'Audit Every Detail → Ask "Does this serve the main insight?" → Cut the Fluff',
    prompt: 'Share a mistake you made early in your career, cutting out names of restaurants, exact dates, and irrelevant setup.',
    guidance: 'Focus purely on the decision, the error, and the lesson learned.',
    corePremise: 'A story dies when loaded with irrelevant logistical details. Keep only the signal; eliminate the noise.'
  },
  {
    levelNumber: 27,
    stageNumber: 5,
    title: 'Story With a Point',
    subtitle: 'Story → Meaning rather than rambling without purpose',
    frameworkName: 'Story-Moral Bridge',
    frameworkFormula: 'Anecdote → Explicit Insight → Audience Application',
    prompt: 'Tell a brief personal story that illustrates why patience is more valuable than speed in complex projects.',
    guidance: 'Conclude with a punchline that directly ties your story to the listener’s daily work.',
    corePremise: 'Never tell a story just to talk about yourself. The story must serve as a gift of insight to the listener.'
  },

  // WORLD 6: ANSWERING REAL QUESTIONS (28 - 33)
  {
    levelNumber: 28,
    stageNumber: 6,
    title: '"Tell Me About Yourself"',
    subtitle: 'A structured answer that highlights trajectory, not a resume reading',
    frameworkName: 'Present → Past → Future',
    frameworkFormula: 'Where I am today (Present) → How I got here (Past) → Where I am heading next (Future)',
    prompt: 'Deliver your 90-second "Tell me about yourself" response for your dream role.',
    guidance: 'Start with your current identity and top skill, trace key formative experiences, and explain why this conversation is your logical next step.',
    corePremise: 'People don’t want your chronological life history. They want to understand your trajectory.'
  },
  {
    levelNumber: 29,
    stageNumber: 6,
    title: '"What Do You Think?"',
    subtitle: 'Opinion response framework under spot illumination',
    frameworkName: 'Instant Stance Architecture',
    frameworkFormula: 'Immediate Headline Stance → Two Supporting Pillars → Tradeoff Awareness',
    prompt: 'A director turns to you abruptly: "What do you think of switching our entire team to a four-day work week?"',
    guidance: 'Deliver your point first, follow with two clear productivity or cultural pillars, and address one operational nuance.',
    corePremise: 'When put on the spot, summarize your stance in five words before elaborating.'
  },
  {
    levelNumber: 30,
    stageNumber: 6,
    title: '"Why Should We Choose You?"',
    subtitle: 'Persuasive, value-focused response without arrogance',
    frameworkName: 'Value-Match Triad',
    frameworkFormula: 'Your Core Need + My Proven Capability + Our Cultural Multiplication',
    prompt: 'Answer: "Why should we hire you over other candidates with identical qualifications?"',
    guidance: 'Focus on your unique intersection of skills and your track record of taking proactive ownership.',
    corePremise: 'Do not talk about why the job is good for you; prove how your specific strengths solve their urgent pain.'
  },
  {
    levelNumber: 31,
    stageNumber: 6,
    title: '"What Is Your Weakness?"',
    subtitle: 'Honest, self-aware, and intelligently structured answer',
    frameworkName: 'Real Vulnerability + Active Mitigation System',
    frameworkFormula: 'Genuine Tendency (Not a fake humblebrag) → Past Cost → Systematic Guardrail Implemented',
    prompt: 'Answer the question: "What is your biggest professional weakness?"',
    guidance: 'Avoid "I work too hard." Name a genuine tendency (e.g. over-perfecting details) and describe the exact tool or checklist you use to govern it.',
    corePremise: 'Weakness answers test self-awareness and self-management, not perfection.'
  },
  {
    levelNumber: 32,
    stageNumber: 6,
    title: '"What Would You Do?"',
    subtitle: 'Hypothetical scenario responses that show structured problem solving',
    frameworkName: 'Scenario Triage Framework',
    frameworkFormula: 'Clarify Variables → State Guiding Principle → Phase 1 Immediate Action → Phase 2 Strategic Resolution',
    prompt: 'A client calls screaming that their database was deleted by our update. What would you do in the first 30 minutes?',
    guidance: 'Stay calm. De-escalate emotions, verify backup snapshots, communicate timeline, and investigate root cause.',
    corePremise: 'In hypothetical emergencies, interviewers evaluate your emotional stability and methodical triage sequence.'
  },
  {
    levelNumber: 33,
    stageNumber: 6,
    title: 'Unexpected Questions',
    subtitle: 'Construct an answer when you have zero prepared notes',
    frameworkName: 'The Stall & Structure Protocol',
    frameworkFormula: 'Reflect the Question → Pick a Lens (Financial | Cultural | Technical) → PREP Delivery',
    prompt: 'In an interview: "If you had a budget of $10,000 to improve human happiness in our city, what would you spend it on?"',
    guidance: 'Acknowledge the creative question, pick one specific angle (e.g., community reading libraries), and defend it with PREP.',
    corePremise: 'Unexpected questions evaluate cognitive agility. Pick a clear lane and drive down it with structure.'
  },

  // WORLD 7: THINKING WHILE SPEAKING (34 - 39)
  {
    levelNumber: 34,
    stageNumber: 7,
    title: 'Organizing Thoughts Quickly',
    subtitle: 'The 2-second mental filing system before answering',
    frameworkName: 'The 3-Bucket Filing Method',
    frameworkFormula: 'Bucket 1 (Now) → Bucket 2 (Next) → Bucket 3 (Future)',
    prompt: 'Organize your thoughts on how your team should prepare for an upcoming corporate audit.',
    guidance: 'Name three buckets (Immediate documentation audit, team training, mock review) and address them in sequence.',
    corePremise: 'Chunking information into three mental buckets prevents conversational chaos.'
  },
  {
    levelNumber: 35,
    stageNumber: 7,
    title: 'Don’t Say Everything',
    subtitle: 'Information filtering and respecting listener bandwidth',
    frameworkName: 'The 80/20 Speech Filter',
    frameworkFormula: 'Identify the 20% Vital Core → Deliver It Crisp → Hold 80% for Q&A',
    prompt: 'Summarize a complex 20-page product specification in exactly three sentences.',
    guidance: 'State the core goal, the primary architectural choice, and the delivery timeline.',
    corePremise: 'Excellence in communication is defined not by what you say, but by what you choose to leave out.'
  },
  {
    levelNumber: 36,
    stageNumber: 7,
    title: 'One Idea at a Time',
    subtitle: 'Monotasking your verbal output to eliminate run-on sentences',
    frameworkName: 'Discrete Thought Pacing',
    frameworkFormula: 'Idea 1 → Full Stop Period → Silence → Idea 2',
    prompt: 'Explain why your company needs to invest in ergonomic office chairs without using run-on conjunctions like "and also".',
    guidance: 'Use short, punchy sentences with deliberate full stops.',
    corePremise: 'Deliver one thought, let it land with a full stop, breathe, and deliver the next.'
  },
  {
    levelNumber: 37,
    stageNumber: 7,
    title: 'Linking Ideas',
    subtitle: 'Smooth transitions between concepts without jarring jumps',
    frameworkName: 'Conversational Signposting',
    frameworkFormula: 'Review ("Having covered X...") + Bridge ("...the next logical step is...") + Preview ("...Y")',
    prompt: 'Transition smoothly from discussing the cost of customer acquisition to discussing customer retention strategies.',
    guidance: 'Use a transitional bridge that highlights why acquisition without retention is a leaky bucket.',
    corePremise: 'Signposts act as road signs that tell the listener where your argument is traveling.'
  },
  {
    levelNumber: 38,
    stageNumber: 7,
    title: 'Recovering When You Lose Your Thought',
    subtitle: 'Regain structure without panic or awkward apologies',
    frameworkName: 'The Poised Reset Protocol',
    frameworkFormula: 'Pause with Dignity → Summarize Last Verified Ground → Pivot Back to Core Objective',
    prompt: 'You are midway through explaining a complex financial model and completely lose your train of thought. Deliver your recovery.',
    guidance: 'Do not apologize or act ashamed. Say: "Let me pull back to the primary point here: [core metric]."',
    corePremise: 'Losing your thought is normal; panicking is optional. A calm reset actually signals executive poise.'
  },
  {
    levelNumber: 39,
    stageNumber: 7,
    title: 'Answering Under Pressure',
    subtitle: 'Framework selection when time and scrutiny are intense',
    frameworkName: 'The Pressure-Lock Selection',
    frameworkFormula: 'High stakes → Fall back on PREP or What/Why/How → Suppress all improvisation',
    prompt: 'A furious client demands to know why their invoice increased by 15%. Respond under pressure.',
    guidance: 'Use PREP: Acknowledge the line item, explain the scope expansion, give the exact project instance, and confirm next steps.',
    corePremise: 'Under pressure, you do not rise to the occasion; you sink to the level of your training.'
  },

  // WORLD 8: ADVANCED COMMUNICATION FRAMEWORKS (40 - 45)
  {
    levelNumber: 40,
    stageNumber: 8,
    title: 'Claim → Evidence → Explanation',
    subtitle: 'Toulmin-style argument structure for persuasive authority',
    frameworkName: 'C-E-E Architecture',
    frameworkFormula: 'Claim (Stance) → Evidence (Empirical Grounding) → Explanation (Warrant / Logic)',
    prompt: 'Make an argument that mandatory return-to-office mandates decrease employee retention among senior engineers.',
    guidance: 'State the claim, cite industry survey data, and explain the psychological connection to autonomy.',
    corePremise: 'Evidence alone is not enough; you must provide the explanation that bridges evidence to your claim.'
  },
  {
    levelNumber: 41,
    stageNumber: 8,
    title: 'Problem → Options → Recommendation',
    subtitle: 'The executive decision-making communication model',
    frameworkName: 'P-O-R Framework',
    frameworkFormula: 'Problem Briefing → Options (Trade-offs of A, B, C) → Definite Recommendation',
    prompt: 'Your database cannot handle Black Friday traffic. Present three options and your firm recommendation to the CTO.',
    guidance: 'Problem: Traffic bottleneck. Options: Vertically scale, shard database, or queue checkouts. Recommendation: Sharding with vertical backup.',
    corePremise: 'Executives do not want problems without options, and they do not want options without a firm recommendation.'
  },
  {
    levelNumber: 42,
    stageNumber: 8,
    title: 'Before → Change → After',
    subtitle: 'The transformation narrative for case studies and impact reviews',
    frameworkName: 'Transformation Arc',
    frameworkFormula: 'Before (The Painful Reality) → The Catalyst Change → After (The New Standard)',
    prompt: 'Describe how introducing automated testing transformed your team’s delivery speed.',
    guidance: 'Show the pain before, the cultural change made, and the measurable velocity after.',
    corePremise: 'People evaluate value through contrast. Show how bad the past was to illuminate the brilliance of the present.'
  },
  {
    levelNumber: 43,
    stageNumber: 8,
    title: 'Context → Point → Implication',
    subtitle: 'Sophisticated explanations for boardrooms and thought leadership',
    frameworkName: 'C-P-I Strategic Framework',
    frameworkFormula: 'Context (Macro Trend) → Point (Our Move) → Implication (Future Competitive Edge)',
    prompt: 'Explain why your startup must integrate local on-device AI models rather than relying solely on cloud APIs.',
    guidance: 'Context: Privacy regulations and latency. Point: Adopt edge inference. Implication: Defense against cloud outages and privacy compliance.',
    corePremise: 'Strategic communication moves from the macro environment to internal action to future consequence.'
  },
  {
    levelNumber: 44,
    stageNumber: 8,
    title: 'Principle → Example → Application',
    subtitle: 'Conceptual communication for leadership and coaching',
    frameworkName: 'P-E-A Architecture',
    frameworkFormula: 'Timeless Principle → Historic/Real Example → Immediate Operational Application',
    prompt: 'Teach the principle of "Extreme Ownership" to a team of junior leads.',
    guidance: 'State the principle, illustrate with a project failure where leadership took responsibility, and show how to apply it today.',
    corePremise: 'Principles inspire the mind; examples prove the logic; applications drive immediate behavior.'
  },
  {
    levelNumber: 45,
    stageNumber: 8,
    title: 'Layered Answers',
    subtitle: 'Short answer first; invite deeper exploration only if desired',
    frameworkName: 'Executive Accordion Technique',
    frameworkFormula: 'Tier 1 (15-second summary) + "Would you like me to unpack the technical details?"',
    prompt: 'Answer the CEO’s question: "Are we secure against the recent zero-day vulnerability?"',
    guidance: 'Tier 1: Yes, fully patched this morning. Offer Tier 2: Offer to explain the firewall rule changes if they want technical depth.',
    corePremise: 'Deliver the headline. Let the executive decide whether they want the footnotes.'
  },

  // WORLD 9: ADAPTING THE SAME ANSWER (46 - 51)
  {
    levelNumber: 46,
    stageNumber: 9,
    title: 'Answering a Friend',
    subtitle: 'Informal, empathetic, high-warmth communication',
    frameworkName: 'Warmth-First Calibration',
    frameworkFormula: 'Emotional Resonance + Direct Casual Truth + Shared Intimacy',
    prompt: 'A close friend asks: "Why did you decide to change careers into software development?"',
    guidance: 'Speak authentically, share personal motivation, and drop formal professional jargon.',
    corePremise: 'With friends, connection and emotional honesty take precedence over corporate polish.'
  },
  {
    levelNumber: 47,
    stageNumber: 9,
    title: 'Answering a Teacher',
    subtitle: 'Respectful, intellectually curious, and open to guidance',
    frameworkName: 'Scholarly Inquiry Frame',
    frameworkFormula: 'Demonstrate Preparation + State Current Hypothesis + Request Nuanced Critique',
    prompt: 'Ask your professor or mentor why your approach to solving an algorithm was less efficient than dynamic programming.',
    guidance: 'Show what you tried, highlight your curiosity, and demonstrate respect for their expertise.',
    corePremise: 'When speaking to mentors, show that you did the preliminary thinking before asking for help.'
  },
  {
    levelNumber: 48,
    stageNumber: 9,
    title: 'Answering an Interviewer',
    subtitle: 'Competence-focused, structured, and outcome-oriented',
    frameworkName: 'Professional Value Alignment',
    frameworkFormula: 'Strategic Competence + Quantified Evidence + Cultural Alignment',
    prompt: 'Answer the question: "Why did you leave your previous role?" for a senior recruiter.',
    guidance: 'Never badmouth past employers. Frame the move as seeking bigger technical scale and leadership impact.',
    corePremise: 'In interviews, every answer is an audition of how you will represent the company.'
  },
  {
    levelNumber: 49,
    stageNumber: 9,
    title: 'Answering a Professional',
    subtitle: 'Peer-to-peer technical respect and precise terminology',
    frameworkName: 'Colleague-to-Colleague Symmetry',
    frameworkFormula: 'Shared Professional Context + Technical Rigor + Collaborative Respect',
    prompt: 'Explain to a senior staff engineer why you chose PostgreSQL over MongoDB for a financial ledger.',
    guidance: 'Focus on ACID transactions, schema enforcement, and relational consistency.',
    corePremise: 'Peer professionals respect exact technical precision and honest trade-off acknowledgment.'
  },
  {
    levelNumber: 50,
    stageNumber: 9,
    title: 'Answering a Stranger',
    subtitle: 'Accessible, non-threatening, and engaging clarity',
    frameworkName: 'The Universal Welcoming Frame',
    frameworkFormula: 'Friendly Demeanor + High-Level Essence + Zero Insider Jargon',
    prompt: 'A curious stranger on an airplane asks: "What kind of work do you do?"',
    guidance: 'Explain your profession in human terms that anyone can understand and relate to.',
    corePremise: 'With strangers, accessibility and human warmth open the door to connection.'
  },
  {
    levelNumber: 51,
    stageNumber: 9,
    title: 'Same Idea, Different Audience',
    subtitle: 'Translate the exact same concept across three different registers',
    frameworkName: 'The Chameleon Translation Protocol',
    frameworkFormula: 'Same Core Message → Modulate Vocabulary, Depth, and Tone per Audience',
    prompt: 'Explain "Why we need to refactor our code" to: 1) A junior dev, 2) The non-technical CEO, 3) Your peer engineer.',
    guidance: 'Show the adaptation: Junior dev (learning best practices), CEO (cost of future delays), Peer (reducing technical debt).',
    corePremise: 'True mastery is the ability to communicate the same truth in three distinct languages.'
  },

  // WORLD 10: CONVERSATIONAL MASTERY (52 - 58)
  {
    levelNumber: 52,
    stageNumber: 10,
    title: 'Asking Better Questions',
    subtitle: 'Move past superficial inquiries to unlock real depth',
    frameworkName: 'Catalytic Questioning',
    frameworkFormula: 'Open-ended premise + Emotional or strategic depth + Generous silence',
    prompt: 'Instead of asking a friend "How was your day?", ask a catalytic question that unlocks genuine reflection.',
    guidance: 'Ask: "What was the most energizing moment of your week?" or "What problem is taking up the most space in your head?"',
    corePremise: 'The quality of your conversations is determined by the quality of questions you dare to ask.'
  },
  {
    levelNumber: 53,
    stageNumber: 10,
    title: 'Follow-up Questions',
    subtitle: 'The second question that proves you were actually listening',
    frameworkName: 'The Thread-Pull Technique',
    frameworkFormula: 'Anchor on a specific word they said + Ask for the emotional or logical driver behind it',
    prompt: 'Someone says: "Our team shipped the feature on time, but it felt exhausting." Ask the ideal follow-up question.',
    guidance: 'Do not say "Good job!" Ask: "What part of the process caused the exhaustion?"',
    corePremise: 'Anyone can ask the first question. Masters are defined by their second question.'
  },
  {
    levelNumber: 54,
    stageNumber: 10,
    title: 'Responding to What Someone Actually Said',
    subtitle: 'Suppressing your internal script to engage the real words spoken',
    frameworkName: 'Reflective Mirroring & Response',
    frameworkFormula: 'Echo key insight ("You mentioned X...") + Build your perspective on their reality',
    prompt: 'A colleague shares: "I am worried our new pricing will alienate our earliest loyal users." Respond directly.',
    guidance: 'Do not defend the pricing model immediately. First validate their concern for early loyalists.',
    corePremise: 'Most people listen to reply. Elite communicators listen to understand.'
  },
  {
    levelNumber: 55,
    stageNumber: 10,
    title: 'Clarifying Before Answering',
    subtitle: 'How to ask for context before giving a blind response',
    frameworkName: 'The Strategic Clarification Pause',
    frameworkFormula: 'Appreciation + Boundary check ("To make sure I address what matters most, are you asking about X or Y?")',
    prompt: 'Someone asks vaguely: "How do you handle team performance?" Clarify before answering.',
    guidance: 'Ask whether they are curious about ongoing goal-setting or managing underperformance.',
    corePremise: 'Never guess what a vague question means. Clarify the boundary and give a sniper-accurate answer.'
  },
  {
    levelNumber: 56,
    stageNumber: 10,
    title: 'Handling Misunderstandings',
    subtitle: 'Clear up confusion without accusing the listener',
    frameworkName: 'Self-Responsible Clarification',
    frameworkFormula: '"I must have stated that clumsily. What I intended to convey was..."',
    prompt: 'A client angrily misunderstands your pricing estimate as a fixed contract. Correct the misunderstanding.',
    guidance: 'Take ownership of the phrasing, re-anchor the estimate scope, and clarify the contract terms.',
    corePremise: 'Take ownership of the communication gap. Accusing the listener of misunderstanding triggers immediate defensiveness.'
  },
  {
    levelNumber: 57,
    stageNumber: 10,
    title: 'Keeping a Conversation Meaningful',
    subtitle: 'Steering small talk into genuine substance',
    frameworkName: 'Depth Threading',
    frameworkFormula: 'Acknowledge superficial fact → Bridge to human experience → Ask meaningful reflection',
    prompt: 'Steer a mundane conversation about the weather into a discussion on seasonal habits and creative focus.',
    guidance: 'Connect the rainy day to how it affects indoor deep focus and creative energy.',
    corePremise: 'Small talk is the porch; meaningful conversation is the living room. Invite people inside.'
  },
  {
    levelNumber: 58,
    stageNumber: 10,
    title: 'Knowing When to Stop Explaining',
    subtitle: 'The discipline of landing the plane and resting in silence',
    frameworkName: 'The Land and Rest Discipline',
    frameworkFormula: 'Deliver Final Point → Close Mouth → Maintain Relaxed Eye Contact → Welcome Response',
    prompt: 'Pitch an idea to your team in two clean sentences, and then deliberately stop speaking.',
    guidance: 'Suppress the urge to add "So yeah, does that make sense?" Just land the sentence and hold the floor.',
    corePremise: 'Silence after an answer demonstrates confidence; over-explaining signals insecurity.'
  },

  // WORLD 11: DIFFICULT COMMUNICATION (59 - 65)
  {
    levelNumber: 59,
    stageNumber: 11,
    title: 'Saying No',
    subtitle: 'Setting clear, respectful boundaries without guilt or apology',
    frameworkName: 'The Clean Boundary Protocol',
    frameworkFormula: 'Warm Direct "No" + Concise Principle/Constraint + Future Alternative',
    prompt: 'Say no to a colleague who asks you to join a non-essential committee that would derail your core deadlines.',
    guidance: 'Decline without fabricating fake excuses: "I cannot commit to this committee because my focus is 100% on shipping our Q3 deliverables."',
    corePremise: 'A clear "no" protects your commitments and earns far more respect than a reluctant, resentful "yes".'
  },
  {
    levelNumber: 60,
    stageNumber: 11,
    title: 'Giving Criticism',
    subtitle: 'Delivering corrective feedback that inspires growth, not shame',
    frameworkName: 'Behavior-Impact-Request Architecture',
    frameworkFormula: 'Objective Observation + Measurable Impact + Collaborative Request',
    prompt: 'Give constructive criticism to a teammate who consistently arrives 10 minutes late to client meetings.',
    guidance: 'Describe the exact behavior, explain how it affects client trust, and request punctuality.',
    corePremise: 'Criticize the specific behavior and its impact; never judge the person’s character.'
  },
  {
    levelNumber: 61,
    stageNumber: 11,
    title: 'Receiving Criticism',
    subtitle: 'Receiving sharp feedback with curiosity and emotional stability',
    frameworkName: 'The Non-Defensive Absorber',
    frameworkFormula: 'Deep Breath → Acknowledge Perspective → Clarify Specific Examples → Commit to Review',
    prompt: 'A manager harshly tells you: "Your presentation today was disorganized and confusing." Respond with composure.',
    guidance: 'Do not argue or make excuses. Say: "Thank you for the candid feedback. Which specific section was hardest to follow so I can rebuild it?"',
    corePremise: 'Defensiveness confirms the criticism; calm inquiry dismantles hostility and reveals the lesson.'
  },
  {
    levelNumber: 62,
    stageNumber: 11,
    title: 'Disagreement Without Fighting',
    subtitle: 'Preserving emotional rapport while standing firm on principles',
    frameworkName: 'Collaborative Dissent',
    frameworkFormula: 'Affirm Shared Dedication + Illuminate Structural Friction + Explore Shared Test',
    prompt: 'You and a co-founder disagree deeply on product pricing. Voice your disagreement without damaging the partnership.',
    guidance: 'Emphasize your shared commitment to company longevity and propose an A/B test to let real customers decide.',
    corePremise: 'Tough on problems, gentle on people.'
  },
  {
    levelNumber: 63,
    stageNumber: 11,
    title: 'Explaining a Mistake',
    subtitle: 'Own errors with complete accountability and zero excuse-making',
    frameworkName: 'Full-Ownership Accountability',
    frameworkFormula: 'Unequivocal Ownership ("I made a mistake") + Root Cause + Immediate Mitigation + Prevention Plan',
    prompt: 'You accidentally deleted a staging database. Explain the mistake to your engineering manager.',
    guidance: 'Say: "I made an error running a cleanup script without verifying the target environment. Here is the recovery status and the safeguard I am adding."',
    corePremise: 'Excuses prolong pain; total ownership builds immense leadership trust.'
  },
  {
    levelNumber: 64,
    stageNumber: 11,
    title: 'Apologizing Properly',
    subtitle: 'A sincere apology that repairs trust without self-pity',
    frameworkName: 'The Sincere Restorative Apology',
    frameworkFormula: 'Name the specific harm + Validate their feelings + Zero "if" or "but" + Make restitution',
    prompt: 'Apologize to a colleague after you interrupted them repeatedly during an important client pitch.',
    guidance: 'Say: "I interrupted you twice in the client pitch. That was disrespectful and disrupted your flow. I apologize, and next time I will hold my comments until you pass the floor."',
    corePremise: 'A genuine apology contains no excuses, no defensiveness, and a clear commitment to behavioral change.'
  },
  {
    levelNumber: 65,
    stageNumber: 11,
    title: 'Difficult Conversation',
    subtitle: 'Navigating high-stakes emotional minefields with poised steadiness',
    frameworkName: 'The High-Stakes Grounding Compass',
    frameworkFormula: 'State Positive Intent → Share Your Observations Factually → Ask for Their Lived Experience → Co-create Next Steps',
    prompt: 'Initiate a difficult conversation with a long-time partner about unequal workload distribution.',
    guidance: 'State your care for the partnership, share specific workload observations, and invite their honest perspective.',
    corePremise: 'Difficult conversations avoided become toxic crises. Address them early with clean facts and warm presence.'
  },

  // WORLD 12: COMMUNICATION MASTERY (66 - 75)
  {
    levelNumber: 66,
    stageNumber: 12,
    title: 'Choosing the Right Framework',
    subtitle: 'Read the room and select the ideal structure in 3 seconds',
    frameworkName: 'Situational Framework Selector',
    frameworkFormula: 'Question Type → Audience Need → Ideal Mental Model Selection',
    prompt: 'A manager asks for an update on a delayed deliverable. Explain why you choose S-P-R over What/Why/How.',
    guidance: 'Explain that the deliverable is in crisis, so the manager needs Situation, Problem, and immediate Response, not a theoretical overview.',
    corePremise: 'Mastery is not knowing one framework; it is selecting the exact scalpel required for the specific situation.'
  },
  {
    levelNumber: 67,
    stageNumber: 12,
    title: 'Combining Frameworks',
    subtitle: 'Seamlessly blend PREP with Storytelling or 5W1H',
    frameworkName: 'Hybrid Framework Synthesis',
    frameworkFormula: 'Macro Structure (PREP) + Micro Core (STAR Narrative inside the Example)',
    prompt: 'Answer "Why are you qualified for this executive role?" using PREP, where your Example is a mini-STAR story.',
    guidance: 'Deliver your Point, support with Reason, tell a 30-second STAR story as the Example, and land with the final Point.',
    corePremise: 'Frameworks can be nested like musical chords to create rich, harmonious communication.'
  },
  {
    levelNumber: 68,
    stageNumber: 12,
    title: 'Framework Flexibility',
    subtitle: 'Frameworks are cognitive handrails, not rigid robotic scripts',
    frameworkName: 'Organic Framework Weaving',
    frameworkFormula: 'Retain the Logic → Dissolve the Labels → Speak with Human Warmth',
    prompt: 'Explain why mentoring junior colleagues is vital using PREP without ever uttering the words "point", "reason", or "example".',
    guidance: 'Speak naturally and fluidly so the listener feels the logic without hearing the scaffolding.',
    corePremise: 'The framework should disappear into natural communication.'
  },
  {
    levelNumber: 69,
    stageNumber: 12,
    title: 'Answering Without a Framework',
    subtitle: 'Internalized structure becomes instinctual eloquence',
    frameworkName: 'Instinctual Eloquence',
    frameworkFormula: 'Intuitive Logic Flow + Deep Presence + Effortless Articulation',
    prompt: 'Speak off-the-cuff for 60 seconds on what gives your daily work meaning, letting structured clarity flow naturally.',
    guidance: 'Trust your internalized instinct. Start with your core truth, illustrate naturally, and land smoothly.',
    corePremise: 'When frameworks are mastered, they become like breathing: invisible, essential, and effortless.'
  },
  {
    levelNumber: 70,
    stageNumber: 12,
    title: 'The Same Question, Five Different Answers',
    subtitle: 'The supreme test of situational adaptability',
    frameworkName: 'The Pentagonal Perspective',
    frameworkFormula: 'One Question → Five Distinct Frameworks (PREP | What-Why-How | SAR | Story | 5W1H)',
    prompt: 'Question: "Why should we invest in learning communication frameworks?" Outline how you would answer using 3 distinct frameworks.',
    guidance: 'Show how PREP makes it persuasive, What/Why/How makes it instructional, and SAR makes it empirical.',
    corePremise: 'A master communicator has multiple keys for every lock.'
  },
  {
    levelNumber: 71,
    stageNumber: 12,
    title: 'Real-Time Communication Challenge',
    subtitle: 'AI mentor delivers rapid, unpredictable questions requiring instant structure',
    frameworkName: 'Spontaneous Structure Reflex',
    frameworkFormula: 'Zero Preparation → Instant Breath → Direct Answer → Supporting Pillar',
    prompt: 'AI Mentor presents: "If you could eliminate one meeting from all corporate calendars worldwide, which one would it be and why?"',
    guidance: 'Respond instantly with BLUF (Point first), give one solid operational reason, and illustrate with a real meeting disaster.',
    corePremise: 'Mastery is the ability to produce structure under real-time improvisation.'
  },
  {
    levelNumber: 72,
    stageNumber: 12,
    title: 'Complex Question',
    subtitle: 'Deconstruct a multi-part question with clean organizational hierarchy',
    frameworkName: 'Multi-Pronged Decomposition',
    frameworkFormula: 'Acknowledge Both Facets → Address Facet 1 → Address Facet 2 → Synthesize',
    prompt: 'Answer: "How do we balance shipping features rapidly while maintaining zero security vulnerabilities?"',
    guidance: 'Decompose speed vs security, show automated guardrails as the bridge, and conclude with the unified policy.',
    corePremise: 'When asked a complex two-part question, break it into distinct tracks before synthesizing.'
  },
  {
    levelNumber: 73,
    stageNumber: 12,
    title: 'Defending an Idea',
    subtitle: 'Defend your proposal against skeptical interrogation with calm authority',
    frameworkName: 'The Immovable Fortress Frame',
    frameworkFormula: 'Calm Validation of Skepticism + Re-assertion of First Principles + Precedent Proof',
    prompt: 'Defend your proposal to switch your company’s entire codebase to TypeScript against a skeptical senior developer who loves raw JavaScript.',
    guidance: 'Acknowledge the learning curve, point to compilation-time bug prevention, and cite enterprise velocity metrics.',
    corePremise: 'You defend an idea not by shouting louder, but by anchoring deeper in reality.'
  },
  {
    levelNumber: 74,
    stageNumber: 12,
    title: 'Explaining a Complex Idea Simply',
    subtitle: 'The ultimate synthesis: explain a deep technical or philosophical concept in 60 seconds',
    frameworkName: 'The Master Synthesis',
    frameworkFormula: 'The 1-Sentence Analogy + The Human Stakes + The Irrefutable Example',
    prompt: 'Explain "Quantum Computing" or "Cryptographic Hashing" to an eager high school student.',
    guidance: 'Use a brilliant physical metaphor (e.g., finding the exit in a maze all at once vs one path at a time).',
    corePremise: 'Simplicity on the far side of complexity is the true mark of communication mastery.'
  },
  {
    levelNumber: 75,
    stageNumber: 12,
    title: 'Final Communication Challenge',
    subtitle: 'The comprehensive capstone scenario testing complete communication mastery',
    frameworkName: 'The Sovereign Communicator Capstone',
    frameworkFormula: 'Complete Synthesis: Empathy + Structure + Logic + Nuance + Poise',
    prompt: 'You are addressing your entire company after a major project failure that cost millions. Deliver the address that restores trust, clarifies lessons, and inspires renewed commitment.',
    guidance: 'Apply everything: BLUF, Situation-Problem-Response, Full Ownership, Clear Vision, and Sincere Inspiration.',
    corePremise: 'True communication mastery is not about winning debates; it is about bringing clarity, truth, and inspiration to human beings.'
  }
];

// Add the generated levels 22 to 75 to the blueprints
for (const item of LEVEL_DEFINITIONS_22_TO_75) {
  const stage = JOURNEY_STAGES[item.stageNumber - 1];
  ALL_LEVEL_BLUEPRINTS.push({
    levelNumber: item.levelNumber,
    stageNumber: item.stageNumber,
    stageId: stage.id,
    stageTitle: stage.title,
    title: item.title,
    subtitle: item.subtitle,
    frameworkName: item.frameworkName,
    frameworkFormula: item.frameworkFormula,
    frameworkSteps: [
      '1. Assess context and question intent',
      '2. Apply the core logical architecture of this framework',
      '3. Deliver with natural, unhurried verbal authority'
    ],
    estimatedMinutes: 8,
    whenToUse: {
      idealSituations: ['High-stakes communication', 'Leadership meetings', 'Interviews & presentations']
    },
    introduction: {
      headline: item.title,
      greetingContext: `Welcome to Level ${item.levelNumber}. Here we master ${item.frameworkName} so you can think and communicate with structured impact.`,
      whyItMatters: 'Structuring your thoughts gives your audience immediate clarity.',
      whatYouWillUnderstand: `How ${item.frameworkName} transforms messy ideas into compelling communication.`,
      connectionToMastery: 'Practicing this principle refines your ability to express complex thoughts simply.'
    },
    coreExplanation: {
      corePremise: item.corePremise,
      mechanisms: [
        'Internalized mental model replaces conversational panic',
        'Top-down logical structure accelerates listener comprehension',
        'Clean resting points eliminate rambling and filler words'
      ],
      commonPitfall: 'Reverting to unstructured stream-of-consciousness rambling.',
      mentalModel: `The Architect’s Compass: Let ${item.frameworkName} guide the blueprint of your spoken words.`
    },
    frameworkExamples: [
      {
        context: 'High-stakes discussion in a professional setting',
        weakResponse: 'Well, it’s really complicated and depends on a lot of stuff, but basically we should probably just try our best and see what happens.',
        weakCritique: 'Vague, hesitant, and devoid of structure or strategic clarity.',
        strongResponse: 'Here is the bottom line: we must prioritize clear structural boundaries. By executing systematically, we protect our time and deliver verified impact.',
        strongBreakdown: 'Direct point → Structured logic → Decisive closure.',
        keyDistinction: 'Weak response rambles; strong response delivers structured intent.'
      }
    ],
    exercise: {
      prompt: item.prompt,
      scenario: 'Real-world communication challenge',
      frameworkGuidance: item.guidance,
      sampleFrameworkApplication: 'Follow the core steps of the framework to construct your response.',
      placeholder: 'Type your structured response, or tap Speak to speak directly to the mentor...'
    },
    questions: [
      {
        q: item.prompt,
        guide: item.guidance,
        placeholder: 'Type your structured response, or tap Speak to speak directly to the mentor...',
        focus: item.frameworkName
      }
    ],
    keyPrinciple: {
      rule: 'Think in frameworks so you speak with natural, unshakeable clarity.',
      actionableHabit: `Practice using ${item.frameworkName} in at least one interaction today.`,
      closingReflection: 'Clarity in thought precedes authority in speech.'
    },
    corePremise: item.corePremise
  });
}

// Map of levels indexed by level number (1 to 75)
export const JOURNEY_LEVELS: Record<number, JourneyLevelData> = {};
for (const blueprint of ALL_LEVEL_BLUEPRINTS) {
  JOURNEY_LEVELS[blueprint.levelNumber] = blueprint;
}

export function getJourneyLevel(levelNumber: number): JourneyLevelData {
  return JOURNEY_LEVELS[levelNumber] || JOURNEY_LEVELS[1];
}

export function getStageForLevel(levelNumber: number): JourneyStage {
  const found = JOURNEY_STAGES.find(
    s => levelNumber >= s.levelRange[0] && levelNumber <= s.levelRange[1]
  );
  return found || JOURNEY_STAGES[0];
}
