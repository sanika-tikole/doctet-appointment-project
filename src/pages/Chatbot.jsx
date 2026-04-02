import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Trash2, MessageCircle } from 'lucide-react';
import axios from 'axios';
import ChatMessage from '../components/ChatMessage';

const QUICK_SUGGESTIONS = [
  { label: '📅 Book an appointment', text: 'How do I book an appointment?' },
  { label: '📋 View my appointments', text: 'Where can I see my appointments?' },
  { label: '🩺 Register as doctor', text: 'How do I register as a doctor?' },
  { label: '❌ Cancel appointment', text: 'How do I cancel an appointment?' },
  { label: '🔍 Find by specialization', text: 'How do I find doctors by specialization?' },
  { label: '✨ Platform features', text: 'What features does MediBook provide?' },
];

const WELCOME_MESSAGE = {
  role: 'bot',
  text: "Hello! I'm your MediBook Assistant 🏥\n\nI'm here to help you navigate and use the MediBook healthcare booking platform. I can guide you through:\n\n• Booking appointments\n• Finding doctors\n• Managing your health records\n• Understanding platform features\n\nNote: I do not provide medical diagnosis or advice. For medical concerns, please consult a qualified healthcare professional.\n\nHow can I assist you today?",
  timestamp: new Date().toISOString(),
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', text: trimmed, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/chat`, { message: trimmed });
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: data.reply || "I couldn't process that. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "I'm having trouble connecting right now. Please make sure the server is running and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date().toISOString() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C9BEFF]/20 to-[#FFDBFD]/40">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6367FF] to-[#8494FF] shadow-lg mb-4">
            <Bot size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            MediBook <span className="text-[#6367FF]">Assistant</span>
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            AI-powered platform guidance. Ask me anything about using MediBook.
          </p>
          <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online · Powered by Groq AI
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col" style={{ height: '600px' }}>

          {/* Chat Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle size={15} className="text-[#6367FF]" />
              <span>{messages.length - 1} message{messages.length !== 2 ? 's' : ''}</span>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={13} />
              Clear chat
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-end gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6367FF] to-[#8494FF] flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-[#FFDBFD] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6367FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#6367FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#6367FF] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && !loading && (
            <div className="px-6 pb-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2.5 mt-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => sendMessage(q.text)}
                    className="text-xs text-[#6367FF] bg-[#FFDBFD] hover:bg-[#8494FF] hover:text-white border border-[#C9BEFF]/60 px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-5 py-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#6367FF]/20 focus-within:border-[#6367FF]/40 transition-all px-4 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about booking, doctors, appointments, features..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                disabled={loading}
                maxLength={500}
              />
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-300">{input.length}/500</span>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6367FF] to-[#8494FF] flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-sm"
                  aria-label="Send message"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              This assistant provides platform guidance only — not medical advice.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '📅', title: 'Book Appointments', desc: 'Learn how to find and book doctors in minutes' },
            { icon: '🔍', title: 'Find Specialists', desc: 'Discover how to filter doctors by specialization' },
            { icon: '📋', title: 'Manage Records', desc: 'View and manage all your appointment history' },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{card.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
