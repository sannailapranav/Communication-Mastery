import React from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Brain,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: () => void;
  onSignIn: () => void;
  onExploreFrameworks: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onSignIn,
  onExploreFrameworks
}) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-stone-200 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-800 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-stone-700" />
            <span>Structured Communication Training & Cognitive Clarity</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
            Master the way you think, speak, listen and communicate.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 leading-relaxed font-normal">
            Communication Mastery is not an English grammar textbook or an entertainment app. It is a rigorous, framework-driven platform designed to eliminate conversational anxiety, structure your thinking, and build unwavering verbal presence in high-stakes reality.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="landing-hero-start-btn"
              onClick={onStartLearning}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-stone-800 transition-all"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="landing-hero-signin-btn"
              onClick={onSignIn}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-7 py-3.5 text-base font-semibold text-stone-800 hover:bg-stone-100 transition-all shadow-sm"
            >
              Sign In to Your Account
            </button>
          </div>

          <div className="mt-14 border-t border-stone-200 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-medium text-stone-600">
            <div>
              <p className="text-stone-900 font-bold text-sm sm:text-base">100% Framework Driven</p>
              <p className="text-stone-500">PREP, STAR, OIR & 5W1H</p>
            </div>
            <div>
              <p className="text-stone-900 font-bold text-sm sm:text-base">Realistic Dilemmas</p>
              <p className="text-stone-500">Meetings, conflict & interviews</p>
            </div>
            <div>
              <p className="text-stone-900 font-bold text-sm sm:text-base">Speech & Voice Input</p>
              <p className="text-stone-500">Real audio recording & feedback</p>
            </div>
            <div>
              <p className="text-stone-900 font-bold text-sm sm:text-base">Longitudinal Mastery</p>
              <p className="text-stone-500">10 communication dimensions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="py-16 lg:py-20 border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">The Core Principle</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              «Learn how to communicate clearly. Discover how you think through the way you communicate.»
            </h2>
            <p className="mt-4 text-stone-600">
              True communication is not about rapid talking or grand vocabulary. It is the disciplined art of transferring an idea from your mind into another person’s mind without distortion.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 text-white mb-4">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">1. Psychological Self-Discovery</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Observe why you rush sentences, why conflict makes you concede prematurely, and how conversational fear drives verbal clutter.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 text-white mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">2. Proven Mental Frameworks</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Equip yourself with cognitive models like PREP, STAR, and OIR so you never scramble for structure when put on the spot.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 text-white mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">3. High-Stakes Practice</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Practice through spoken voice recording or written simulation in authentic situations: interviews, salary negotiation, and boundary setting.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 text-white mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">4. Diagnostic Feedback</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Receive structured evaluations scoring your clarity, structure, reasoning, and composure, with actionable rewrites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Progressive Levels */}
      <section className="py-16 lg:py-24 border-b border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Curriculum Architecture</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
              The Four Levels of Mastery
            </h2>
            <p className="mt-3 text-stone-600">
              A systematic progression that takes you from fundamental conversational awareness to poise under severe emotional and organizational pressure.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-bold text-stone-900 text-lg border border-stone-200">
                01
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-stone-900">Level 1 — Foundations: Speaking vs Communicating</h3>
                <p className="mt-1 text-sm text-stone-600">
                  Deconstruct the intention-interpretation gap, eliminate the habit of mental rehearsing while others talk, dismantle filler word anxiety, and master deliberate silence.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Active Listening</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Silence as Authority</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">BLUF Method</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-bold text-stone-900 text-lg border border-stone-200">
                02
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-stone-900">Level 2 — Conversation Mastery: Flow & Inquiry</h3>
                <p className="mt-1 text-sm text-stone-600">
                  Move beyond predictable resume interrogation, branch conversations effortlessly using Topic-Emotion-History threading, and master graceful exits without awkwardness.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Contextual Openers</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Conversational Threading</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Deep Inquiries</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white font-bold text-lg">
                03
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-stone-900">Level 3 — Communication Frameworks Library</h3>
                <p className="mt-1 text-sm text-stone-600">
                  Internalize the gold standards of verbal structure: PREP for meetings, STAR for behavioral interviews, OIR for non-defensive conflict resolution, and 5W1H for operations.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">PREP Architecture</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">STAR Storytelling</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Steelmanning Opponents</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-bold text-stone-900 text-lg border border-stone-200">
                04
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-stone-900">Level 4 — Advanced: High-Stakes Pressure & Persuasion</h3>
                <p className="mt-1 text-sm text-stone-600">
                  Handle hostile attacks without losing your temper, deliver crisis updates under time pressure, and defend unpopular boundaries with quiet conviction.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Acknowledge-Reframe-Bridge</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">De-escalating Hostility</span>
                  <span className="rounded-md bg-stone-100 px-2.5 py-1 border border-stone-200">Crisis Containment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Framework Example Contrast */}
      <section className="py-16 lg:py-20 border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Framework Contrast</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              The Power of Structure: PREP in Action
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              See the direct difference between conversational wandering and structured delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-6">
              <div className="flex items-center justify-between border-b border-red-200 pb-3 mb-3">
                <span className="text-xs font-bold uppercase text-red-700">Wandering Response</span>
                <span className="text-xs text-red-600 font-medium">Unstructured</span>
              </div>
              <p className="text-xs text-stone-500 font-semibold mb-2">PROMPT: "Should we adopt 3 mandatory office days?"</p>
              <p className="text-sm text-stone-700 italic leading-relaxed">
                "Well, it\'s tricky because some people like working from home and other people say they miss their coworkers, and I know Jane on my team really likes her quiet mornings, but then collaboration is hard over Zoom, so maybe we could test something, but people might be mad..."
              </p>
              <div className="mt-4 pt-3 border-t border-red-200 text-xs text-red-800">
                <strong>Critique:</strong> Takes 45 seconds to say nothing. Listeners disengage and doubt your leadership ability.
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-3">
                <span className="text-xs font-bold uppercase text-emerald-800">PREP Mastered Response</span>
                <span className="text-xs text-emerald-700 font-medium">Point → Reason → Example → Point</span>
              </div>
              <p className="text-xs text-stone-500 font-semibold mb-2">PROMPT: "Should we adopt 3 mandatory office days?"</p>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                "I recommend we allow team leads to establish their own in-office rhythm rather than issuing a company-wide mandate (<strong>Point</strong>). Our teams have vastly different operating tempos—sales requires real-time energy, while engineering requires 4-hour blocks of uninterrupted focus (<strong>Reason</strong>). For instance, when our engineering pod voluntarily grouped meetings onto Wednesdays, sprint velocity jumped 18% (<strong>Example</strong>). By keeping the policy team-driven, we protect focus while ensuring teams gather when it counts (<strong>Point</strong>)."
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-xs text-emerald-900">
                <strong>Result:</strong> Delivered in 30 seconds with undeniable conviction, proof, and clarity.
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onExploreFrameworks}
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 hover:text-stone-700 underline underline-offset-4"
            >
              <span>Explore all communication frameworks in the library</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stop hoping for good conversations. Master the architecture.
          </h2>
          <p className="mt-4 text-stone-400 text-base max-w-xl mx-auto">
            Join Communication Mastery today. Step into real-world scenarios, receive structured diagnostic evaluations, and build verbal presence that commands respect.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              id="landing-cta-btn"
              onClick={onStartLearning}
              className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-stone-900 hover:bg-stone-100 shadow-md transition-all"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 py-8 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-5xl px-4">
          <p className="font-semibold text-stone-800">Communication Mastery</p>
          <p className="mt-1">
            Structured communication frameworks, psychological self-discovery, and realistic vocal practice.
          </p>
        </div>
      </footer>
    </div>
  );
};
