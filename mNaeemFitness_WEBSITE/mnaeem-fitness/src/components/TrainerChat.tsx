import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Send,
  Sparkles,
  MessageSquare,
  Flame,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { ChatMessage } from "../types";

interface TrainerChatProps {
  onNotification: (title: string, body: string) => void;
}

const PRESET_MESSAGES = [
  "How can I break my plateaus in Squats?",
  "What is the best macro ratio for dry shredding?",
  "Give me a brutal motivation boost, Coach!",
  "Tell me about your Elite Trainer Plan benefits.",
];

export default function TrainerChat({ onNotification }: TrainerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mnaeem_chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(getDefaultChat());
      }
    } else {
      const defaults = getDefaultChat();
      setMessages(defaults);
      localStorage.setItem("mnaeem_chat", JSON.stringify(defaults));
    }
  }, []);

  useEffect(() => {
    fetch("/api/free-chat/status")
      .then((res) => res.json())
      .then((data) => setAiConfigured(Boolean(data.configured)))
      .catch(() => setAiConfigured(false));
  }, []);

  const getDefaultChat = (): ChatMessage[] => [
    {
      id: "welcome",
      sender: "trainer",
      text: "Let's get those gains, brother! I am Coach mNaeem. Whether you are prepping for a show, breaking through flatlines, or starting your fitness metamorphosis, I am here to build your physique. Ask me anything about your splits, macros, or our memberships!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  // Auto Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const saveMessages = (updated: ChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem("mnaeem_chat", JSON.stringify(updated));
  };

  const sanitizeResponse = (text: string) =>
    text
      .replace(/^\[(Local )?Coach mNaeem\]\s*/i, "")
      .replace(/\n\n\(Note: Configure GEMINI_API_KEY.*\)$/s, "")
      .trim();

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [...messages, userMsg];
    saveMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/free-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      setAiConfigured(Boolean(data.configured ?? response.ok));

      const trainerMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: "trainer",
        text: sanitizeResponse(
          data.text || "Let's smash this session! Push past your boundaries.",
        ),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      saveMessages([...updated, trainerMsg]);
      onNotification(
        "Coach mNaeem Replied 💬",
        "Open your inbox to read Coach's response.",
      );
    } catch (e) {
      console.error(e);
      const trainerMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: "trainer",
        text: "Connection issue on my end. Check your network and try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      saveMessages([...updated, trainerMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    const defaults = getDefaultChat();
    saveMessages(defaults);
  };

  return (
    <div
      id="trainer-chat-section"
      className="w-full bg-brand-obsidian py-16 md:py-24 border-b border-zinc-900"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-brand-amber tracking-widest uppercase flex items-center justify-center gap-1.5">
            <MessageSquare size={14} />
            DIRECT COMMAND CHAT
          </span>
          <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mt-3 tracking-tight">
            CHAT WITH{" "}
            <span className="text-brand-amber text-glow-amber">
              COACH MNAEEM
            </span>
          </h3>
          <p className="mt-3 text-zinc-400 text-xs md:text-sm max-w-xl mx-auto">
            Get instant expert guidance directly from Coach mNaeem with a free
            AI Coach chat. Perfect your form, resolve muscle plateaus, and
            optimize daily food groups in real-time.
          </p>
          {aiConfigured === false && (
            <p className="mt-4 text-amber-400/90 text-xs font-mono max-w-xl mx-auto border border-amber-500/20 bg-amber-500/10 rounded-lg px-4 py-2">
              Live AI coaching is unavailable right now. Check your network and
              try again.
            </p>
          )}
        </div>

        {/* Chat Interface Container */}
        <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[550px] glow-box-amber">
          {/* Active Chat Header */}
          <div className="bg-zinc-950 border-b border-zinc-850 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Coach Avatar Circle */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-brand-amber/15 border border-brand-amber flex items-center justify-center text-brand-amber font-display font-extrabold text-sm">
                  MN
                </div>
                {/* Active Indicator Pulse */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                  Coach mNaeem
                  <span className="bg-brand-amber/10 text-brand-amber text-[8px] font-mono px-1.5 py-0.5 rounded border border-brand-amber/20">
                    IFBB ELITE
                  </span>
                </h4>
                <p className="text-[10px] text-zinc-500 font-mono">
                  ONLINE • READY FOR GAINS
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="text-zinc-500 hover:text-zinc-300 text-xs font-mono p-1 rounded hover:bg-zinc-900 transition-all cursor-pointer"
            >
              RESET CHANNEL
            </button>
          </div>

          {/* Chat Messages Scrolling Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-950/20"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {msg.sender === "trainer" && (
                  <div className="w-6 h-6 rounded-full bg-brand-amber/20 flex items-center justify-center text-brand-amber text-[9px] font-bold font-display shrink-0 border border-brand-amber/30">
                    M
                  </div>
                )}

                <div className="max-w-[75%] md:max-w-[65%] space-y-1">
                  <div
                    className={`p-4 rounded-xl text-xs md:text-sm font-sans leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-zinc-850 border border-zinc-800 text-white rounded-br-none"
                        : "bg-brand-amber/10 border border-brand-amber/20 text-zinc-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[9px] text-zinc-600 font-mono ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === "user" && (
                      <CheckCheck size={10} className="text-brand-amber" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Loader Indicators */}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-amber/20 flex items-center justify-center text-brand-amber text-[9px] font-bold shrink-0">
                  M
                </div>
                <div className="bg-brand-amber/5 border border-brand-amber/10 rounded-xl px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick presets list */}
          <div className="px-6 py-2 border-t border-zinc-850 bg-zinc-950/40 overflow-x-auto flex gap-2 scrollbar-none">
            {PRESET_MESSAGES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded px-3 py-1 text-[10px] font-mono whitespace-nowrap transition-all duration-200 cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Message Input Footer Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="bg-zinc-950 border-t border-zinc-850 px-6 py-4 flex gap-4 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell mNaeem what we are training today..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-brand-amber transition-colors font-sans"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian p-2.5 rounded transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:hover:bg-brand-amber cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
