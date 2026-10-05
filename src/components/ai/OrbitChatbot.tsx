'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { queryOrbitAI, RetrievalResult } from '@/lib/retrievalEngine';
import { ChatMessage } from '@/types';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ExternalLink, 
  RefreshCw, 
  HelpCircle,
  BookOpen,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export const OrbitChatbot: React.FC = () => {
  const { section, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialGreeting: ChatMessage = {
    id: 'msg-welcome',
    sender: 'assistant',
    content: `Greetings ${user?.full_name || 'Student'}! I am **ORBIT AI**, your verified academic retrieval assistant for IPS Academy (**Section ${section}**). Ask me anything about your timetable, faculty cabin hours, pending assignments, or notes in orbit.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: []
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  // When user section changes, update welcome context if needed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const suggestedQuestions = [
    'Where are my PPS notes?',
    'What assignments are pending?',
    `Who teaches OMP in ${section}?`,
    "What is today's timetable?",
    'Show Engineering Graphics resources',
    'Are there any new announcements?',
    'Where can I find lab files?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate short realistic local retrieval delay
    setTimeout(() => {
      const result: RetrievalResult = queryOrbitAI(queryText, section);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: 'assistant',
        content: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: result.sources,
        isFallback: result.isFallback
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* Floating Orbital Chatbot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open ORBIT AI Assistant"
          className="relative group p-4 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-white/20"
        >
          {/* Pulsing orbital rings around the button */}
          <div className="absolute -inset-1.5 rounded-full border border-cyan-400/40 animate-ping opacity-60 pointer-events-none" />
          <div className="absolute -inset-3 rounded-full border border-violet-400/30 opacity-40 animate-spin-slow pointer-events-none" />

          {isOpen ? (
            <X className="w-6 h-6 transform transition-transform group-hover:rotate-90 duration-300" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300 border-2 border-slate-950 animate-bounce" />
            </div>
          )}
        </button>
      </div>

      {/* Modern Futuristic Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-40 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm tracking-wide">ORBIT AI</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {section}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Direct Knowledge Retrieval Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([initialGreeting])}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggested Prompt Chips */}
          <div className="p-2.5 bg-slate-900/50 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sq)}
                className="px-2.5 py-1 rounded-full whitespace-nowrap bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40 border border-slate-700/60 text-slate-300 text-[11px] transition-all flex items-center gap-1 flex-shrink-0"
              >
                <span>{sq}</span>
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-cyan-600/20'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>

                  {/* Render Sources / Document Citations if available */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] font-semibold text-cyan-400 tracking-wider uppercase flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        Verified Orbit Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:border-cyan-500/50 transition-colors"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            <span className="font-medium truncate max-w-[170px]">{src.title}</span>
                            {src.link && (
                              <Link
                                href={src.link}
                                onClick={() => setIsOpen(false)}
                                className="text-cyan-400 hover:text-cyan-300 ml-0.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.isFallback && (
                    <div className="mt-2 text-[10px] text-amber-400/90 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Tip: Ask about faculty names, today's classes, or syllabus notes.
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-slate-900/40 rounded-xl max-w-[200px] border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-cyan-300">Searching Orbit records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about timetable, notes, faculty..."
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
