import { Framework } from '../types';

export const FRAMEWORKS_LIBRARY: Framework[] = [
  {
    id: 'fw-prep',
    code: 'PREP',
    name: 'PREP Framework',
    tagline: 'Point → Reason → Example → Point',
    purpose: 'Deliver crisp, structured, and authoritative answers to spontaneous questions without rambling.',
    whenToUse: 'Meetings, executive updates, impromptu interview questions, and anytime you need to take a stance immediately.',
    structureSteps: [
      { step: 'Point', meaning: 'Your direct answer or thesis in one clear sentence.', promptToAsk: 'What is my bottom line?' },
      { step: 'Reason', meaning: 'The core rationale or logical principle supporting your point.', promptToAsk: 'Why is this true?' },
      { step: 'Example', meaning: 'A concrete real-world illustration, metric, or brief story.', promptToAsk: 'What evidence proves this?' },
      { step: 'Point', meaning: 'Reiterating the main thesis with a forward-looking conclusion.', promptToAsk: 'What is the actionable takeaway?' }
    ],
    explanation: 'PREP anchors your listener\'s mind immediately. By opening with your conclusion, the listener does not have to expend cognitive energy guessing where your sentence is going.',
    commonMistakes: [
      'Telling a long narrative story before revealing your actual point.',
      'Providing three conflicting reasons instead of one dominant, compelling reason.',
      'Forgetting the final Point and trailing off with "So yeah, that\'s it."'
    ],
    realisticScenario: {
      context: 'You are asked in an all-hands Q&A: "What do you think about adopting an asynchronous-first work culture?"',
      weakExample: 'Well, async is pretty interesting because people in different time zones can work, but sometimes Slack notifications are overwhelming, and my friend at another company said they love it, but meetings can also be nice sometimes...',
      weakCritique: 'Indecisive, scattered, and offers no actionable recommendation.',
      strongExample: 'I strongly support moving to an asynchronous-first culture for all status reporting. When teams default to written documentation rather than live status meetings, focus time increases and regional time-zone friction disappears. For example, when our engineering team switched their daily standups to a shared 5-minute written log, sprint throughput increased by 22% in the first month. By standardizing on written clarity, we protect our team\'s creative energy while creating a transparent historical record for the company.',
      strongBreakdown: 'Opens with a decisive recommendation (Point), grounds it in focus protection (Reason), cites a 22% throughput metric (Example), and reinforces the cultural benefit (Point).'
    },
    practicePrompt: 'Use PREP to answer: "Should young professionals prioritize building a personal brand on LinkedIn, or focus purely on private craft mastery?"'
  },
  {
    id: 'fw-star',
    code: 'STAR',
    name: 'STAR Framework',
    tagline: 'Situation → Task → Action → Result',
    purpose: 'Narrate past experiences and behavioral interview answers with clarity, agency, and measurable outcomes.',
    whenToUse: 'Behavioral job interviews ("Tell me about a time when..."), performance reviews, and case study presentations.',
    structureSteps: [
      { step: 'Situation', meaning: 'Set the scene and context in 2–3 concise sentences.', promptToAsk: 'Where and when did this occur?' },
      { step: 'Task', meaning: 'Define the exact dilemma, obstacle, or target you were responsible for.', promptToAsk: 'What was at stake?' },
      { step: 'Action', meaning: 'Detail the specific initiatives YOU took (using "I", not just "we").', promptToAsk: 'What did I specifically decide and execute?' },
      { step: 'Result', meaning: 'Share the quantifiable outcome and lasting lesson learned.', promptToAsk: 'What was the measurable impact?' }
    ],
    explanation: 'STAR prevents candidates from talking about company achievements without demonstrating personal competence. It highlights your agency, problem-solving, and emotional maturity.',
    commonMistakes: [
      'Spending 80% of the time explaining the background context and rushing the Action.',
      'Using "We did this" repeatedly so the listener cannot discern what you personally contributed.',
      'Failing to share a concrete, quantifiable result or takeaway.'
    ],
    realisticScenario: {
      context: 'Interview question: "Describe a time when a critical project was failing and how you handled it."',
      weakExample: 'We had this huge client launch that was falling apart because the backend wasn\'t ready. Everyone was stressed out and working all night, but eventually we pulled together and got it across the finish line just in time.',
      weakCritique: 'Vague, passive, and reveals zero specific strategic thinking or leadership.',
      strongExample: 'Three weeks before launching our enterprise billing portal, our load testing revealed that concurrent transactions were timing out by 40%. As the technical lead, my task was to stabilize the architecture without delaying the contractual launch date. I immediately paused cosmetic UI additions, isolated the database bottleneck to an unindexed query loop, and restructured the batch-processing queue. As a result, system latency dropped by 65%, we launched on the exact agreed date, and the client renewed their multi-year contract.',
      strongBreakdown: 'Crisp context (Situation), clear personal responsibility (Task), explicit technical intervention (Action), and validated business outcome (Result).'
    },
    practicePrompt: 'Use STAR to answer: "Tell me about a time you had to deliver difficult news or feedback to a high-performing peer."'
  },
  {
    id: 'fw-what-why-how',
    code: 'WHAT_WHY_HOW',
    name: 'What / Why / How',
    tagline: 'What is it? → Why does it matter? → How do we execute?',
    purpose: 'Pitch new ideas, propose projects, and introduce process changes with natural, compelling logic.',
    whenToUse: 'Proposing new software tools, pitching initiatives to leadership, and launching new team habits.',
    structureSteps: [
      { step: 'What', meaning: 'Define the proposal with zero jargon in one clear sentence.', promptToAsk: 'What are we creating or changing?' },
      { step: 'Why', meaning: 'Explain the pain point it eliminates and the upside it unlocks.', promptToAsk: 'Why should anyone care right now?' },
      { step: 'How', meaning: 'Provide the simple 2-to-3 step operational roadmap to make it real.', promptToAsk: 'How do we take the first step?' }
    ],
    explanation: 'Human brains need orientation before action. If you explain "How" before "Why", listeners resist. "What / Why / How" aligns motivation before demanding effort.',
    commonMistakes: [
      'Jumping straight into complex operational steps before establishing why the change matters.',
      'Making the "What" so abstract that nobody understands what is actually being proposed.'
    ],
    realisticScenario: {
      context: 'Proposing a mandatory weekly 45-minute communication coaching session for customer service reps.',
      weakExample: 'We need to start having weekly sessions on Wednesdays at 2 PM using this new checklist I created, and everyone has to fill out a sheet beforehand...',
      weakCritique: 'Sounds like more bureaucratic homework. Generates instant resistance.',
      strongExample: 'I propose launching a weekly 45-minute Communication Lab for our front-line support leads. Over the last quarter, 70% of customer churn stemmed from tone misunderstandings rather than technical bugs; polishing our de-escalation skills directly protects our customer retention. We can pilot this with a single pod of five representatives next month using recorded calls before rolling it out across the department.',
      strongBreakdown: 'Clear identity (What), backed by commercial necessity (Why), followed by low-risk pilot execution (How).'
    },
    practicePrompt: 'Use What / Why / How to propose: "Implementing "No-Meeting Thursdays" across your organization."'
  },
  {
    id: 'fw-oir',
    code: 'OIR',
    name: 'Observation → Interpretation → Request (OIR)',
    tagline: 'Camera Fact → My Perspective → Concrete Request',
    purpose: 'Give constructive criticism and resolve relationship friction without triggering defensiveness.',
    whenToUse: 'Performance discussions, peer feedback, boundary setting, and family or relationship disagreements.',
    structureSteps: [
      { step: 'Observation', meaning: 'State the camera-recordable, neutral fact without adjectives or judgment.', promptToAsk: 'What would a video recording show?' },
      { step: 'Interpretation', meaning: 'Own your internal reaction ("The story I tell myself...") rather than claiming absolute truth.', promptToAsk: 'How did I personally perceive this?' },
      { step: 'Request', meaning: 'Propose an explicit, achievable behavioral agreement.', promptToAsk: 'What specific action do I want in the future?' }
    ],
    explanation: 'People fight adjectives ("You were rude"); they cannot argue with timestamps and raw facts. OIR strips accusations from feedback.',
    commonMistakes: [
      'Disguising an insult as an observation: "I observed that you don\'t care."',
      'Failing to make an explicit request, leaving the other person unsure what to change.'
    ],
    realisticScenario: {
      context: 'Addressing a teammate who interrupts you in meetings.',
      weakExample: 'You are so disrespectful. You always cut me off when I\'m trying to speak!',
      weakCritique: 'Triggers defensiveness. The conversation becomes a debate about respect.',
      strongExample: 'During our design review today, you jumped in twice while I was midway through explaining the checkout wireframes. When that happens, I lose my train of thought and worry our client gets a fragmented message. In our next client session, I\'d like us to agree that whoever has the slide finishes their thought before the other jumps in.',
      strongBreakdown: 'Neutral count of occurrences (Observation), personal impact without moral condemnation (Interpretation), and actionable boundary (Request).'
    },
    practicePrompt: 'Use OIR to address a colleague who frequently promises to send deliverables by 5 PM but delivers them late the next afternoon.'
  },
  {
    id: 'fw-5w1h',
    code: '5W1H',
    name: '5W1H Framework',
    tagline: 'Who, What, When, Where, Why, How',
    purpose: 'Ensure complete, bulletproof communication for project handoffs, instructions, and crisis briefings.',
    whenToUse: 'Operational handoffs, incident retrospectives, delegation, and strategic kickoff documents.',
    structureSteps: [
      { step: 'Who', meaning: 'The exact stakeholders and accountable owners.', promptToAsk: 'Who is involved and who owns the outcome?' },
      { step: 'What', meaning: 'The concrete deliverables and requirements.', promptToAsk: 'What specifically is expected?' },
      { step: 'When', meaning: 'Unambiguous deadlines and timeframes.', promptToAsk: 'By what specific date and time?' },
      { step: 'Where', meaning: 'Where assets live, links, and operational channels.', promptToAsk: 'Where does the work happen?' },
      { step: 'Why', meaning: 'The strategic priority and value.', promptToAsk: 'Why is this being done now?' },
      { step: 'How', meaning: 'Guidelines, constraints, and success criteria.', promptToAsk: 'How will quality be evaluated?' }
    ],
    explanation: 'Eliminates ambiguities. Inexperienced delegators assume context; master communicators articulate all 6 anchors.',
    commonMistakes: [
      'Assuming people know "Why" and only giving the "What".',
      'Leaving "When" open-ended with phrases like "as soon as you can".'
    ],
    realisticScenario: {
      context: 'Delegating a critical research brief to a junior team member.',
      weakExample: 'Can you look into competitor pricing when you get a chance and send me some thoughts?',
      weakCritique: 'Vague timeline, vague deliverable, zero quality benchmark.',
      strongExample: 'I need you (Who) to compile a 1-page competitor pricing matrix (What) by Thursday at 2 PM (When) in our shared Strategy Drive folder (Where). Our leadership team is setting our 2027 enterprise tiers next week (Why), and we need a 3-column table comparing our top 3 competitors\' annual contracts, onboarding fees, and seat tiers (How).',
      strongBreakdown: 'Covers every critical anchor with absolute precision.'
    },
    practicePrompt: 'Use 5W1H to announce an unexpected system maintenance outage to your company\'s 500 remote employees.'
  },
  {
    id: 'fw-steelmanning',
    code: 'STEELMANNING',
    name: 'The Steelmanning Framework',
    tagline: 'Articulate their argument better than they can before presenting your own.',
    purpose: 'Win debates, earn profound respect from opponents, and dismantle opposing views with intellectual integrity.',
    whenToUse: 'High-stakes negotiations, philosophical or political debates, and resolving deadlocked disagreements.',
    structureSteps: [
      { step: 'Summarize Their View', meaning: 'Express their position with such fairness that they say "Yes, that\'s exactly what I mean."', promptToAsk: 'What is their strongest possible argument?' },
      { step: 'Highlight Its Merit', meaning: 'Acknowledge where their reasoning is valid or insightful.', promptToAsk: 'What part of their argument is undeniably smart?' },
      { step: 'Introduce Your Nuance', meaning: 'Present your alternative perspective not as an attack, but as an evolution.', promptToAsk: 'What additional dimension changes the conclusion?' }
    ],
    explanation: 'Strawmanning (caricaturing an opponent\'s view) makes you look weak and petty. Steelmanning makes you look intellectually fearless.',
    commonMistakes: [
      'Sarcastically exaggerating their premise.',
      'Pretending to agree while using a patronizing tone.'
    ],
    realisticScenario: {
      context: 'In an executive debate, an executive argues that AI coding tools are a temporary gimmick that compromise code quality.',
      weakExample: 'You are just resistant to change because you don\'t understand modern LLM tooling!',
      weakCritique: 'Ad hominem attack. Hardens resistance.',
      strongExample: 'If I understand your concern, you are pointing out that blindly adopting generative code tools introduces subtle security vulnerabilities and promotes shallow architectural understanding in junior developers—which could cost us millions in technical debt later. That is a genuinely critical risk that most hype cycles ignore. Our approach is not to let AI write architecture unsupervised, but to mandate static analysis sandboxes that catch those exact vulnerabilities automatically.',
      strongBreakdown: 'Validates their deepest concern with full dignity, removing defensiveness before demonstrating the solution.'
    },
    practicePrompt: 'Steelman the argument of a customer who refuses to pay an invoice due to a delayed delivery, before explaining why partial payment is still required.'
  }
];
