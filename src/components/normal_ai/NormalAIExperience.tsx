import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Plus,
  Compass,
  Send,
  Mic,
  MicOff,
  Trash2,
  Menu,
  X,
  Volume2,
  VolumeX,
  ChevronRight,
  LogOut,
  Languages,
  BookOpen,
  Code,
  Heart,
  HelpCircle,
  Copy,
  Check,
  Square,
  Globe,
  ExternalLink,
  Pencil,
  Sparkles,
  ChevronDown,
  Loader2,
  CheckCircle2,
  CircleDashed,
  Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NormalAiConversation, NormalAiMessage } from '../../types';
import { api } from '../../services/api';
import { mentorVoice } from '../../services/mentorVoice';

interface NormalAIExperienceProps {
  onOpenCommunicationMastery: () => void;
}

const STARTER_PROMPTS = [
  {
    icon: BookOpen,
    label: 'College & Exam',
    text: 'Tomorrow I have an exam. Can we do a quick review on Computer Networks?'
  },
  {
    icon: Code,
    label: 'Career & Tech',
    text: 'How should I explain my final year project during a campus placement interview?'
  },
  {
    icon: Heart,
    label: 'Confidence & Mindset',
    text: 'I get nervous when speaking English in front of senior colleagues. How do I manage this?'
  },
  {
    icon: HelpCircle,
    label: 'Clarity & Structure',
    text: 'Can you teach me how to structure an impromptu project status update?'
  }
];

export const NormalAIExperience: React.FC<NormalAIExperienceProps> = ({
  onOpenCommunicationMastery
}) => {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState<NormalAiConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<NormalAiMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('English / Telugu');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedReasoningMsgIds, setExpandedReasoningMsgIds] = useState<Record<string, boolean>>({});

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoningMsgIds(prev => ({
      ...prev,
      [msgId]: prev[msgId] === undefined ? false : !prev[msgId]
    }));
  };

  // Long-press and context menu state for conversation deletion
  const [contextMenuConv, setContextMenuConv] = useState<{
    id: string;
    title: string;
    x?: number;
    y?: number;
  } | null>(null);
  const [convToDelete, setConvToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [pressingConvId, setPressingConvId] = useState<string | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggeredRef = useRef<boolean>(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const selectedConvIdRef = useRef<string | null>(null);
  const activeRequestSeqRef = useRef<number>(0);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(prev => (prev === text ? null : prev));
    }, 2200);
  };

  useEffect(() => {
    loadConversations();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
      if (list.length > 0) {
        selectConversation(list[0].id);
      } else {
        createNewConversation();
      }
    } catch (err: any) {
      if (err?.status === 401) return;
      console.warn('Could not load conversations:', err?.message || err);
    }
  };

  const selectConversation = async (convId: string) => {
    const seq = ++activeRequestSeqRef.current;
    selectedConvIdRef.current = convId;
    setActiveConversationId(convId);
    setIsLoading(false);
    setEditingMessageId(null);
    try {
      const data = await api.getConversation(convId);
      // Guard against stale async responses restoring messages for an unselected or deleted conversation
      if (seq === activeRequestSeqRef.current && selectedConvIdRef.current === convId) {
        setMessages(data.messages || []);
      }
    } catch (err: any) {
      if (err?.status === 401) return;
      console.warn('Could not get conversation:', err?.message || err);
    } finally {
      if (seq === activeRequestSeqRef.current) {
        setIsSidebarOpen(false);
      }
    }
  };

  const createNewConversation = async () => {
    try {
      const newConv = await api.createConversation();
      setConversations(prev => [newConv, ...prev.filter(c => c.id !== newConv.id)]);
      setActiveConversationId(newConv.id);
      selectedConvIdRef.current = newConv.id;
      setMessages([]);
      setEditingMessageId(null);
      setIsSidebarOpen(false);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  const handleConfirmDeleteConversation = async () => {
    if (!convToDelete) return;
    const convId = convToDelete.id;
    setConvToDelete(null);
    setContextMenuConv(null);

    // If active conversation is being deleted, abort any active streaming response
    if (activeConversationId === convId && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }

    try {
      // 1. Wait for delete API request to succeed first
      await api.deleteConversation(convId);

      // 2. Fetch fresh synchronized list from server
      const freshList = await api.getConversations();
      setConversations(freshList);

      // 3. If the deleted conversation was active:
      if (activeConversationId === convId) {
        if (freshList.length > 0) {
          // Select next available conversation after deletion succeeds
          await selectConversation(freshList[0].id);
        } else {
          // Create new conversation only after deletion succeeds if none remain
          await createNewConversation();
        }
      }
      showToast('Conversation deleted');
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      showToast('Failed to delete conversation');
      try {
        const freshList = await api.getConversations();
        setConversations(freshList);
      } catch (_) {}
    }
  };

  const handleTouchStartConv = (conv: NormalAiConversation, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    isLongPressTriggeredRef.current = false;
    setPressingConvId(conv.id);

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      setPressingConvId(null);
      // Trigger haptic if supported
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(50);
        } catch (_) {}
      }
      setContextMenuConv({
        id: conv.id,
        title: conv.title || 'New Conversation'
      });
    }, 500);
  };

  const handleTouchMoveConv = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);
    // If the user scrolls, cancel long press
    if (dx > 10 || dy > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setPressingConvId(null);
    }
  };

  const handleTouchEndConv = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setPressingConvId(null);
  };

  const handleContextMenuConv = (e: React.MouseEvent, conv: NormalAiConversation) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuConv({
      id: conv.id,
      title: conv.title || 'New Conversation',
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleStartEdit = (msg: NormalAiMessage) => {
    setEditingMessageId(msg.id);
    setEditInputText(msg.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditInputText('');
  };

  const handleSaveEdit = (msgId: string) => {
    if (!editInputText.trim() || isLoading) return;
    handleSendMessage(editInputText, msgId);
  };

  const handleSendMessage = async (customText?: string, editMessageId?: string) => {
    const textToSend = customText !== undefined ? customText : inputText;
    if (!textToSend.trim() || isLoading) return;

    if (customText === undefined) {
      setInputText('');
    }

    let currentConvId = activeConversationId;
    if (!currentConvId) {
      const newConv = await api.createConversation();
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      currentConvId = newConv.id;
    }

    // If editMessageId is provided, remove that message and all subsequent messages from current state immediately
    if (editMessageId) {
      const targetIdx = messages.findIndex(m => m.id === editMessageId);
      if (targetIdx !== -1) {
        setMessages(prev => prev.slice(0, targetIdx));
      }
    }

    const tempUserMsgId = `temp-u-${Date.now()}`;
    const tempUserMsg: NormalAiMessage = {
      id: tempUserMsgId,
      conversationId: currentConvId,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString()
    };

    const tempAssistantMsgId = `temp-a-${Date.now()}`;
    const tempAssistantMsg: NormalAiMessage = {
      id: tempAssistantMsgId,
      conversationId: currentConvId,
      role: 'model',
      content: '',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg, tempAssistantMsg]);
    setIsLoading(true);
    setEditingMessageId(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedAssistantText = '';

    try {
      await api.streamNormalAIMessage(
        currentConvId,
        {
          message: textToSend,
          editMessageId
        },
        {
          onStart: (data) => {
            if (controller.signal.aborted) return;
            setMessages(prev => {
              let updated = prev;
              if (data.removedMessageIds && data.removedMessageIds.length > 0) {
                updated = updated.filter(m => !data.removedMessageIds!.includes(m.id));
              }
              return updated.map(m => (m.id === tempUserMsgId ? data.userMessage : m));
            });
          },
          onStep: (step) => {
            if (controller.signal.aborted) return;
            setMessages(prev =>
              prev.map(m => {
                if (m.id !== tempAssistantMsgId) return m;
                const existing = m.reasoningSteps || [];
                const idx = existing.findIndex(s => s.id === step.id);
                const updated = idx >= 0
                  ? existing.map((s, i) => (i === idx ? step : s))
                  : [...existing, step];
                return { ...m, reasoningSteps: updated };
              })
            );
          },
          onDelta: (chunkText) => {
            if (controller.signal.aborted) return;
            accumulatedAssistantText += chunkText;
            setMessages(prev =>
              prev.map(m =>
                m.id === tempAssistantMsgId
                  ? { ...m, content: accumulatedAssistantText }
                  : m
              )
            );
          },
          onDone: (data) => {
            if (controller.signal.aborted) return;
            setMessages(prev =>
              prev.map(m =>
                m.id === tempAssistantMsgId ? data.assistantMessage : m
              )
            );

            if (data.conversation?.title) {
              setConversations(prev =>
                prev.map(c =>
                  c.id === currentConvId ? { ...c, title: data.conversation.title } : c
                )
              );
            }

            if (data.switchedLanguage) {
              setActiveLanguage(data.switchedLanguage);
            }

            if (isVoiceActive && data.assistantMessage?.content) {
              mentorVoice.speakNatural(data.assistantMessage.content);
            }
          },
          onError: (err) => {
            if (controller.signal.aborted || (err as any)?.name === 'AbortError') return;
            console.error('Stream error callback:', err);
          }
        },
        controller.signal
      );
    } catch (err: any) {
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        // User clicked Stop
        setMessages(prev => {
          if (!accumulatedAssistantText.trim()) {
            return prev.filter(m => m.id !== tempAssistantMsgId);
          }
          return prev.map(m =>
            m.id === tempAssistantMsgId
              ? {
                  ...m,
                  content: accumulatedAssistantText
                }
              : m
          );
        });
        return;
      }
      console.error('Message stream error:', err);
      setMessages(prev =>
        prev.map(m =>
          m.id === tempAssistantMsgId
            ? {
                ...m,
                content:
                  accumulatedAssistantText ||
                  'I had trouble connecting for a moment. Please ask again.'
              }
            : m
        )
      );
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

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        activeLanguage.includes('Telugu')
          ? 'te-IN'
          : activeLanguage.includes('Hindi')
          ? 'hi-IN'
          : 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInputText(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] text-zinc-900 antialiased overflow-hidden font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-zinc-50 border-r border-zinc-200 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & New Conversation */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-display font-bold text-xs shadow-xs">
                S
              </div>
              <div>
                <h1 className="text-sm font-display font-bold text-zinc-900">
                  Sākshi
                </h1>
                <p className="text-[10px] text-zinc-500 font-mono">Conversational AI</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Conversation Button */}
          <button
            type="button"
            onClick={createNewConversation}
            className="w-full py-2.5 px-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/80 transition-all font-medium text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-zinc-600" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            Recent Conversations
          </div>
          {conversations.map(conv => {
            const isActive = conv.id === activeConversationId;
            const isPressing = pressingConvId === conv.id;
            const isMenuOpen = contextMenuConv?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => {
                  if (!isLongPressTriggeredRef.current) {
                    selectConversation(conv.id);
                  }
                }}
                onContextMenu={e => handleContextMenuConv(e, conv)}
                onTouchStart={e => handleTouchStartConv(conv, e)}
                onTouchMove={handleTouchMoveConv}
                onTouchEnd={handleTouchEndConv}
                onTouchCancel={handleTouchEndConv}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer select-none transition-all duration-150 active:scale-[0.98] ${
                  isPressing
                    ? 'scale-[0.97] bg-zinc-200/90 ring-1 ring-zinc-300'
                    : isMenuOpen
                    ? 'bg-zinc-100 ring-1 ring-zinc-300'
                    : isActive
                    ? 'bg-white text-zinc-950 font-semibold shadow-2xs border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
                title="Click to open · Long-press or right-click for options"
              >
                <div className="flex items-center gap-2.5 truncate flex-1">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'
                    }`}
                  />
                  <span className="truncate">{conv.title || 'New Conversation'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Communication Mastery World Portal */}
        <div className="p-3 border-t border-zinc-200 space-y-2 bg-white">
          <button
            type="button"
            onClick={onOpenCommunicationMastery}
            className="w-full text-left p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-zinc-800" />
                <span className="text-xs font-display font-bold text-zinc-900">
                  Communication Mastery
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-zinc-500 leading-tight">
              12 Worlds · 75 Interactive Levels
            </p>
          </button>

          {/* User Account Bar */}
          <div className="pt-1 flex items-center justify-between text-xs text-zinc-600 px-1">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-md bg-zinc-200 text-zinc-800 text-[10px] font-bold flex items-center justify-center">
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="truncate text-zinc-800 font-medium text-xs">
                {user?.displayName || 'Learner'}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONVERSATIONAL CHAT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        {/* Top Header */}
        <header className="h-14 px-4 sm:px-6 border-b border-zinc-200 bg-white/95 backdrop-blur-xs flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-display font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-md">
                {activeConv?.title || 'New Conversation'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language status chip */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-700 font-medium">
              <Languages className="w-3 h-3 text-zinc-500" />
              <span>{activeLanguage}</span>
            </div>

            {/* Voice toggle */}
            <button
              type="button"
              onClick={() => {
                if (isVoiceActive) {
                  mentorVoice.stop();
                }
                setIsVoiceActive(prev => !prev);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isVoiceActive
                  ? 'bg-zinc-900 border-zinc-900 text-white'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
              title={isVoiceActive ? 'Voice output enabled' : 'Voice output muted'}
            >
              {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Direct Communication Mastery button in header */}
            <button
              type="button"
              onClick={onOpenCommunicationMastery}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Communication Mastery</span>
              <span className="sm:hidden">Mastery</span>
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 bg-[#f8f9fa]">
          {messages.length === 0 ? (
            /* Empty State / Welcome Screen */
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center space-y-6 py-8 animate-subtle-fade">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                <MessageSquare className="w-6 h-6" />
              </div>

              <div className="space-y-2 max-w-lg">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 tracking-tight">
                  How can I help you today?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  I can help with studies, college exams, career decisions, coding, and communication clarity.
                  You can speak naturally in English, Telugu, or Tenglish.
                </p>
                <p className="text-[11px] text-zinc-500 italic">
                  Tip: Type "English lo matladu" or "Telugu lo matladu" anytime to switch language.
                </p>
              </div>

              {/* Starter Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2">
                {STARTER_PROMPTS.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt.text)}
                      className="p-3.5 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 text-left transition-all group flex flex-col justify-between gap-2 shadow-2xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-800" />
                        <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
                          {prompt.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-800 font-medium leading-snug">
                        "{prompt.text}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Conversation Messages */
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isCopied = copiedMessageId === msg.id;
                const isEditing = editingMessageId === msg.id;
                const isLatestMessage = index === messages.length - 1;

                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs text-[10px] font-bold font-mono">
                        AI
                      </div>
                    )}

                    <div
                      className={`group relative max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs transition-all ${
                        isUser
                          ? 'bg-zinc-900 text-white font-medium rounded-br-xs'
                          : 'bg-white border border-zinc-200 text-zinc-900 rounded-bl-xs'
                      }`}
                    >
                      {/* USER BUBBLE: INLINE EDIT MODE OR REGULAR VIEW */}
                      {isUser ? (
                        isEditing ? (
                          <div className="w-full min-w-[260px] sm:min-w-[340px] space-y-2.5">
                            <div className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                              <Pencil className="w-3 h-3 text-zinc-400" />
                              <span>Edit your prompt</span>
                            </div>
                            <textarea
                              value={editInputText}
                              onChange={e => setEditInputText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSaveEdit(msg.id);
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                              rows={Math.min(6, Math.max(2, editInputText.split('\n').length))}
                              className="w-full px-3 py-2 text-xs sm:text-sm bg-zinc-800 text-white rounded-xl border border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-zinc-400 resize-none font-sans"
                              autoFocus
                            />
                            <div className="flex items-center justify-between text-[11px] pt-0.5">
                              <span className="text-zinc-400 text-[10px]">
                                Enter to submit · Esc to cancel
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer text-xs"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(msg.id)}
                                  disabled={!editInputText.trim() || isLoading}
                                  className="px-3 py-1 rounded-lg bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 text-xs shadow-xs"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Submit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-wrap">{msg.content}</div>

                            {/* User Bubble Hover/Tap Action Bar (Edit, Copy) */}
                            <div className="pt-2 mt-1.5 border-t border-zinc-800/90 flex items-center justify-end gap-1 text-[11px] text-zinc-400 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(msg)}
                                disabled={isLoading}
                                className="px-1.5 py-0.5 rounded hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-40"
                                title="Edit message"
                              >
                                <Pencil className="w-3 h-3" />
                                <span className="text-[10px]">Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="px-1.5 py-0.5 rounded hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1"
                                title="Copy text"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span className="text-[10px]">Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </>
                        )
                      ) : (
                        /* AI BUBBLE CONTENT & ACTIONS */
                        <>
                          {/* Visible Research & Reasoning Steps Accordion (ChatGPT & Gemini style) */}
                          {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (() => {
                            const isExpanded = expandedReasoningMsgIds[msg.id] !== undefined
                              ? expandedReasoningMsgIds[msg.id]
                              : (isLoading && isLatestMessage);
                            const hasActiveStep = msg.reasoningSteps.some(s => s.status === 'in_progress');
                            const activeStep = msg.reasoningSteps.find(s => s.status === 'in_progress') || msg.reasoningSteps[msg.reasoningSteps.length - 1];

                            return (
                              <div className="mb-3 rounded-xl border border-zinc-200/90 bg-zinc-50/70 overflow-hidden text-xs transition-all shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => toggleReasoning(msg.id)}
                                  className="w-full px-3 py-2 flex items-center justify-between text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors cursor-pointer text-left"
                                >
                                  <div className="flex items-center gap-2 font-medium min-w-0">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span className="truncate">
                                      {isLoading && isLatestMessage && hasActiveStep
                                        ? (activeStep?.label || 'Deep Researching...')
                                        : `Deep Research (${msg.reasoningSteps.length} step${msg.reasoningSteps.length > 1 ? 's' : ''})`}
                                    </span>
                                    {isLoading && isLatestMessage && hasActiveStep && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                      {isExpanded ? 'Hide' : 'Show steps'}
                                    </span>
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </div>
                                </button>

                                {isExpanded && (
                                  <div className="px-3 pb-2.5 pt-1.5 border-t border-zinc-200/60 space-y-2 bg-white/60">
                                    {msg.reasoningSteps.map((step) => {
                                      const isDone = step.status === 'completed';
                                      const isInProgress = step.status === 'in_progress';
                                      return (
                                        <div key={step.id} className="flex items-start gap-2 text-[11px] leading-relaxed">
                                          <div className="pt-0.5 shrink-0">
                                            {isDone ? (
                                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : isInProgress ? (
                                              <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                                            ) : (
                                              <CircleDashed className="w-3.5 h-3.5 text-zinc-300" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className={`font-medium ${
                                              isDone
                                                ? 'text-zinc-700'
                                                : isInProgress
                                                ? 'text-zinc-950 font-semibold'
                                                : 'text-zinc-400'
                                            }`}>
                                              {step.label}
                                            </div>
                                            {step.detail && (
                                              <p className="text-[10px] text-zinc-500 mt-0.5">{step.detail}</p>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* If content is still empty and currently loading, and no reasoning steps yet, show smooth bounce dots */}
                          {!msg.content && isLoading && isLatestMessage && (!msg.reasoningSteps || msg.reasoningSteps.length === 0) ? (
                            <div className="flex items-center gap-2 py-1 text-zinc-500 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                                style={{ animationDelay: '150ms' }}
                              />
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                                style={{ animationDelay: '300ms' }}
                              />
                              <span className="ml-1 text-[11px] font-mono text-zinc-500">
                                Connecting to Sākshi...
                              </span>
                            </div>
                          ) : msg.content ? (
                            <div className="whitespace-pre-wrap">
                              {msg.content}
                              {/* Pulsing cursor while tokens are actively streaming */}
                              {isLoading && isLatestMessage && (
                                <span className="inline-block w-1.5 h-4 ml-0.5 bg-zinc-500 animate-pulse align-middle" />
                              )}
                            </div>
                          ) : null}

                          {/* Google Search Grounding Sources / Citations */}
                          {msg.groundingSources && msg.groundingSources.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-zinc-100">
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 mb-1.5">
                                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Sources & Web Grounding Citations</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
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
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-[11px] text-zinc-700 hover:text-zinc-950 transition-colors max-w-full group"
                                      title={source.title || source.uri}
                                    >
                                      <span className="w-4 h-4 rounded-full bg-zinc-200/80 text-zinc-600 flex items-center justify-center text-[9px] font-mono shrink-0">
                                        {sIdx + 1}
                                      </span>
                                      <span className="truncate max-w-[180px] font-medium">
                                        {source.title || domain}
                                      </span>
                                      <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 shrink-0" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* AI Bubble Action Bar (Listen, Copy) */}
                          {msg.content && (
                            <div className="pt-2 mt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
                              <span className="font-mono text-zinc-400">Sākshi</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => mentorVoice.speakNatural(msg.content)}
                                  className="p-1 rounded hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                                  title="Listen via natural voice"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                                  className="px-1.5 py-0.5 rounded hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer flex items-center gap-1"
                                  title="Copy text"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="text-[10px]">Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Message Input Box */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white shrink-0">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end gap-2 bg-zinc-50 border border-zinc-300 rounded-2xl p-2 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-all shadow-2xs"
            >
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything in English, Telugu, or Tenglish..."
                rows={1}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none resize-none max-h-32 min-h-[40px]"
              />

              <div className="flex items-center gap-1.5 shrink-0 pb-1 pr-1">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'
                  }`}
                  title={isRecording ? 'Listening... click to stop' : 'Speak to input'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type={isLoading ? 'button' : 'submit'}
                  onClick={isLoading ? handleStopGeneration : undefined}
                  disabled={!isLoading && !inputText.trim()}
                  className={`p-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center ${
                    isLoading
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 ring-2 ring-zinc-400'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none'
                  }`}
                  title={isLoading ? 'Stop generation' : 'Send message (Enter)'}
                  aria-label={isLoading ? 'Stop generation' : 'Send message'}
                >
                  {isLoading ? (
                    <Square className="w-3.5 h-3.5 fill-current text-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 px-2 pt-2">
              <span>Press Enter to send · Shift+Enter for newline</span>
              <span>Fast direct response · Type "deep research" for in-depth analysis</span>
            </div>
          </div>
        </div>
      </main>

      {/* Context Menu / Bottom Sheet for Conversation Actions */}
      {contextMenuConv && (
        <div
          className="fixed inset-0 z-50 bg-black/30 sm:bg-transparent backdrop-blur-2xs sm:backdrop-blur-none flex sm:block items-end sm:items-stretch"
          onClick={() => setContextMenuConv(null)}
        >
          {/* Mobile Bottom Sheet (slides up from bottom on mobile) */}
          <div
            className="sm:hidden w-full bg-white rounded-t-3xl p-5 border-t border-zinc-200 shadow-2xl space-y-3 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-zinc-300 rounded-full mx-auto mb-2" />

            <div className="flex items-center gap-3 px-1 pb-2 border-b border-zinc-100">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {contextMenuConv.title}
                </p>
                <p className="text-[11px] text-zinc-400">Conversation options</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const target = contextMenuConv;
                setContextMenuConv(null);
                setConvToDelete({ id: target.id, title: target.title });
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 active:bg-rose-100 text-rose-600 font-medium text-xs transition-colors cursor-pointer border border-rose-100"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-100/90 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-rose-600">Delete Chat</p>
                <p className="text-[10px] text-rose-500/80">Permanently delete this conversation thread</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setContextMenuConv(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-700 font-medium text-xs text-center cursor-pointer hover:bg-zinc-200 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Desktop Floating Context Popup Menu */}
          <div
            className="hidden sm:block fixed z-50 bg-white rounded-xl shadow-xl border border-zinc-200 py-1.5 min-w-[190px] animate-scale-in"
            style={{
              left: Math.min(contextMenuConv.x ?? 180, window.innerWidth - 210),
              top: Math.min(contextMenuConv.y ?? 200, window.innerHeight - 100)
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-3 py-1 text-[10px] font-mono text-zinc-400 border-b border-zinc-100 truncate max-w-[180px]">
              {contextMenuConv.title}
            </div>
            <button
              type="button"
              onClick={() => {
                const target = contextMenuConv;
                setContextMenuConv(null);
                setConvToDelete({ id: target.id, title: target.title });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Delete Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Conversation Confirmation Modal */}
      {convToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConvToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-zinc-200 space-y-4 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-display font-bold text-zinc-950">
                  Delete conversation?
                </h3>
                <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                  "{convToDelete.title}"
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Delete this conversation? This cannot be undone. All messages in this thread will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConvToDelete(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteConversation}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 px-3.5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-medium shadow-lg flex items-center gap-2 border border-zinc-700 animate-slide-up">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
