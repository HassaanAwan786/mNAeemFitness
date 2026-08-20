import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, BellRing, Check, X, Info, Dumbbell, Calendar, Heart, Volume2, ShieldCheck } from "lucide-react";
import { NotificationItem } from "../types";

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkRead: (id: number) => void;
  onClearAll: () => void;
}

export default function NotificationCenter({ notifications, onMarkRead, onClearAll }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleTogglePush = () => {
    setPushEnabled(!pushEnabled);
    if (!pushEnabled) {
      alert("Push notifications successfully armed! You will receive live alerts for logs and bookings.");
    }
  };

  return (
    <div className="relative">
      {/* Interactive Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-brand-amber text-zinc-300 hover:text-white transition-all cursor-pointer"
        aria-label="Notification Center"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing size={18} className="text-brand-amber animate-bounce" />
            <span className="absolute -top-1 -right-1 bg-brand-amber text-brand-obsidian font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-zinc-950">
              {unreadCount}
            </span>
          </>
        ) : (
          <Bell size={18} />
        )}
      </button>

      {/* Notification Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click closer */}
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 md:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-40 p-4 space-y-4 font-sans text-xs"
            >
              {/* Panel Header */}
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <Bell size={14} className="text-brand-amber" />
                  <h4 className="font-display font-extrabold text-sm text-white tracking-tight">
                    ALERT SYSTEM ENGINE
                  </h4>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-[10px] text-zinc-500 hover:text-white font-mono cursor-pointer"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {/* Push System Controls */}
              <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-200">PUSH COMPLIANCE REMINDERS</div>
                  <div className="text-[9px] text-zinc-500 font-mono">LIVE SOUNDS & SYSTEM ALERTS</div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      soundEnabled ? "text-brand-amber bg-brand-amber/10" : "text-zinc-600 hover:text-zinc-400"
                    }`}
                    title="Toggle sound cues"
                  >
                    <Volume2 size={13} />
                  </button>

                  {/* Push toggle button */}
                  <button
                    onClick={handleTogglePush}
                    className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer uppercase ${
                      pushEnabled
                        ? "bg-brand-amber/15 border border-brand-amber/30 text-brand-amber"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                    }`}
                  >
                    {pushEnabled ? "ARMED" : "OFFLINE"}
                  </button>
                </div>
              </div>

              {/* Alerts List */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 italic">
                    All clear. No active alert logs queued.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkRead(n.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex gap-3 ${
                        n.read
                          ? "bg-zinc-950/20 border-zinc-850 text-zinc-400"
                          : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-100"
                      }`}
                    >
                      {/* Icon matcher based on title keying */}
                      <div className="shrink-0 mt-0.5">
                        {n.title.toLowerCase().includes("workout") ? (
                          <Dumbbell size={14} className="text-brand-amber" />
                        ) : n.title.toLowerCase().includes("session") || n.title.toLowerCase().includes("slot") ? (
                          <Calendar size={14} className="text-amber-500" />
                        ) : (
                          <Info size={14} className="text-zinc-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="font-bold text-[11px] leading-tight flex items-center gap-1.5">
                          {n.title}
                          {!n.read && (
                            <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-ping" />
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-snug">{n.body}</p>
                        <span className="text-[8px] text-zinc-600 font-mono block">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {!n.read && (
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check size={12} className="text-brand-amber" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="text-center border-t border-zinc-800 pt-3 text-[9px] text-zinc-600 font-mono flex items-center justify-center gap-1.5">
                <ShieldCheck size={11} />
                SECURED COMPLIANCE NOTIFICATION DRIVER
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
