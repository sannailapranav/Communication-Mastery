import { LearningModule } from '../types';

export const CURRICULUM_MODULES: LearningModule[] = [
  {
    id: 'mod-foundations-1',
    levelNumber: 1,
    levelName: 'Level 1 — Foundations',
    title: 'Speaking vs Communicating: The First Principles',
    description: 'Transform your perspective from merely speaking words to transmitting clear meaning, understanding listener psychology, and removing conversational fear.',
    difficulty: 'Beginner',
    iconName: 'MessageSquare',
    lessons: [
      {
        id: 'lesson-1-1',
        moduleId: 'mod-foundations-1',
        title: 'Speaking vs Communicating: Why Being Understood Is an Art',
        order: 1,
        estimatedMinutes: 8,
        summary: 'Speaking is about the speaker; communicating is about the listener. Learn how to bridge the gap between your intention and their interpretation.',
        psychologicalFocus: 'Intention vs. Interpretation Gap & Overcoming Egocentric Speech',
        keyFramework: 'Intent-Impact Loop',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'What Is True Communication?',
            content: 'Many people believe communication is simply the act of vocalizing sentences clearly or demonstrating a wide vocabulary. In reality, speaking is an output, but communication is a shared connection. Communication only succeeds when the picture inside the listener\'s mind matches the picture inside your mind. The listener filters every word you say through their own mood, biases, assumptions, and attention span.',
            takeaway: 'Speaking is what you say; communication is what the other person hears and absorbs.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'Why It Matters in Everyday Life',
            content: 'When we assume that "saying it" equals "communicating it", misunderstandings thrive. In job interviews, we over-explain and lose the interviewer\'s interest. In relationships, we use accusatory phrasing thinking we are just "being honest". In the workplace, unclear instructions lead to wasted hours. Mastering this shift turns you from an anxious performer into an intentional communicator.',
            takeaway: 'Your effectiveness as a human being is directly tied to the clarity of your communication.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: The Vague Project Update',
            content: 'Alex is asked by his manager in a team standup: "Alex, how is the client report coming along?" Notice how Alex speaks for three uninterrupted minutes without actually answering the question.',
            dialogue: [
              {
                speaker: 'Manager',
                role: 'Team Lead',
                text: 'Alex, do you have an update on the Q3 client report?',
                tone: 'Direct, busy'
              },
              {
                speaker: 'Alex (Weak)',
                role: 'Analyst',
                text: 'Well, so basically yesterday I opened the spreadsheet and noticed some data points from regional sales were kind of weird, so I pinged Sarah, but Sarah was in meetings all morning, and then IT had that server reset, so I had to download the CSV again, but I think most of it is alright now though...',
                tone: 'Rambling, defensive',
                critique: 'Alex dumps his entire stream of consciousness. The manager still does not know if the report is ready, delayed, or when it will be done.'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'Alex felt anxious about looking incompetent or late. To protect his ego, he instinctively narrated his entire effort instead of answering the core question. He confused his internal emotional struggle with the information his listener needed. The manager did not need Alex\'s diary; she needed a status, an obstacle, and an ETA.',
            takeaway: 'Anxiety makes us narrate our effort; mastery makes us deliver the outcome first.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The Bottom-Line Up Front (BLUF) Framework',
            content: 'Whenever you are asked for a status, opinion, or answer, give the bottom line in your very first sentence, followed by the context:\n\n1. Conclusion / Status (The direct answer)\n2. Context / Core Reason (The primary driver)\n3. Next Step / Timeline (What happens next)',
            takeaway: 'Start with the answer, not the story of how you found it.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Here is how Alex delivers the exact same reality with calm authority and respect for the listener:',
            dialogue: [
              {
                speaker: 'Alex (Mastery)',
                role: 'Analyst',
                text: 'The report is 80% complete and will be in your inbox by 3 PM today. We had a minor data sync delay with regional sales this morning, but Sarah and I resolved it.',
                tone: 'Calm, structured, decisive',
                critique: 'Clear, concise, and reassuring. The manager immediately has the exact information needed.'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Observation & Reflection',
            content: 'Think about the last time someone asked you a direct question—in a meeting, at family dinner, or with a friend. Did you immediately tell the backstory, or did you give the bottom line first? What fear prompted you to add unnecessary background details?',
            takeaway: 'Notice when you speak to justify your effort rather than to inform your listener.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'Apply the Bottom-Line Up Front (BLUF) framework to the following prompt:\n"Your friend asks: Are you coming to the dinner party tonight?" You are running 45 minutes late because of traffic, but you definitely want to attend.'
          }
        ],
        interactivePrompt: {
          prompt: 'Your colleague asks: "Can you review the presentation slides before tomorrow\'s client pitch?" You have two urgent deadlines today, but you can review them early tomorrow morning at 8:30 AM.',
          sampleWeakAnswer: 'Well, today is super crazy for me with reports and emails, so I don\'t know if I can look today, but maybe tomorrow I might have time if nothing blows up.',
          sampleStrongAnswer: 'Yes, I can review them by 9:30 AM tomorrow. My schedule is locked today with client deadlines, but I will make your deck my first priority tomorrow morning.',
          tips: [
            'Lead with the affirmative or clear timeline in sentence one.',
            'State the constraint without victim language.',
            'Give a concrete commitment.'
          ]
        }
      },
      {
        id: 'lesson-1-2',
        moduleId: 'mod-foundations-1',
        title: 'Active Listening & Breaking the Rehearsal Habit',
        order: 2,
        estimatedMinutes: 9,
        summary: 'Most people do not listen to understand; they listen to reply. Learn how to stop mental rehearsing and practice empathetic listening.',
        psychologicalFocus: 'Internal Rehearsal Anxiety & Conversational Selfishness',
        keyFramework: 'Listen-Acknowledge-Inquire (LAI)',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'The Rehearsal Trap',
            content: 'Notice what happens in your head while someone else is speaking. Are you fully absorbing their tone, word choice, and underlying emotion? Or is a mental monologue rehearsing your clever joke, your counter-argument, or your own similar story? When you rehearse your reply, you have stopped listening.',
            takeaway: 'You cannot connect with another human being while rehearsing your own script.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'Why Real Listening Transforms Relationships',
            content: 'People rarely remember the exact words you said, but they vividly remember how valued they felt in your presence. When you truly listen, you notice subtle conversational cues, avoid misinterpreting intentions, and ask questions that make the other person feel genuinely seen.',
            takeaway: 'Deep listening is the rarest and most magnetic conversational trait.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: Hijacking the Narrative',
            content: 'Maya is telling Jordan about an exhausting challenge with her new team at work.',
            dialogue: [
              {
                speaker: 'Maya',
                role: 'Colleague',
                text: 'Honestly, I\'m feeling pretty overwhelmed. Two people on the project don\'t agree on anything, and every discussion turns into a slow debate.',
                tone: 'Vulnerable, tired'
              },
              {
                speaker: 'Jordan (Weak)',
                role: 'Friend',
                text: 'Oh man, I know exactly what you mean! Last year on my project, my tech lead and product manager fought constantly. It was awful, I had to work 60 hours a week and basically save the launch myself...',
                tone: 'Interrupting, self-centered',
                critique: 'Jordan took Maya\'s emotional bid and immediately hijacked the spotlight to talk about himself.'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'Jordan believed he was "relating" to Maya by sharing his story. But psychologically, he stole the emotional stage. When someone shares a struggle, an immediate shift to your own story invalidates their feeling. It communicates: "Your problem is common, but let me tell you about my more interesting struggle."',
            takeaway: 'Relating is not the same as hijacking. Keep the spotlight on their experience first.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The LAI Framework (Listen, Acknowledge, Inquire)',
            content: 'Before offering your own story or advice, follow three deliberate steps:\n\n1. Listen: Pause for 1–2 seconds when they stop speaking.\n2. Acknowledge: Validate the core feeling or premise ("That sounds draining having to arbitrate every single point."). \n3. Inquire: Ask an open-ended question to help them go deeper ("What do you think is driving their disagreement?").',
            takeaway: 'Validate their reality before introducing your perspective.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Jordan applies the LAI framework:',
            dialogue: [
              {
                speaker: 'Jordan (Mastery)',
                role: 'Friend',
                text: 'That sounds exhausting, Maya. It\'s hard enough managing the workload, let alone managing adult conflict every day. How are you holding up with it all?',
                tone: 'Warm, attentive, grounding',
                critique: 'Validates her emotional weight and invites her to express what she needs without unsolicited advice.'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Reflection',
            content: 'When was the last time you cut someone off with "Oh, the same thing happened to me!"? How do you think they felt in that moment?',
            takeaway: 'Resist the urge to solve or match their story immediately.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'A coworker tells you: "I feel like our client doesn\'t trust our recommendations at all, no matter how much data we show them." Write a response using the Listen-Acknowledge-Inquire (LAI) structure.'
          }
        ],
        interactivePrompt: {
          prompt: 'Your sibling tells you: "I am thinking of quitting my job. The salary is fine, but I wake up with dread every Sunday evening."',
          sampleWeakAnswer: 'You should totally quit! Life is too short. Or maybe you can ask for a raise first?',
          sampleStrongAnswer: 'Sunday dread is a heavy thing to carry every week. That tells me this is taking a serious toll on your mental peace. What part of the job is weighing on you the most right now?',
          tips: [
            'Acknowledge the emotional weight ("Sunday dread is heavy").',
            'Do not give immediate unsolicited career advice.',
            'Ask an exploratory question to help them clarify their thoughts.'
          ]
        }
      },
      {
        id: 'lesson-1-3',
        moduleId: 'mod-foundations-1',
        title: 'Confidence, Filler Words & The Power of the Pause',
        order: 3,
        estimatedMinutes: 10,
        summary: 'Eliminate "um", "like", "you know", and nervous verbal clutter by replacing fear of silence with intentional pauses.',
        psychologicalFocus: 'Fear of Conversational Voids & Discomfort with Silence',
        keyFramework: 'Pause-Breathe-Deliver (PBD)',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'Why Do We Use Filler Words?',
            content: 'Filler words like "um", "uh", "like", "sort of", and "you know" are vocal placeholders. When our brain needs a second to retrieve a word or formulate an idea, our nervous system panics at the empty space. We subconsciously fear that if we are silent for 1.5 seconds, the listener will interrupt us, think we are slow, or lose interest. Filler words are an attempt to hold the audio channel hostage.',
            takeaway: 'Filler words are verbal panic; silence is verbal confidence.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'Why Pauses Command Respect',
            content: 'High-status, authoritative, and charismatic communicators are comfortable with silence. When you pause, you give your listener time to process what you just said, and you give yourself time to choose exact, powerful words. A pause signals composure, thought, and self-possession.',
            takeaway: 'People lean in during a deliberate pause; they tune out during filler-filled monologues.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: Answering an Unprompted Question',
            content: 'In an interview or boardroom presentation, an unexpected question is asked: "Why should we invest in this initiative over the competitors?"',
            dialogue: [
              {
                speaker: 'Candidate (Weak)',
                role: 'Interviewee',
                text: 'So, um, basically, like, I think our product is, you know, kind of better because, like, our user interface is, um, really intuitive, and, uh, people generally like it more, you know?',
                tone: 'Nervous, hesitant',
                critique: 'The excessive fillers undermine an otherwise valid point and suggest a lack of conviction.'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'The candidate started making sounds before his brain had formulated the sentence structure. By opening his mouth immediately upon hearing the question, he trapped himself in verbal improvisation. A confident speaker takes 2 full seconds of calm eye contact before uttering the first syllable.',
            takeaway: 'You do not owe anyone instant speech. You owe them thoughtful speech.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The PBD (Pause, Breathe, Deliver) Framework',
            content: 'When asked a question or transitioning between ideas:\n1. Pause: Close your mouth and hold eye contact for two beats.\n2. Breathe: Inhale through the nose into your diaphragm.\n3. Deliver: Speak the first three words firmly without a preamble.',
            takeaway: 'Silence buys you precision.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Watch how the exact same response sounds when grounded in deliberate silence:',
            dialogue: [
              {
                speaker: 'Candidate (Mastery)',
                role: 'Interviewee',
                text: '[Pauses for 2 seconds with calm eye contact] Three factors set us apart: our deployment speed is twice as fast, our workflow integrates natively with your existing CRM, and our support response time is guaranteed under fifteen minutes.',
                tone: 'Composed, measured, authoritative',
                critique: 'The initial silence commands immediate attention and makes the structured points memorable.'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Reflection',
            content: 'What is your primary filler word? Do you say "like", "you know", "basically", or vocalize "uhhhh"? In what settings (talking to authority figures, strangers, presentations) does this habit surge?',
            takeaway: 'Awareness is 80% of the solution.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'Practice answering this question out loud or in writing without a single filler word:\n"What is one principle you never compromise on in your work, and why?"'
          }
        ],
        interactivePrompt: {
          prompt: 'You are asked in a meeting: "Why did your team decide not to launch the feature this month?"',
          sampleWeakAnswer: 'Um, well, basically, you know, we kind of felt like the testing, like, wasn\'t really where it needed to be, so, uh, we thought it was safer to wait.',
          sampleStrongAnswer: 'We delayed the launch for one reason: user data security. Our final stress tests showed a 2% latency leak in payment processing. We chose to protect our customers\' trust rather than hit an arbitrary calendar date.',
          tips: [
            'State the primary reason in the opening clause.',
            'Eliminate qualifiers like "kind of", "sort of", or "basically".',
            'Frame the delay as a conscious standard of quality.'
          ]
        }
      }
    ]
  },
  {
    id: 'mod-conversation-2',
    levelNumber: 2,
    levelName: 'Level 2 — Conversation Mastery',
    title: 'Natural Conversational Flow & Question Architecture',
    description: 'Learn how to start conversations with strangers, keep dialogue fluid through conversational threading, ask provocative questions, and exit gracefully.',
    difficulty: 'Intermediate',
    iconName: 'Users',
    lessons: [
      {
        id: 'lesson-2-1',
        moduleId: 'mod-conversation-2',
        title: 'Starting Conversations: Moving Beyond "What Do You Do?"',
        order: 1,
        estimatedMinutes: 9,
        summary: 'Break out of predictable, sterile small talk by using observational hooks and situational curiosity.',
        psychologicalFocus: 'The Social Script Barrier & Cognitive Boredom in Small Talk',
        keyFramework: 'Context-Observation-Curiosity (COC)',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'The Curse of the Social Script',
            content: 'When two strangers meet, both are running automated social scripts: "Hi, how are you? Good, how are you? What do you do? I\'m in marketing. Oh nice, where are you from?" These scripts exist because they feel safe and require zero vulnerability. However, they also produce zero emotional connection or conversational energy.',
            takeaway: 'Predictable questions produce robotic answers.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'Why the Opener Sets the Trajectory',
            content: 'The first thirty seconds of a conversation establish the conversational altitude. If you start on autopilot, both people become bored and struggle to transition into authentic dialogue. If you begin with genuine curiosity about the shared room or an unusual detail, the conversation instantly becomes alive.',
            takeaway: 'Great conversationalists ground their openers in the shared present moment.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: A Networking Event or Social Gathering',
            content: 'Two attendees are standing near the refreshment table at a design and technology conference.',
            dialogue: [
              {
                speaker: 'Liam (Weak)',
                role: 'Attendee',
                text: 'So... what company do you work for?',
                tone: 'Stiff, transactional'
              },
              {
                speaker: 'Maya',
                role: 'Attendee',
                text: 'Acme Corp. I do product design there.',
                tone: 'Flat, resigned to small talk'
              },
              {
                speaker: 'Liam (Weak)',
                role: 'Attendee',
                text: 'Cool. Cool. How long have you been there?',
                tone: 'Awkward interrogation',
                critique: 'Liam turns a social conversation into a background check. Maya feels interviewed rather than engaged.'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'Interrogation small talk puts all the pressure on the other person to be interesting while providing zero personality in return. When you ask resume-style questions, people give resume-style answers. To create rapport, connect to the shared environment or invite their subjective perspective.',
            takeaway: 'Stop interviewing people. Start sharing observations.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The Context-Observation-Curiosity (COC) Framework',
            content: '1. Context: Notice what is actually happening in the shared room.\n2. Observation: State an honest, mild observation without being cynical.\n3. Curiosity: Ask for their personal take on it.\n\nExample: "The keynote speaker made a bold claim about AI taking over architecture in three years. Did that strike you as prophetic or completely exaggerated?"',
            takeaway: 'A shared observation builds an instant "we" dynamic.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Watch Liam engage Maya using shared context:',
            dialogue: [
              {
                speaker: 'Liam (Mastery)',
                role: 'Attendee',
                text: 'I noticed everyone in the last talk was frantically taking notes on that second slide. Did you find that framework actually practical, or was it mostly theoretical hype?',
                tone: 'Engaged, perceptive, playful',
                critique: 'Invites Maya\'s real opinion. It gives her permission to be candid and smart.'
              },
              {
                speaker: 'Maya',
                role: 'Attendee',
                text: '[Laughs] Honestly, total hype! Nobody is building design systems like that in the real world. Here is why...',
                tone: 'Animated, energized'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Reflection',
            content: 'What is your default question when meeting someone new? Do you ask about their job, the weather, or their commute? How can you replace that question with something grounded in the room you are standing in?',
            takeaway: 'Notice how much easier people talk when you ask for their opinion rather than their resume.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'Imagine you are at an industry meetup or community event where everyone is standing around awkwardly looking at their phones. Formulate a 2-sentence conversational opener using the Context-Observation-Curiosity framework.'
          }
        ],
        interactivePrompt: {
          prompt: 'You are waiting in a long line for coffee at a busy airport terminal before a morning flight. A stranger standing next to you sighs softly at the delay.',
          sampleWeakAnswer: 'Long line, huh? Flights are always crazy.',
          sampleStrongAnswer: 'That sigh felt deeply relatable. Are you racing to catch a boarding call, or just in desperate need of caffeine before dealing with the world?',
          tips: [
            'Acknowledge the shared micro-moment with empathy and light humor.',
            'Give two fun, low-stakes choices that invite a smile.',
            'Keep your tone light and non-intrusive.'
          ]
        }
      },
      {
        id: 'lesson-2-2',
        moduleId: 'mod-conversation-2',
        title: 'Conversational Threading: Never Run Out of Things to Say',
        order: 2,
        estimatedMinutes: 10,
        summary: 'Discover how every single sentence contains multiple conversational "hooks" that you can branch into rich, infinite dialogue.',
        psychologicalFocus: 'Freezing Under Pressure & The Myth of Having Nothing to Say',
        keyFramework: 'Topic-Emotion-History Threading (TEH)',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'What Is Conversational Threading?',
            content: 'When people complain that "conversations die" or they "run out of things to say", they are usually treating a conversation like a single straight line. If that line ends, silence hits. Great conversationalists treat conversation like a branching tree. In almost every sentence someone speaks, they drop 3 to 4 distinct threads: facts, emotions, locations, memories, or opinions.',
            takeaway: 'A conversation never runs out of topics; you simply need to pick up a dropped thread.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'The Secret to Effortless Flow',
            content: 'When you learn to thread, you never have to scramble for a new "topic list" in your pocket. You listen to the sentence the other person just gave you, identify the most emotionally vibrant thread, and tug on it. The dialogue remains natural, spontaneous, and deeply connected to what they care about.',
            takeaway: 'The best source for your next comment is what they just said.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: Identifying the Hidden Threads',
            content: 'Listen to this single sentence from someone:\n"I just got back from visiting my parents in Colorado, and honestly, hiking at 9,000 feet after sitting at a desk all year completely destroyed my knees."',
            dialogue: [
              {
                speaker: 'Speaker',
                role: 'Colleague',
                text: 'I just got back from visiting my parents in Colorado, and honestly, hiking at 9,000 feet after sitting at a desk all year completely destroyed my knees.',
                tone: 'Reflective, humorous'
              },
              {
                speaker: 'Thread 1: The Location',
                role: 'Option A',
                text: '"Colorado is stunning. Were you up in the Rockies or near Boulder?"',
                tone: 'Geographic thread'
              },
              {
                speaker: 'Thread 2: The Family Dynamic',
                role: 'Option B',
                text: '"Visiting parents is always its own kind of adventure. Are you close with your family?"',
                tone: 'Interpersonal thread'
              },
              {
                speaker: 'Thread 3: The Physical Contrast',
                role: 'Option C',
                text: '"There is nothing quite like modern desk life to humble us when we hit nature! Did you finish the trail or tap out early?"',
                tone: 'Humorous, observational thread'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'Notice how that one single sentence offered three completely different directions to explore. An inexperienced speaker might just say: "Oh, that sucks." which kills all three threads instantly. By choosing a thread that matches your genuine curiosity, you keep the conversation moving forward smoothly.',
            takeaway: 'Don\'t squash a rich sentence with a generic one-word acknowledgment.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The TEH Threading Framework',
            content: 'When someone speaks, listen for:\n\n1. Topic / Fact: The literal activity or place.\n2. Emotion / Sensation: The feeling behind it ("destroyed", "relieved", "thrilled").\n3. History / Origin: How this connects to their past or future aspirations.',
            takeaway: 'Threading the Emotion is almost always more connecting than threading the Fact.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Observe how a conversation develops when threads are picked up consistently:',
            dialogue: [
              {
                speaker: 'A',
                text: 'I spent the whole weekend trying to fix an antique motorcycle in my garage.'
              },
              {
                speaker: 'B (Mastery)',
                text: 'That sounds like equal parts therapy and sheer frustration! Are you naturally mechanical, or was this a passion project you decided to tackle from scratch?'
              },
              {
                speaker: 'A',
                text: 'Total therapy, honestly. My dad was a mechanic, so smelling engine oil again brought back memories I hadn\'t thought of in twenty years.'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Reflection',
            content: 'Do you tend to let conversations hit dead ends because you respond with closed statements like "Nice", "Cool", or "Makes sense"? How can you train your ear to catch at least two threads in every sentence?',
            takeaway: 'Closed statements end conversations. Open threads expand them.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'Identify 3 threads in this statement and choose one to reply to:\n"My startup just closed our first paying customer after six months of pitching without a single response."'
          }
        ],
        interactivePrompt: {
          prompt: 'Someone tells you: "I took up solo watercolor painting this month because my job has been all spreadsheets and meetings, and I needed something where there is no right or wrong answer."',
          sampleWeakAnswer: 'Painting is cool. What kind of paint do you use?',
          sampleStrongAnswer: 'That phrase—"where there is no right or wrong answer"—is so revealing. When you spend all week being evaluated by numbers, creative freedom feels almost rebellious. Has it been easy to turn off your inner critic while painting, or does the spreadsheet brain try to sneak back in?',
          tips: [
            'Pick up the emotional / psychological thread ("no right or wrong answer").',
            'Validate the desire for creative escape from corporate rigidity.',
            'Ask about the psychological transition between analytical and creative modes.'
          ]
        }
      }
    ]
  },
  {
    id: 'mod-frameworks-3',
    levelNumber: 3,
    levelName: 'Level 3 — Communication Frameworks',
    title: 'The Master Communication Frameworks',
    description: 'Master proven mental models (PREP, STAR, 5W1H, OIR) to structure thoughts spontaneously, answer questions crisply, and persuade with clarity.',
    difficulty: 'Intermediate',
    iconName: 'LayoutGrid',
    lessons: [
      {
        id: 'lesson-3-1',
        moduleId: 'mod-frameworks-3',
        title: 'The PREP Framework: Point, Reason, Example, Point',
        order: 1,
        estimatedMinutes: 9,
        summary: 'The ultimate formula for spontaneous speaking, meeting contributions, and answering questions under pressure.',
        psychologicalFocus: 'Cognitive Overload in Listeners & The Need for Mental Anchors',
        keyFramework: 'PREP (Point-Reason-Example-Point)',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'What Is the PREP Framework?',
            content: 'When people speak off the cuff, they often meander: they start with random details, stumble through reasons, forget their main idea, and end with "...so yeah, that\'s basically what I think."\n\nPREP is a 4-part mental architecture:\n- P: Point (State your main thesis in one clear sentence)\n- R: Reason (Explain the core logic or why this point is true)\n- E: Example (Provide one vivid, concrete story, data point, or illustration)\n- P: Point (Reiterate your point with conclusion and forward action)',
            takeaway: 'A clear answer starts with your point and ends with your point.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'Why It Commands Instant Authority',
            content: 'Executives, managers, and intelligent audiences do not have patience for rambling. When you use PREP, you show that your thoughts are organized. The listener knows exactly where you stand from second two, understands your reasoning by second thirty, sees proof by second sixty, and walks away with your core takeaway firmly planted.',
            takeaway: 'Structure gives your ideas weight.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: Meeting Opinion on Remote Work',
            content: 'In a company strategy meeting, the CEO asks: "Do you think we should mandate three days in the office, or remain fully flexible?"',
            dialogue: [
              {
                speaker: 'Unstructured Speaker',
                role: 'Manager',
                text: 'Well, it\'s tricky because some people like working from home and other people say they miss their coworkers, and I know Jane on my team really likes her quiet mornings, but then collaboration is hard over Zoom, so maybe we could test something, but people might be mad...',
                tone: 'Indecisive, scattered',
                critique: 'Lacks conviction. After 40 seconds, the CEO still does not know what this manager recommends.'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'The speaker was afraid to take a stance because they didn\'t want to displease anyone. Consequently, they listed conflicting pros and cons without synthesis. PREP forces you to do the cognitive work of taking a stand, backing it up with evidence, and delivering clarity.',
            takeaway: 'People respect a well-reasoned point of view far more than an evasive fence-sitter.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The Anatomy of PREP',
            content: '1. Point: "I recommend we adopt a team-led flexible policy rather than a corporate mandate."\n2. Reason: "Because collaboration needs vary dramatically between deep-focus engineering and client-facing sales."\n3. Example: "Last quarter, the design team experimented with mandatory in-office Tuesdays and Thursdays. Creative alignment doubled, while their focus output remained steady because individual teams set the rhythm."\n4. Point: "Therefore, by empowering team leads to define their in-office days, we achieve collaboration without destroying employee autonomy."',
            takeaway: 'Point → Reason → Example → Point.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Review the contrast: The PREP response takes less than 35 seconds to speak aloud, yet leaves no ambiguity about the recommendation and the evidence supporting it.',
            dialogue: [
              {
                speaker: 'Structured Speaker (PREP)',
                role: 'Manager',
                text: 'I recommend we allow team leads to establish their own in-office rhythm rather than issuing a company-wide mandate. Our teams have vastly different operating tempos—sales requires real-time energy, while engineering requires 4-hour blocks of uninterrupted focus. For instance, when our engineering pod voluntarily grouped their meetings onto Wednesdays, sprint velocity jumped 18%. By keeping the policy team-driven, we protect focus while ensuring teams gather when it actually counts.',
                tone: 'Crisp, measured, compelling'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Reflection',
            content: 'In your daily conversations or meetings, do you tend to wander into background stories before making your point? How would adopting PREP change how colleagues perceive your clarity?',
            takeaway: 'Anchor your point first; let the reasons follow.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'Use the PREP framework to answer this prompt:\n"Should companies encourage employees to learn communication skills alongside technical skills?"'
          }
        ],
        interactivePrompt: {
          prompt: 'You are asked in an interview: "What is the most important skill for a modern leader to possess in the next decade?"',
          sampleWeakAnswer: 'I think leaders need a lot of things. Empathy is good, but also strategy, and also they should know how to use technology and talk to people, so it\'s really a mix of everything.',
          sampleStrongAnswer: 'The single most critical leadership skill is cognitive empathy—the ability to understand another person\'s mental model and motivations. As teams become more global and cross-functional, traditional command-and-control authority fails. For example, in my last project, our launch was saved not by technical fixes, but by understanding why our backend team was resistant to our timeline and addressing their hidden architectural concerns. Therefore, the leaders who will win are those who can decode why people think the way they do.',
          tips: [
            'Pick ONE skill firmly in your Point (do not hedge by listing five).',
            'Give a compelling Reason why the modern context demands it.',
            'Cite a concrete Example.',
            'Reiterate your Point with a memorable closing.'
          ]
        }
      },
      {
        id: 'lesson-3-2',
        moduleId: 'mod-frameworks-3',
        title: 'The OIR Framework: De-escalating Friction & Giving Feedback',
        order: 2,
        estimatedMinutes: 10,
        summary: 'Give critical feedback and resolve interpersonal conflict without triggering immediate defensiveness.',
        psychologicalFocus: 'The Threat Response & How Attribution Bias Destroys Relationships',
        keyFramework: 'Observation-Interpretation-Response (OIR)',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'Why Most Feedback Triggers Defensiveness',
            content: 'When we are upset with someone, our language naturally blends what happened with our negative judgment of why they did it. We say:\n"You don\'t respect my time!" or "You are always careless with details!"\n\nThe moment you say "You are careless", the listener\'s brain interprets this as an identity attack. Adrenaline spikes, defenses go up, and the chance of meaningful resolution drops to zero.',
            takeaway: 'People argue with your interpretations; they cannot argue with objective observations.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'Separating Fact from Fiction',
            content: 'To communicate like a master, you must learn to rigorously separate:\n1. The camera-recordable fact (What actually occurred)\n2. Your internal story (What you assumed it meant)\n3. Your constructive request (What you need moving forward)',
            takeaway: 'Strip the blame out of the fact.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: A Consistently Late Colleague',
            content: 'Your project partner Marcus has joined the last three client check-ins 10 minutes late.',
            dialogue: [
              {
                speaker: 'Accusatory Speaker (Weak)',
                text: 'Marcus, you clearly don\'t care about this project or my time. You\'re always late, and it makes us look completely unprofessional!',
                tone: 'Aggressive, emotional'
              },
              {
                speaker: 'Marcus',
                text: 'I care a lot! My child was sick this morning and my previous meeting ran over. You have no idea what my schedule is like!',
                tone: 'Defensive, counter-attacking',
                critique: 'Now they are arguing about whether Marcus "cares" rather than how to solve the meeting schedule.'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'By using words like "always" and attributing a malicious motive ("you don\'t care"), the speaker made the conflict about Marcus\'s character. Marcus was forced to defend his honor. Notice how the actual problem—being on time for clients—was completely lost in the emotional battle.',
            takeaway: 'Never describe someone else\'s motive. Describe their behavior.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The OIR Framework',
            content: '1. Observation (Camera fact): "Over the last three client check-ins, you joined ten minutes after our start time."\n2. Interpretation (Your perspective / vulnerability): "When that happens, the story I start telling myself is that you\'re overloaded, and it puts me in a tough position covering your section without warning."\n3. Response / Request (Forward motion): "How can we adjust our prep schedule so we are both in the room together when the client arrives?"',
            takeaway: 'Observation → Interpretation → Request.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Notice the immediate difference when Marcus is approached with OIR:',
            dialogue: [
              {
                speaker: 'Mastery Speaker (OIR)',
                text: 'Marcus, I wanted to check in. I noticed you joined the last two client calls about ten minutes in. When that happens, it makes it difficult for me to transition to your agenda items smoothly, and I worry we look disconnected to the client. What\'s on your plate right before that hour, and how can we make sure we\'re aligned beforehand?',
                tone: 'Calm, objective, collaborative'
              },
              {
                speaker: 'Marcus',
                text: 'Thanks for bringing that up directly. Honestly, my recurring manager 1-on-1 runs right up against that call. Let me ask to shift my 1-on-1 fifteen minutes earlier so I\'m never late to the client again.',
                tone: 'Relieved, accountable'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Reflection',
            content: 'When you have a conflict with a friend, partner, or colleague, do you use absolute words like "You always" or "You never"? How can you strip those out and replace them with objective observations?',
            takeaway: 'Absolutes are almost never true, and they always provoke defense.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'A coworker repeatedly interrupts you during team brainstorming sessions before you can finish explaining your ideas. Write a response using the Observation-Interpretation-Request framework.'
          }
        ],
        interactivePrompt: {
          prompt: 'A close friend borrowed a valuable book from you three months ago and hasn\'t returned it, despite promising to return it within a week.',
          sampleWeakAnswer: 'You always borrow my stuff and forget about it. You\'re so irresponsible!',
          sampleStrongAnswer: 'Hey, I wanted to ask about the design book you borrowed back in June. When months pass without an update, I start worrying it got misplaced and feel hesitant about lending books in the future. Can you bring it by when we meet for coffee this Thursday?',
          tips: [
            'State the exact timeline neutrally (borrowed in June).',
            'Express the feeling as your own internal reaction without name-calling.',
            'Give a clear, actionable request.'
          ]
        }
      }
    ]
  },
  {
    id: 'mod-advanced-4',
    levelNumber: 4,
    levelName: 'Level 4 — Advanced Communication',
    title: 'High-Stakes Persuasion, Conflict & Composure Under Pressure',
    description: 'Learn executive presence, handling aggressive questions, de-escalating hostility, and speaking with unwavering calm when the stakes are highest.',
    difficulty: 'Advanced',
    iconName: 'Shield',
    lessons: [
      {
        id: 'lesson-4-1',
        moduleId: 'mod-advanced-4',
        title: 'Handling Hostile Questions & Aggressive Counterparts',
        order: 1,
        estimatedMinutes: 10,
        summary: 'Master emotional regulation and conversational judo when someone attacks your ideas, your credibility, or your motives.',
        psychologicalFocus: 'The Amygdala Hijack & Status Games in Conflict',
        keyFramework: 'Acknowledge-Reframe-Bridge (ARB)',
        sections: [
          {
            id: 's1',
            type: 'understand',
            title: 'The Psychology of the Attack',
            content: 'When someone attacks your idea in a meeting or public forum with sharp tone or loaded phrasing ("That idea is completely naive!"), they are rarely challenging just the idea. They are playing a status game, projecting their own anxiety, or attempting to provoke an emotional counter-attack. If you snap back, you lose. If you shrink and apologize, you lose. The win lies in emotional stillness.',
            takeaway: 'When someone throws a hot coal at you, catching it burns you. Letting it drop cools the room.'
          },
          {
            id: 's2',
            type: 'why_it_matters',
            title: 'Why Composure Equals Power',
            content: 'In high-stakes environments, the person who retains emotional self-control commands the room. Observers judge leadership not by whether you face criticism, but by the dignity and poise with which you absorb and neutralize it. Calmness in the face of aggression is the ultimate sign of psychological strength.',
            takeaway: 'Whoever loses their temper first loses the debate.'
          },
          {
            id: 's3',
            type: 'real_situation',
            title: 'Real Situation: The Hostile Meeting Challenge',
            content: 'You present a new operational strategy. A senior colleague cuts in aggressively: "This is completely unrealistic. You obviously have no understanding of what the front-line teams actually do day-to-day!"',
            dialogue: [
              {
                speaker: 'Reactive Speaker (Weak)',
                text: 'That\'s not fair! I spent three weeks interviewing the team, and if you actually read page four of the brief, you would see that!',
                tone: 'Defensive, hurt, shrill',
                critique: 'Shows the colleague\'s barb hit home. The room feels the tension escalate into personal warfare.'
              }
            ]
          },
          {
            id: 's4',
            type: 'breakdown',
            title: 'Psychological Breakdown',
            content: 'The reactive speaker defended their ego and attacked the colleague\'s diligence ("if you read page four"). Now two people are bickering. A master communicator ignores the hostility in the wrapping paper and responds only to the underlying legitimate concern (front-line practicality).',
            takeaway: 'Separate the toxic delivery from the underlying business concern.'
          },
          {
            id: 's5',
            type: 'framework',
            title: 'The ARB Framework (Acknowledge, Reframe, Bridge)',
            content: '1. Acknowledge: Validate the core concern without agreeing with the insult ("Protecting our front-line team\'s operational reality is essential."). \n2. Reframe: Shift the conversation from personal competence to a shared problem ("The challenge is ensuring our new workflow reduces their cognitive load rather than adding steps."). \n3. Bridge: Invite them into collaborative problem-solving ("Let\'s look directly at the shift hand-off workflow on page four. Which specific step looks risky to you?")',
            takeaway: 'Turn an aggressive accusation into a collaborative examination.'
          },
          {
            id: 's6',
            type: 'better_communication',
            title: 'What Better Communication Looks Like',
            content: 'Observe the poise of the ARB response:',
            dialogue: [
              {
                speaker: 'Mastery Communicator (ARB)',
                text: 'You\'re highlighting the single most critical risk: if this doesn\'t work for the front-line staff on a frantic Tuesday morning, the entire system fails. The goal of this rollout is to eliminate their double-entry paperwork, not create more. Let\'s look at section two together. Where do you see the biggest risk of friction for the shift leads?',
                tone: 'Steady, non-defensive, authoritative'
              }
            ]
          },
          {
            id: 's7',
            type: 'reflection',
            title: 'Self-Reflection',
            content: 'When someone speaks to you with sharp tone or skepticism, what physical reaction occurs in your body? Does your chest tighten, voice rise, or eyes look away? How can you train yourself to take one slow breath before speaking?',
            takeaway: 'Control your physiology first; your words will follow.'
          },
          {
            id: 's8',
            type: 'practice',
            title: 'Interactive Exercise',
            content: 'In a client pitch, a skeptical executive interrupts: "Your company has only been in business for three years. Why on earth should we trust you with our enterprise infrastructure?" Write an ARB response.'
          }
        ],
        interactivePrompt: {
          prompt: 'During a presentation on cost optimization, a department manager says bluntly: "It\'s easy for you to sit in head office and cut our budget. You don\'t care if our team burns out."',
          sampleWeakAnswer: 'I do care about burnout! We are all making sacrifices here and you need to look at the macroeconomic reality.',
          sampleStrongAnswer: 'Preventing burnout on your team is non-negotiable—if we hit our budget targets by destroying our people, we lose long term. The entire purpose of this reallocation is to automate the repetitive manual reporting that is currently causing your team to work late. Let\'s look at your team\'s workload hours together so we can protect your core capacity while cutting the software bloat.',
          tips: [
            'Validate the core fear (protecting team burnout).',
            'Do not plead innocence or argue back defensively.',
            'Bridge to specific collaborative examination of the numbers.'
          ]
        }
      }
    ]
  }
];
