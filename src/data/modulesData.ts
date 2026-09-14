export interface DevelopmentModule {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  status: 'ACTIVE' | 'UPCOMING';
  description: string;
  iconName: string;
  colorTheme: string;
  worldsCount?: number;
  levelsCount?: number;
  badgeText?: string;
}

export const DEVELOPMENT_MODULES: DevelopmentModule[] = [
  {
    id: 'communication-mastery',
    title: 'Communication Mastery',
    subtitle: 'Framework-first thinking, structured answers & clear expression',
    domain: 'Structured Communication & Frameworks',
    status: 'ACTIVE',
    description: 'A 75-level journey across 12 worlds. Master structured answering, PREP, STAR, What-So What-Now What, persuasion, conflict de-escalation, and high-stakes clarity.',
    iconName: 'Compass',
    colorTheme: 'amber',
    worldsCount: 12,
    levelsCount: 75,
    badgeText: 'Primary Module · Active'
  },
  {
    id: 'psychology-inner-mind',
    title: 'Psychology & Inner Mind',
    subtitle: 'Deconstructing ego defenses, status threats & cognitive bias',
    domain: 'Cognitive Architecture',
    status: 'UPCOMING',
    description: 'Understand the hidden psychological engines behind human reactions, defensiveness, need for validation, and internal resistance.',
    iconName: 'Brain',
    colorTheme: 'blue',
    badgeText: 'Upcoming Domain'
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    subtitle: 'Nervous system composure, somatic regulation & empathy',
    domain: 'Self-Regulation',
    status: 'UPCOMING',
    description: 'Regulate your physiological and emotional state under pressure. Respond from calibrated awareness rather than automated emotional reactivity.',
    iconName: 'HeartPulse',
    colorTheme: 'emerald',
    badgeText: 'Upcoming Domain'
  },
  {
    id: 'social-confidence',
    title: 'Social Confidence',
    subtitle: 'Unshakeable presence in high-friction social spaces',
    domain: 'Social Dynamics',
    status: 'UPCOMING',
    description: 'Eliminate social anxiety, spotlight effect, and the fear of negative evaluation. Walk into unfamiliar rooms with grounded ease.',
    iconName: 'Shield',
    colorTheme: 'violet',
    badgeText: 'Upcoming Domain'
  },
  {
    id: 'relationships-boundaries',
    title: 'Relationships & Boundaries',
    subtitle: 'Directness without aggression, setting clean limits',
    domain: 'Interpersonal Dynamics',
    status: 'UPCOMING',
    description: 'Say no without guilt, navigate intimacy and friction, and establish mutual dignity in personal and professional relationships.',
    iconName: 'Users',
    colorTheme: 'rose',
    badgeText: 'Upcoming Domain'
  },
  {
    id: 'personal-discipline',
    title: 'Discipline & Daily Execution',
    subtitle: 'Attention sovereignty, behavioral momentum & consistency',
    domain: 'Habit Systems',
    status: 'UPCOMING',
    description: 'Break procrastination cycles, overcome mental fog, and build unbreakable operational momentum without relying on fleeting motivation.',
    iconName: 'Target',
    colorTheme: 'cyan',
    badgeText: 'Upcoming Domain'
  },
  {
    id: 'executive-leadership',
    title: 'Executive Leadership',
    subtitle: 'Vision articulation, decisive authority & collective alignment',
    domain: 'Leadership Command',
    status: 'UPCOMING',
    description: 'Command boardrooms, align divergent stakeholders, and convey vision with gravity, poise, and ethical authority.',
    iconName: 'Crown',
    colorTheme: 'yellow',
    badgeText: 'Upcoming Domain'
  },
  {
    id: 'critical-thinking',
    title: 'Critical Thinking & Decision Making',
    subtitle: 'First-principles reasoning & mental models under uncertainty',
    domain: 'Strategic Logic',
    status: 'UPCOMING',
    description: 'Deconstruct complex ambiguous situations, identify cognitive blindspots, and make high-leverage strategic decisions.',
    iconName: 'Sparkles',
    colorTheme: 'indigo',
    badgeText: 'Upcoming Domain'
  }
];
