import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Compass,
  MessageSquare,
  Square,
  Globe,
  ExternalLink,
  Sparkles,
  ChevronDown,
  Loader2,
  CheckCircle2,
  CircleDashed
} from 'lucide-react';
import { api } from '../../services/api';
import { voiceService } from '../../services/voiceService';
import { sound } from '../../services/soundEngine';
import { useAuth } from '../../context/AuthContext';
import { NormalAiMessage } from '../../types';

export interface NormalAIContextPayload {
  worldNumber?: number;
  worldTitle?: string;
  levelNumber?: number;
  levelTitle?: string;
  frameworkName?: string;
  frameworkFormula?: string;
  exercisePrompt?: string;
  userSubmittedAnswer?: string;
  evaluationFeedback?: string;
}

interface NormalAIContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: NormalAIContextPayload;
  initialPrompt?: string;
}

export const NormalAIContextDrawer: React.FC<NormalAIContextDrawerProps> = ({
  isOpen,
  onClose,
  context,
  initialPrompt
}) => {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<NormalAiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [expandedReasoningMsgIds, setExpandedReasoningMsgIds] = useState<Record<string, boolean>>({});

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoningMsgIds(prev => ({
      ...prev,
      [msgId]: prev[msgId] === undefined ? false : !prev[msgId]
    }));
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize or load conversation
  useEffect(() => {
    if (!isOpen) {
      voiceService.stop();
      setSpeakingMessageId(null);
      return;
    }

    let isMounted = true;

    const initConversation = async () => {
      try {
        const convs = await api.getConversations();
        if (convs && convs.length > 0) {
          const latest = convs[0];
          setConversationId(latest.id);
          const detail = await api.getConversation(latest.id);
          if (isMounted) {
            setMessages(detail.messages || []);
          }
        } else {
          const newConv = await api.createConversation();
          if (isMounted) {
            setConversationId(newConv.id);
            setMessages([]);
          }
        }
      } catch (err) {
        console.error('Failed to init conversation for drawer:', err);
      }
    };

    initConversation();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // If initialPrompt provided, auto-populate or send
  useEffect(() => {
    if (isOpen && initialPrompt) {
      setInputMessage(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    sound.playClick();
    setInputMessage('');
    setIsLoading(true);

    const tempUserMsgId = `temp-u-${Date.now()}`;
    const tempUserMsg: NormalAiMessage = {
      id: tempUserMsgId,
      conversationId: conversationId || '',
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    const tempAssistantMsgId = `temp-a-${Date.now()}`;
    const tempAssistantMsg: NormalAiMessage = {
      id: tempAssistantMsgId,
      conversationId: conversationId || '',
      role: 'model',
      content: '',
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg, tempAssistantMsg]);

    let targetConvId = conversationId;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedAssistantText = '';

    try {
      if (!targetConvId) {
        const newConv = await api.createConversation();
        targetConvId = newConv.id;
        setConversationId(newConv.id);
      }

      await api.streamNormalAIMessage(
        targetConvId,
        {
          message: text,
          context
        },
        {
          onStart: (data) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === tempUserMsgId ? data.userMessage : m))
            );
          },
          onStep: (step) => {
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== tempAssistantMsgId) return m;
                const existing = m.reasoningSteps || [];
                const idx = existing.findIndex((s) => s.id === step.id);
                const updated = idx >= 0
                  ? existing.map((s, i) => (i === idx ? step : s))
                  : [...existing, step];
                return { ...m, reasoningSteps: updated };
              })
            );
          },
          onDelta: (chunkText) => {
            accumulatedAssistantText += chunkText;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempAssistantMsgId
                  ? { ...m, content: accumulatedAssistantText }
                  : m
              )
            );
          },
          onDone: (data) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempAssistantMsgId ? data.assistantMessage : m
              )
            );
          },
          onError: (errMsg) => {
            console.warn('Context drawer streaming error:', errMsg);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempAssistantMsgId && !m.content
                  ? {
                      ...m,
                      content:
                        'I could not complete the response right now. Please try asking again.'
                    }
                  : m
              )
            );
          }
        },
        controller.signal
      );
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return;
      }
      console.error('Failed to send message:', err);
      setMessages((prev) => [
        ...prev.filter(m => m.id !== tempAssistantMsgId),
        {
          id: `err-${Date.now()}`,
          conversationId: targetConvId || '',
          role: 'model',
          content: 'I could not connect right now. Please try asking again.',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const toggleSpeak = (messageId: string, content: string) => {
    if (speakingMessageId === messageId) {
      voiceService.stop();
      setSpeakingMessageId(null);
    } else {
      voiceService.stop();
      setSpeakingMessageId(messageId);
      voiceService.speakNatural(content, {
        onEnd: () => setSpeakingMessageId(null),
        onError: () => setSpeakingMessageId(null)
      });
    }
  };

  const toggleVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = user?.motherTongue?.toLowerCase().includes('telugu') ? 'te-IN' : 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/30 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-subtle-fade">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-display font-bold text-xs shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-display font-bold text-zinc-900">
                  Sākshi
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 font-semibold">
                  Lesson Context
                </span>
              </div>
              <p className="text-xs text-zinc-500 truncate max-w-[260px]">
                {context.levelTitle ? `Level ${context.levelNumber}: ${context.levelTitle}` : 'Conversational AI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            title="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framework Context Strip */}
        {context.frameworkName && (
          <div className="px-4 py-2 bg-zinc-100/70 border-b border-zinc-200 flex items-center gap-2 text-xs text-zinc-700">
            <Compass className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <div className="truncate">
              <span className="text-zinc-500">Framework:</span>{' '}
              <strong className="font-semibold text-zinc-900">{context.frameworkName}</strong>
              {context.frameworkFormula && (
                <span className="text-zinc-500 text-[11px] ml-1.5 font-mono hidden sm:inline">
                  ({context.frameworkFormula})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 mb-1">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Ask about {context.frameworkName || 'this lesson'}
              </h4>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Ask for clarification, request an additional example, or check how to structure your response.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSpeakingThis = speakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-zinc-900 text-white rounded-br-xs shadow-xs'
                        : 'bg-zinc-100 text-zinc-900 border border-zinc-200/80 rounded-bl-xs'
                    }`}
                  >
                    {!isUser && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (() => {
                      const isExpanded = expandedReasoningMsgIds[msg.id] !== undefined
                        ? expandedReasoningMsgIds[msg.id]
                        : (isLoading && msg.id === messages[messages.length - 1]?.id);
                      const hasActiveStep = msg.reasoningSteps.some(s => s.status === 'in_progress');
                      const activeStep = msg.reasoningSteps.find(s => s.status === 'in_progress') || msg.reasoningSteps[msg.reasoningSteps.length - 1];

                      return (
                        <div className="mb-2.5 rounded-xl border border-zinc-200 bg-white/90 overflow-hidden text-xs transition-all">
                          <button
                            type="button"
                            onClick={() => toggleReasoning(msg.id)}
                            className="w-full px-2.5 py-1.5 flex items-center justify-between text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-1.5 font-medium min-w-0">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate text-[11px]">
                                {isLoading && msg.id === messages[messages.length - 1]?.id && hasActiveStep
                                  ? (activeStep?.label || 'Deep Researching...')
                                  : `Deep Research (${msg.reasoningSteps.length})`}
                              </span>
                              {isLoading && msg.id === messages[messages.length - 1]?.id && hasActiveStep && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                              )}
                            </div>
                            <ChevronDown
                              className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="px-2.5 pb-2 pt-1 border-t border-zinc-100 space-y-1.5 bg-zinc-50/50">
                              {msg.reasoningSteps.map((step) => {
                                const isDone = step.status === 'completed';
                                const isInProgress = step.status === 'in_progress';
                                return (
                                  <div key={step.id} className="flex items-start gap-1.5 text-[10px] leading-relaxed">
                                    <div className="pt-0.5 shrink-0">
                                      {isDone ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      ) : isInProgress ? (
                                        <Loader2 className="w-3 h-3 text-amber-600 animate-spin" />
                                      ) : (
                                        <CircleDashed className="w-3 h-3 text-zinc-300" />
                                      )}
                                    </div>
                                    <span className={isDone ? 'text-zinc-600 font-medium' : isInProgress ? 'text-zinc-900 font-semibold' : 'text-zinc-400'}>
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {!msg.content && !isUser && isLoading && msg.id === messages[messages.length - 1]?.id && (!msg.reasoningSteps || msg.reasoningSteps.length === 0) ? (
                      <div className="flex items-center gap-1.5 py-0.5 text-zinc-500 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="ml-1 text-[11px] font-mono text-zinc-500">Connecting to Sākshi...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {msg.content}
                        {isLoading && msg.id === messages[messages.length - 1]?.id && (
                          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-zinc-500 animate-pulse align-middle" />
                        )}
                      </div>
                    )}

                    {!isUser && msg.groundingSources && msg.groundingSources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-200/60">
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 mb-1">
                          <Globe className="w-3 h-3 text-zinc-400" />
                          <span>Sources & Citations</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {msg.groundingSources.map((source, sIdx) => {
                            let domain = '';
                            try {
                              domain = new URL(source.uri).hostname.replace(/^www\./, '');
                            } catch {
                              domain = source.title || 'Source';
                            }
                            return (
                              <a
                                key={sIdx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-zinc-50 border border-zinc-200 text-[10px] text-zinc-700 hover:text-zinc-950 transition-colors max-w-full"
                                title={source.title || source.uri}
                              >
                                <span className="font-mono text-zinc-400 text-[9px]">[{sIdx + 1}]</span>
                                <span className="truncate max-w-[140px] font-medium">{source.title || domain}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isUser && (
                    <div className="mt-1 flex items-center gap-2 text-zinc-500 text-xs pl-1">
                      <button
                        onClick={() => toggleSpeak(msg.id, msg.content)}
                        className="hover:text-zinc-900 p-1 flex items-center gap-1 transition-colors cursor-pointer"
                        title={isSpeakingThis ? 'Stop speaking' : 'Read aloud'}
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-zinc-900" />
                            <span className="text-[10px] text-zinc-900 font-semibold">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs pl-2">
              <div className="w-3.5 h-3.5 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin" />
              <span>Connecting to Sākshi...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about this framework or request examples..."
                className="w-full rounded-xl bg-zinc-50 border border-zinc-300 py-2.5 pl-3.5 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-2xs"
              />
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-xs cursor-pointer ${
                  isRecording ? 'text-rose-600 bg-rose-50' : 'text-zinc-400 hover:text-zinc-800'
                }`}
                title={isRecording ? 'Stop voice' : 'Speak'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type={isLoading ? 'button' : 'submit'}
              onClick={isLoading ? handleStopGeneration : undefined}
              disabled={!isLoading && !inputMessage.trim()}
              className={`p-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center ${
                isLoading
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 ring-2 ring-zinc-400'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none'
              }`}
              title={isLoading ? 'Stop generation' : 'Send question'}
              aria-label={isLoading ? 'Stop generation' : 'Send question'}
            >
              {isLoading ? (
                <Square className="w-4 h-4 fill-current text-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
