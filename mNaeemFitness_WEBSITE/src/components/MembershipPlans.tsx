import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  ShieldCheck,
  CreditCard,
  X,
  Sparkles,
  Receipt,
  Download,
  RefreshCw,
} from "lucide-react";
import { SubscriptionPlan } from "../types";

const PLANS: SubscriptionPlan[] = [
  {
    id: "silver",
    name: "Silver Tier",
    price: "$39",
    period: "month",
    features: [
      "Standard Gym access (6:00 AM - 10:00 PM)",
      "High-tech locker room & sauna privileges",
      "Free initial biometric body evaluations",
      "Access to standard workout logging app",
    ],
    popular: false,
    color: "zinc-400",
  },
  {
    id: "gold",
    name: "Gold Access",
    price: "$79",
    period: "month",
    features: [
      "24/7 Unlimited Gym Slot Access",
      "2 Monthly booked sessions with Trainer",
      "Dynamic workout logging & calendar trackers",
      "Daily premium pre-workout or protein shake",
      "Interactive Nutrition Calculator access",
    ],
    popular: true,
    color: "amber-500",
  },
  {
    id: "elite",
    name: "Elite Trainer Pro",
    price: "$149",
    period: "month",
    features: [
      "Unlimited booking access in elite zones",
      "Full personal training by mNaeem",
      "24/7 Direct chat with AI Coach",
      "Custom nutrition and macro design programs",
      "Weekly body composition assessments",
      "Push notification workout reminders",
    ],
    popular: false,
    color: "yellow-400",
  },
];

interface MembershipPlansProps {
  onSubscribeSuccess: (planName: string) => void;
  onNotification: (title: string, body: string) => void;
}

export default function MembershipPlans({
  onSubscribeSuccess,
  onNotification,
}: MembershipPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [checkoutStep, setCheckoutStep] = useState<
    "form" | "processing" | "receipt"
  >("form");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setExpiry(formatted);
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/gi, "");
    if (v.length <= 3) {
      setCvv(v);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Enter a valid 16-digit card number.";
    }
    if (!cardName.trim()) {
      newErrors.cardName = "Cardholder name is required.";
    }
    if (expiry.length < 5) {
      newErrors.expiry = "Use MM/YY format.";
    } else {
      const [month, year] = expiry.split("/");
      const m = parseInt(month, 10);
      if (m < 1 || m > 12) {
        newErrors.expiry = "Invalid month.";
      }
    }
    if (cvv.length < 3) {
      newErrors.cvv = "CVV must be 3 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (!validateForm()) return;
    setCheckoutStep("processing");
    setTimeout(() => {
      setCheckoutStep("receipt");
      onSubscribeSuccess(selectedPlan?.name || "Premium");
      onNotification(
        "Subscription Confirmed!",
        `Congratulations! You are now a ${selectedPlan?.name} member at mNaeem fitness.`,
      );
    }, 2000);
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setCheckoutStep("form");
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
    setIsFlipped(false);
    setErrors({});
  };

  return (
    <div
      id="membership-section"
      className="w-full bg-zinc-950 py-16 md:py-24 border-b border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono text-brand-amber tracking-widest uppercase">
            MEMBERSHIP TIERS & PLANS
          </h2>
          <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mt-3 tracking-tight">
            INVEST IN YOUR{" "}
            <span className="text-brand-amber text-glow-amber">LEGACY</span>
          </h3>
          <p className="mt-4 text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
            Choose your membership rank. Unlock top-tier tools, book customized
            slots, or gain elite personalized training programs tailored
            directly by Coach mNaeem.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col justify-between p-8 rounded-2xl bg-zinc-900/60 border ${
                plan.popular
                  ? "border-brand-amber shadow-xl shadow-brand-amber/5"
                  : "border-zinc-850"
              } transition-all duration-300 overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-brand-amber text-brand-obsidian font-mono text-[10px] font-bold px-4 py-1 uppercase rounded-bl-xl tracking-widest z-10 flex items-center gap-1">
                  <Sparkles size={10} />
                  RECOMMENDED
                </div>
              )}

              <div>
                <div className="space-y-2">
                  <h4 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        plan.id === "silver"
                          ? "bg-zinc-400"
                          : plan.id === "gold"
                            ? "bg-amber-500"
                            : "bg-yellow-400"
                      }`}
                    ></span>
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline mt-4">
                    <span className="text-4xl lg:text-5xl font-display font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-500 text-xs font-sans ml-1">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="mt-8 space-y-4 border-t border-zinc-800/80 pt-6">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-xs text-zinc-300 gap-3 leading-tight"
                    >
                      <div className="text-brand-amber mt-0.5 shrink-0 bg-brand-amber/10 p-0.5 rounded-full">
                        <Check size={12} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800/50">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full font-display font-bold text-sm py-3 px-4 rounded-md transition-all duration-250 cursor-pointer ${
                    plan.popular
                      ? "bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian shadow-md shadow-brand-amber/10"
                      : "bg-zinc-800 hover:bg-zinc-750 text-white border border-zinc-700"
                  }`}
                >
                  {plan.id === "elite"
                    ? "HIRE TRAINER MNAEEM"
                    : "ACQUIRE SLOT ACCESS"}
                </button>
                <p className="text-center text-[10px] text-zinc-500 font-sans mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} className="text-zinc-500" />
                  Secured & flexible membership
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secure Checkout Dialog Backdrop */}
        <AnimatePresence>
          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8"
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 p-1.5 rounded-full transition-all duration-200 cursor-pointer"
                  aria-label="Close Checkout"
                >
                  <X size={16} />
                </button>

                {checkoutStep === "form" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono text-brand-amber tracking-widest uppercase">
                        SECURE ACQUISITION
                      </h4>
                      <h5 className="text-xl font-display font-bold text-white mt-1">
                        Unlock {selectedPlan.name}
                      </h5>
                      <p className="text-xs text-zinc-400 mt-1">
                        Enter your payment details below to initiate secure
                        subscription processing.
                      </p>
                    </div>

                    {/* Interactive 3D CSS Credit Card Visualizer */}
                    <div className="w-full flex justify-center perspective-1000 py-2">
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                        }}
                        className="relative w-full max-w-[320px] h-[180px] rounded-xl transform-style-3d shadow-xl border border-amber-500/20 text-white font-mono font-medium select-none cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        {/* Front of Card */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 p-5 rounded-xl flex flex-col justify-between backface-hidden ${isFlipped ? "pointer-events-none" : ""}`}
                        >
                          <div className="flex justify-between items-center">
                            <CreditCard
                              size={32}
                              className="text-brand-amber"
                            />
                            <span className="text-[10px] font-bold text-brand-amber tracking-widest bg-brand-amber/10 px-2 py-0.5 rounded">
                              MNAEEM FIT
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-zinc-500 tracking-wider">
                              CARD NUMBER
                            </div>
                            <div className="text-base sm:text-lg tracking-widest text-zinc-100">
                              {cardNumber || "•••• •••• •••• ••••"}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <div>
                              <div className="text-zinc-500">CARDHOLDER</div>
                              <div className="text-zinc-200 uppercase truncate max-w-[140px]">
                                {cardName || "YOUR NAME"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-zinc-500">EXPIRES</div>
                              <div className="text-zinc-200">
                                {expiry || "MM/YY"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Back of Card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 p-5 rounded-xl flex flex-col justify-between backface-hidden [transform:rotateY(180deg)]">
                          <div className="w-full h-8 bg-zinc-950 -mx-5 mt-1"></div>
                          <div className="space-y-1">
                            <div className="text-right text-[10px] text-zinc-500 tracking-wider pr-1">
                              SIGNATURE / CVV
                            </div>
                            <div className="bg-zinc-800/80 rounded h-8 flex items-center justify-end px-3">
                              <span className="text-brand-amber font-mono font-bold tracking-widest italic">
                                {cvv || "•••"}
                              </span>
                            </div>
                          </div>
                          <div className="text-[9px] text-zinc-500 leading-none">
                            This simulated credential represents mNaeem fitness
                            premium sandbox gateway processing.
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="text-center text-[10px] text-zinc-500 font-sans -mt-2">
                      💡 Click the card above to rotate and inspect the CVV
                      band.
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          CARDHOLDER NAME
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="MNaeem Sandow"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-amber transition-colors font-sans"
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {errors.cardName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          CARD NUMBER
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-amber transition-colors font-mono"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 mb-1">
                            EXPIRATION
                          </label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-amber transition-colors font-mono"
                          />
                          {errors.expiry && (
                            <p className="text-red-500 text-[10px] mt-1">
                              {errors.expiry}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            value={cvv}
                            onChange={handleCVVChange}
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                            placeholder="•••"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-amber transition-colors font-mono"
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-[10px] mt-1">
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePay}
                      className="w-full bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian font-display font-black text-sm py-3.5 rounded transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-amber/15"
                    >
                      <CreditCard size={16} />
                      AUTHORIZE PAYMENT — {selectedPlan.price}
                    </button>
                  </div>
                )}

                {checkoutStep === "processing" && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <RefreshCw
                      size={44}
                      className="text-brand-amber animate-spin"
                    />
                    <h5 className="text-lg font-display font-extrabold text-white">
                      TRANSACTING SECURELY
                    </h5>
                    <p className="text-xs text-zinc-500 max-w-xs text-center">
                      Connecting to sandboxed gateway to safely authorize{" "}
                      {selectedPlan.name} membership.
                    </p>
                  </div>
                )}

                {checkoutStep === "receipt" && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="inline-flex p-3 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber mb-2">
                        <Receipt size={32} />
                      </div>
                      <h5 className="text-2xl font-display font-black text-white">
                        TRANSACTION APPROVED!
                      </h5>
                      <p className="text-xs text-zinc-400">
                        Thank you! Your credit card was processed and membership
                        initialized securely.
                      </p>
                    </div>

                    {/* Styled Receipt Container */}
                    <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-xl font-mono text-xs text-zinc-300 space-y-3">
                      <div className="flex justify-between border-b border-zinc-900 pb-2">
                        <span className="text-zinc-500">MERCHANT</span>
                        <span className="text-white font-semibold">
                          MNAEEM FITNESS CO
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-2">
                        <span className="text-zinc-500">MEMBER</span>
                        <span className="text-white uppercase">{cardName}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-2">
                        <span className="text-zinc-500">TIER CLASS</span>
                        <span className="text-brand-amber font-semibold">
                          {selectedPlan.name}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-2">
                        <span className="text-zinc-500">CHARGE AMOUNT</span>
                        <span className="text-white font-bold">
                          {selectedPlan.price} / month
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-2">
                        <span className="text-zinc-500">STATUS</span>
                        <span className="text-green-500 font-bold uppercase tracking-wider">
                          SUCCESS
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-600 pt-1">
                        <span>
                          TX_ID: FIT_MNAEEM_
                          {Math.floor(Math.random() * 899999 + 100000)}
                        </span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleClose}
                        className="flex-1 bg-brand-amber hover:bg-brand-amber-light text-brand-obsidian font-display font-bold text-sm py-3 rounded text-center transition-all duration-200 cursor-pointer"
                      >
                        ENTER MEMBER ZONE
                      </button>
                      <button
                        onClick={() => {
                          alert(
                            "Receipt saved! Checkout folder for downloaded asset pdf.",
                          );
                        }}
                        className="bg-zinc-800 hover:bg-zinc-750 text-white p-3 rounded border border-zinc-700 transition-all duration-200 cursor-pointer"
                        title="Download Invoice"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
