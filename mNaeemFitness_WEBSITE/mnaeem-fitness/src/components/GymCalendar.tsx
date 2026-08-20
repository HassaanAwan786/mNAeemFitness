import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, Clock, User, Plus, Check, Trash2, Dumbbell, Sparkles } from "lucide-react";
import { Booking } from "../types";

// Seed active upcoming bookings so the calendar is visually pristine
const SEED_BOOKINGS: Booking[] = [
  { id: "b1", type: "trainer", title: "Contest Prep Coaching", date: "2026-06-30", time: "10:00 AM", status: "Confirmed" },
  { id: "b2", type: "gym", title: "Heavy Leg Routine Slot", date: "2026-07-01", time: "06:00 PM", status: "Confirmed" },
  { id: "b3", type: "trainer", title: "Form Audit — Squats & Deadlifts", date: "2026-07-03", time: "11:30 AM", status: "Pending" }
];

interface GymCalendarProps {
  onSessionBooked: (title: string, date: string, time: string) => void;
  onNotification: (title: string, body: string) => void;
}

export default function GymCalendar({ onSessionBooked, onNotification }: GymCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Booking creation state
  const [showModal, setShowModal] = useState(false);
  const [bookingType, setBookingType] = useState<"gym" | "trainer">("gym");
  const [title, setTitle] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00 AM");
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const saved = localStorage.getItem("mnaeem_bookings");
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        setBookings(SEED_BOOKINGS);
      }
    } else {
      setBookings(SEED_BOOKINGS);
      localStorage.setItem("mnaeem_bookings", JSON.stringify(SEED_BOOKINGS));
    }
  }, []);

  const saveBookings = (updated: Booking[]) => {
    setBookings(updated);
    localStorage.setItem("mnaeem_bookings", JSON.stringify(updated));
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (bookingType === "trainer" ? "Elite Session with mNaeem" : "Gym General Slot Access");
    
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9),
      type: bookingType,
      title: finalTitle,
      date: bookingDate,
      time: bookingTime,
      status: bookingType === "trainer" ? "Pending" : "Confirmed"
    };

    const updated = [...bookings, newBooking];
    saveBookings(updated);
    onSessionBooked(finalTitle, bookingDate, bookingTime);
    
    // Set up alert reminder simulation
    onNotification(
      "Session Scheduled! 🗓️",
      `Booked ${finalTitle} on ${bookingDate} at ${bookingTime}. Reminder notification is armed.`
    );

    // Reset states
    setShowModal(false);
    setTitle("");
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    saveBookings(updated);
  };

  // Helper calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayIndex(year, month);

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Check bookings matching specific calendar date
  const getBookingsOnDate = (dayNum: number) => {
    const pad = (num: number) => num.toString().padStart(2, "0");
    const dateStr = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
    return bookings.filter((b) => b.date === dateStr);
  };

  return (
    <div id="calendar-section" className="w-full bg-zinc-950 py-16 md:py-24 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <span className="text-xs font-mono text-brand-amber tracking-widest uppercase flex items-center gap-1.5">
              <CalendarIcon size={14} />
              TRAINING COMPLIANCE & CALENDAR
            </span>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mt-2 tracking-tight">
              SESSION & <span className="text-brand-amber text-glow-amber">CALENDAR</span>
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-xl">
              Audit scheduled slots, track training dates, and coordinate directly with trainer slots to stay aligned with your daily performance goals.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian font-display font-black text-xs px-5 py-2.5 rounded-md flex items-center gap-1.5 transition-all duration-250 cursor-pointer shadow-md shadow-brand-amber/10"
          >
            <Plus size={14} />
            BOOK TIME SLOT
          </button>
        </div>

        {/* Calendar Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sub-Column: Month Calendar Grid */}
          <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl">
            {/* Header controls */}
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-base font-display font-extrabold text-white tracking-tight flex items-center gap-2">
                {monthNames[month]} {year}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 px-3 py-1 text-xs rounded border border-zinc-800 font-mono transition-colors cursor-pointer"
                >
                  &lt; PREV
                </button>
                <button
                  onClick={handleNextMonth}
                  className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 px-3 py-1 text-xs rounded border border-zinc-800 font-mono transition-colors cursor-pointer"
                >
                  NEXT &gt;
                </button>
              </div>
            </div>

            {/* Grid Days headings */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-zinc-500 font-bold mb-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>

            {/* Grid days layout */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty placeholder tiles for preceding month offset */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`offset-${idx}`} className="aspect-video bg-zinc-900/10 border border-transparent" />
              ))}

              {/* Real active day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const activeBookings = getBookingsOnDate(dayNum);
                const hasBooking = activeBookings.length > 0;
                
                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`aspect-[4/3] sm:aspect-square bg-zinc-950/60 hover:bg-zinc-900 border ${
                      hasBooking ? "border-amber-500/25 bg-zinc-900/40" : "border-zinc-850"
                    } p-1.5 rounded flex flex-col justify-between transition-all relative overflow-hidden group`}
                  >
                    <span className="text-xs font-mono font-semibold text-zinc-400 group-hover:text-brand-amber">
                      {dayNum}
                    </span>

                    {/* Dot indicators */}
                    <div className="flex flex-wrap gap-1 max-h-4 overflow-hidden mt-1">
                      {activeBookings.map((b) => (
                        <span
                          key={b.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.type === "trainer" ? "bg-amber-500" : "bg-zinc-300"
                          }`}
                          title={b.title}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sub-Column: Booked Appointments Feed */}
          <div className="lg:col-span-4 bg-zinc-900/20 border border-zinc-850 p-6 rounded-2xl space-y-6">
            <h4 className="text-sm font-display font-extrabold text-white tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-brand-amber" />
              UPCOMING ENGAGEMENTS
            </h4>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 italic text-xs">
                  No upcoming time slots booked yet. Align your first routine slot today.
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-3 hover:border-zinc-700 transition-all flex flex-col justify-between relative group"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          booking.type === "trainer" 
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}>
                          {booking.type === "trainer" ? "Trainer Session" : "Gym General Slot"}
                        </span>
                        <h5 className="text-xs font-display font-bold text-white mt-2 leading-snug">
                          {booking.title}
                        </h5>
                      </div>
                      
                      {/* Delete icon */}
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-zinc-900 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Cancel Booking"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-900/50">
                      <div className="flex items-center gap-1">
                        <CalendarIcon size={12} className="text-zinc-500" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-zinc-500" />
                        <span>{booking.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[9px] font-mono font-bold ${
                        booking.status === "Confirmed" ? "text-green-500" : "text-yellow-500"
                      }`}>
                        ● {booking.status}
                      </span>
                      {booking.status === "Pending" && (
                        <span className="text-[8px] font-mono text-zinc-500 italic">Awaiting Coach MN Confirmation</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Booking Form Overlay Dialog */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6"
            >
              <div>
                <h4 className="text-base font-display font-black text-white">
                  SCHEDULING TIME SLOT
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-normal">
                  Select your slot class details below to commit your upcoming gym check-in or training hours securely.
                </p>
              </div>

              <form onSubmit={handleAddBooking} className="space-y-4 font-sans text-sm text-zinc-300">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">SLOT CLASSIFICATION</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingType("gym")}
                      className={`py-2 text-xs font-mono font-bold rounded border transition-colors cursor-pointer ${
                        bookingType === "gym"
                          ? "bg-brand-amber/10 border-brand-amber text-brand-amber"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      GYM FLOOR ACCESS
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType("trainer")}
                      className={`py-2 text-xs font-mono font-bold rounded border transition-colors cursor-pointer ${
                        bookingType === "trainer"
                          ? "bg-brand-amber/10 border-brand-amber text-brand-amber"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      PERSONAL TRAINING
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">CUSTOM ROUTINE TITLE / DESCRIPTION</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={bookingType === "gym" ? "e.g. Back Attack Session" : "e.g. Pose Check & Contest Prep"}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-amber transition-colors text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">TARGET DATE</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-amber font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">TIME SLOT SELECT</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-amber font-sans text-xs"
                    >
                      <option value="06:00 AM">06:00 AM (Early Bird)</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM (Peak Hours)</option>
                      <option value="08:30 PM">08:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-white font-display font-bold text-xs py-2.5 rounded transition-colors cursor-pointer"
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian font-display font-black text-xs py-2.5 rounded transition-colors cursor-pointer"
                  >
                    SECURE SLOT
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
