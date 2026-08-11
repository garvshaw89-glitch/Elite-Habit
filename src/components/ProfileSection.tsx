import React, { useState } from 'react';
import {
  User,
  Crown,
  Shield,
  CreditCard,
  CheckCircle2,
  Zap,
  Sparkles,
  Phone,
  Clock,
  QrCode,
  ArrowRight,
  Check,
  Star,
  MessageSquare,
  Award,
  Lock,
  ChevronRight,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UserSession, SubscriptionPlan, UserTargets } from '../types';

interface ProfileSectionProps {
  userSession: UserSession;
  targets: UserTargets;
  onUpdateTargets: (targets: UserTargets) => void;
  onUpdateSession: (session: UserSession) => void;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'trial_1m',
    title: '1 Month Free Trial',
    duration: '1 Month',
    priceRupees: 0,
    originalPriceRupees: 199,
    isTrial: true,
    hasCoach: false,
    badge: 'FREE TRIAL',
    features: [
      'Full Routine Logging & Analytics',
      'AI Metrics Extraction',
      'Habit Streak Tracking',
      'Morning Focus Intention Setter',
      'Standard Email & Community Support'
    ]
  },
  {
    id: 'monthly_no_coach',
    title: 'Monthly Standard',
    duration: '1 Month',
    priceRupees: 99,
    originalPriceRupees: 199,
    hasCoach: false,
    features: [
      'All Routine Logging & Charts',
      'Automated Habit Scores',
      'Evening Reminder System',
      'Export Data to JSON/CSV',
      'Without Direct AI Coach Consulting'
    ]
  },
  {
    id: 'monthly_with_coach',
    title: 'Monthly Coach Pro',
    duration: '1 Month',
    priceRupees: 249,
    originalPriceRupees: 499,
    hasCoach: true,
    badge: 'WITH AI COACH',
    features: [
      'Everything in Monthly Standard',
      'Coach Elite Priority Analysis',
      'Customized Daily Feedback Insights',
      'Nutrition & Workout Target Recommendations',
      'Unlimited AI Chat Consultations'
    ]
  },
  {
    id: 'plan_3m',
    title: '3 Months Pass',
    duration: '3 Months',
    priceRupees: 499,
    originalPriceRupees: 899,
    hasCoach: false,
    features: [
      '3 Months Uninterrupted Access',
      'Save 45% vs Monthly Standard',
      'Full Performance & Heatmap Dashboards',
      'Multi-Habit Consistency Metrics',
      'Standard AI Analysis'
    ]
  },
  {
    id: 'plan_6m',
    title: '6 Months Growth Pass',
    duration: '6 Months',
    priceRupees: 699,
    originalPriceRupees: 1499,
    hasCoach: true,
    isPopular: true,
    badge: 'MOST POPULAR',
    features: [
      '6 Months Complete Elite Habit Access',
      'Coach Elite Included',
      'Save 60% vs Monthly Subscriptions',
      'Long-Term Habit Analytics Trends',
      'Priority AI Processing Speed'
    ]
  },
  {
    id: 'plan_1y',
    title: '1 Year Annual Pass',
    duration: '1 Year',
    priceRupees: 899,
    originalPriceRupees: 2499,
    hasCoach: true,
    badge: 'GREAT VALUE',
    features: [
      '12 Months Full Unlimited Access',
      'Full Coach Elite Included',
      'Save over 70% Annual Discount',
      'Advanced Macro & Coding Focus Reports',
      'Dedicated Priority Support'
    ]
  },
  {
    id: 'plan_lifetime',
    title: 'Lifetime Access + Coach Elite',
    duration: 'Lifetime',
    priceRupees: 1899,
    originalPriceRupees: 4999,
    isBestValue: true,
    hasCoach: true,
    badge: 'ULTIMATE VIP',
    features: [
      'Pay Once, Own Forever (Zero Subscriptions)',
      'Direct Coach Elite AI Access Always',
      'VIP Master Badge on Profile',
      'All Future Feature Updates Included Free',
      'Custom Routine Architecture Reviews'
    ]
  }
];

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userSession,
  targets,
  onUpdateTargets,
  onUpdateSession,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'membership' | 'targets'>('overview');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Targets state
  const [tempTargets, setTempTargets] = useState<UserTargets>({ ...targets });
  const [targetsSavedMsg, setTargetsSavedMsg] = useState(false);

  // Profile preferences edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: userSession.fullName || 'Elite Practitioner',
    age: userSession.age || 24,
    weightKg: userSession.weightKg || 72,
    targetWeightKg: userSession.targetWeightKg || 68,
    fitnessGoal: userSession.fitnessGoal || 'Weight Loss & Fat Burn',
    experienceLevel: userSession.experienceLevel || 'Intermediate',
  });
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSession: UserSession = {
      ...userSession,
      fullName: profileForm.fullName,
      age: profileForm.age,
      weightKg: profileForm.weightKg,
      targetWeightKg: profileForm.targetWeightKg,
      fitnessGoal: profileForm.fitnessGoal,
      experienceLevel: profileForm.experienceLevel,
    };
    localStorage.setItem('elite_habit_user_session', JSON.stringify(updatedSession));
    localStorage.setItem('aegis_user_session', JSON.stringify(updatedSession));
    onUpdateSession(updatedSession);
    setIsEditingProfile(false);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleSelectPlanToBuy = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPaymentSuccessMsg(null);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const updatedSession: UserSession = {
        ...userSession,
        activePlanId: selectedPlan.id,
        planName: selectedPlan.title,
        hasCoachAccess: selectedPlan.hasCoach,
        planExpiryDate: selectedPlan.duration === 'Lifetime'
          ? 'Never (Lifetime VIP)'
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
      };

      localStorage.setItem('elite_habit_user_session', JSON.stringify(updatedSession));
      localStorage.setItem('aegis_user_session', JSON.stringify(updatedSession));
      onUpdateSession(updatedSession);

      setPaymentSuccessMsg(`🎉 Success! Subscribed to ${selectedPlan.title} (₹${selectedPlan.priceRupees}). Plan activated!`);
      setSelectedPlan(null);
    }, 1500);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTargets(tempTargets);
    setTargetsSavedMsg(true);
    setTimeout(() => setTargetsSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="bg-[#0b0f0d] border border-emerald-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden carbon-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black font-serif font-bold text-2xl flex items-center justify-center shadow-xl border border-emerald-300/30">
              <User className="w-8 h-8 text-black" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                  {userSession.fullName || 'Elite Practitioner'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-widest bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>{userSession.planName || '1 Month Free Trial'}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-white/60">
                <span className="flex items-center gap-1 text-white/80">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {userSession.phoneNumber}
                </span>
                {userSession.age && (
                  <>
                    <span>•</span>
                    <span>Age: {userSession.age}</span>
                  </>
                )}
                {userSession.weightKg && (
                  <>
                    <span>•</span>
                    <span>Weight: {userSession.weightKg} kg (Target: {userSession.targetWeightKg || userSession.weightKg} kg)</span>
                  </>
                )}
                {userSession.fitnessGoal && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{userSession.fitnessGoal}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Sub Status Badge */}
          <div className="bg-black/60 border border-emerald-500/20 rounded-xl p-3.5 text-xs font-mono flex items-center gap-3 shrink-0">
            <div className="p-2 bg-emerald-500/15 rounded-lg border border-emerald-500/30 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-white/40 uppercase tracking-wider block font-bold">
                Elite Coach Access:
              </span>
              <span className={`font-bold ${userSession.hasCoachAccess ? 'text-emerald-400' : 'text-amber-400'}`}>
                {userSession.hasCoachAccess ? 'ACTIVE (Consult Enabled)' : 'Standard (AI Coach Limited)'}
              </span>
            </div>
          </div>
        </div>

        {/* Sub Tabs Navigation */}
        <div className="flex border-b border-white/10 mt-6 pt-2 gap-2 text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`pb-3 px-3 border-b-2 font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'overview'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('membership')}
            className={`pb-3 px-3 border-b-2 font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'membership'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Subscription & Pricing (₹)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('targets')}
            className={`pb-3 px-3 border-b-2 font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'targets'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Daily Targets Config</span>
          </button>
        </div>
      </div>

      {paymentSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 font-mono text-xs flex items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{paymentSuccessMsg}</span>
          </div>
          <button
            onClick={() => setPaymentSuccessMsg(null)}
            className="text-white/60 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SUB TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Shield className="w-4 h-4 text-[#10b981]" />
              <h3 className="text-sm font-serif italic text-white">Active Plan Details</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Plan Name:</span>
                <span className="text-white font-bold">{userSession.planName || '1 Month Free Trial'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Plan Status:</span>
                <span className="text-emerald-400 font-bold">Active ✓</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Expiry Date:</span>
                <span className="text-white/90">{userSession.planExpiryDate || '30 Days Remaining'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Coach Elite AI:</span>
                <span className="text-[#10b981] font-bold">
                  {userSession.hasCoachAccess ? 'Enabled' : 'Standard AI'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab('membership')}
              className="w-full py-2.5 rounded bg-[#10b981] hover:bg-[#34d399] text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Plan</span>
            </button>
          </div>

          <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 shadow-xl space-y-4 md:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10b981]" />
                <h3 className="text-sm font-serif italic text-white">Body Composition & Fitness Goals</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-[10px] font-mono uppercase tracking-wider text-[#10b981] hover:underline"
              >
                {isEditingProfile ? 'Cancel Edit' : 'Edit Fitness Profile'}
              </button>
            </div>

            {profileSavedMsg && (
              <div className="p-3 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fitness profile updated successfully!</span>
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-white/60 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-white/60 block mb-1">Age</label>
                    <input
                      type="number"
                      value={profileForm.age}
                      onChange={(e) => setProfileForm({ ...profileForm, age: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-white/60 block mb-1">Current Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={profileForm.weightKg}
                      onChange={(e) => setProfileForm({ ...profileForm, weightKg: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-white/60 block mb-1">Target Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={profileForm.targetWeightKg}
                      onChange={(e) => setProfileForm({ ...profileForm, targetWeightKg: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-white/60 block mb-1">Fitness Goal</label>
                    <select
                      value={profileForm.fitnessGoal}
                      onChange={(e) => setProfileForm({ ...profileForm, fitnessGoal: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Weight Loss & Fat Burn">Weight Loss & Fat Burn</option>
                      <option value="Muscle Mass & Hypertrophy">Muscle Mass & Hypertrophy</option>
                      <option value="Endurance & Athletics">Endurance & Athletics</option>
                      <option value="Healthy Maintenance">Healthy Maintenance</option>
                      <option value="Focus & Productivity">Focus & Productivity</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-white/60 block mb-1">Experience Level</label>
                    <select
                      value={profileForm.experienceLevel}
                      onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced Athlete">Advanced Athlete</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-[#10b981] hover:bg-[#34d399] text-black font-bold uppercase tracking-wider"
                >
                  Save Fitness Profile
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-black/50 border border-white/10 p-3 rounded-lg space-y-1">
                  <span className="text-[10px] text-white/40 uppercase block">Name & Age</span>
                  <span className="text-sm font-bold text-white block truncate">{userSession.fullName || 'Practitioner'}</span>
                  <span className="text-[11px] text-[#10b981] block">{userSession.age ? `${userSession.age} yrs` : '24 yrs'}</span>
                </div>

                <div className="bg-black/50 border border-white/10 p-3 rounded-lg space-y-1">
                  <span className="text-[10px] text-white/40 uppercase block">Weight / Goal</span>
                  <span className="text-sm font-bold text-white block">{userSession.weightKg || 72} kg</span>
                  <span className="text-[11px] text-[#10b981] block">Target: {userSession.targetWeightKg || 68} kg</span>
                </div>

                <div className="bg-black/50 border border-white/10 p-3 rounded-lg space-y-1 col-span-2 sm:col-span-2">
                  <span className="text-[10px] text-white/40 uppercase block">Primary Goal & Level</span>
                  <span className="text-sm font-bold text-[#10b981] block truncate">{userSession.fitnessGoal || 'Weight Loss & Fat Burn'}</span>
                  <span className="text-[11px] text-white/60 block">{userSession.experienceLevel || 'Intermediate'} Level</span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2">Daily Routine Targets</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-black/30 border border-white/10 p-2.5 rounded space-y-0.5">
                  <span className="text-[9px] text-white/40 uppercase block">Calories</span>
                  <span className="text-xs font-bold text-[#10b981]">{targets.dailyCaloriesTarget} kcal</span>
                </div>
                <div className="bg-black/30 border border-white/10 p-2.5 rounded space-y-0.5">
                  <span className="text-[9px] text-white/40 uppercase block">Protein</span>
                  <span className="text-xs font-bold text-[#10b981]">{targets.dailyProteinTarget}g</span>
                </div>
                <div className="bg-black/30 border border-white/10 p-2.5 rounded space-y-0.5">
                  <span className="text-[9px] text-white/40 uppercase block">Deep Work</span>
                  <span className="text-xs font-bold text-[#10b981]">{targets.dailyStudyHoursTarget}h / day</span>
                </div>
                <div className="bg-black/30 border border-white/10 p-2.5 rounded space-y-0.5">
                  <span className="text-[9px] text-white/40 uppercase block">Workouts</span>
                  <span className="text-xs font-bold text-[#10b981]">{targets.weeklyWorkoutsTarget} / wk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: MEMBERSHIP & SUBSCRIPTION PLANS */}
      {activeSubTab === 'membership' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] font-mono text-xs uppercase font-bold tracking-widest">
              <Crown className="w-3.5 h-3.5" />
              <span>Elite Habit Premium Membership Plans</span>
            </div>
            <h3 className="text-2xl font-serif italic text-white">
              Invest in Unbreakable Consistency
            </h3>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Choose from monthly flex options, 1-month free trial (₹0), or unlock lifetime access with direct Coach Elite guidance.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrent = userSession.activePlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`bg-[#0e0e0e] border rounded-2xl p-6 shadow-xl relative flex flex-col justify-between transition-all ${
                    plan.isBestValue || plan.isPopular
                      ? 'border-[#10b981] ring-1 ring-[#10b981]/50 bg-gradient-to-b from-[#14120c] to-[#0e0e0e]'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 right-6 bg-[#10b981] text-black font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        {plan.title}
                      </h4>
                      <p className="text-xs text-white/50 font-mono mt-0.5">
                        Duration: {plan.duration}
                      </p>
                    </div>

                    {/* Price Tag */}
                    <div className="flex items-baseline gap-2 pb-4 border-b border-white/10">
                      <span className="text-3xl font-mono font-extrabold text-[#10b981]">
                        {plan.priceRupees === 0 ? '₹0' : `₹${plan.priceRupees}`}
                      </span>
                      {plan.priceRupees > 0 && (
                        <span className="text-xs font-mono text-white/40 line-through">
                          ₹{plan.originalPriceRupees}
                        </span>
                      )}
                      <span className="text-xs text-white/50 font-mono">
                        / {plan.duration}
                      </span>
                    </div>

                    {/* Feature List */}
                    <ul className="space-y-2.5 text-xs text-white/80 font-sans">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan Select CTA */}
                  <div className="pt-6 mt-4 border-t border-white/10">
                    <button
                      onClick={() => handleSelectPlanToBuy(plan)}
                      disabled={isCurrent}
                      className={`w-full py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                        isCurrent
                          ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400 cursor-default'
                          : plan.isBestValue || plan.isPopular
                          ? 'bg-[#10b981] hover:bg-[#34d399] text-black'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Current Active Plan</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Select {plan.priceRupees === 0 ? 'Free Trial' : `₹${plan.priceRupees}`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAYMENT CHECKOUT MODAL SIMULATION */}
          {selectedPlan && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#121212] border border-[#10b981]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#10b981]" />
                    <h3 className="text-lg font-serif italic text-white">
                      Complete Checkout ({selectedPlan.title})
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-white/40 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Selected Plan Summary */}
                <div className="bg-black p-4 rounded-xl border border-white/10 flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block">Selected Tier:</span>
                    <span className="text-sm font-bold text-white">{selectedPlan.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase block">Total Amount:</span>
                    <span className="text-xl font-bold text-[#10b981]">
                      {selectedPlan.priceRupees === 0 ? '₹0 (Free)' : `₹${selectedPlan.priceRupees}`}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                    Select Payment Gateway (India & Global)
                  </label>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        paymentMethod === 'upi'
                          ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981] font-bold'
                          : 'bg-black border-white/10 text-white/60'
                      }`}
                    >
                      <span>UPI / GPay / PhonePe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qr')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        paymentMethod === 'qr'
                          ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981] font-bold'
                          : 'bg-black border-white/10 text-white/60'
                      }`}
                    >
                      <span>Scan QR Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        paymentMethod === 'card'
                          ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981] font-bold'
                          : 'bg-black border-white/10 text-white/60'
                      }`}
                    >
                      <span>Credit/Debit Card</span>
                    </button>
                  </div>
                </div>

                {/* Payment Input Form */}
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                        Virtual Payment Address (VPA / UPI ID)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. username@okaxis / 9876543210@ybl"
                        className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#10b981]"
                      />
                    </div>
                  )}

                  {paymentMethod === 'qr' && (
                    <div className="text-center p-4 bg-black rounded-xl border border-white/10 space-y-2">
                      <QrCode className="w-24 h-24 text-[#10b981] mx-auto p-2 bg-white rounded-lg" />
                      <p className="text-xs font-mono text-white/70">
                        Scan with PhonePe, Paytm, Google Pay, or BHIM UPI
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-2 font-mono text-xs">
                      <input
                        type="text"
                        placeholder="Card Number (4111 •••• •••• 1111)"
                        className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#10b981]"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-1/2 bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#10b981]"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-1/2 bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#10b981]"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Verifying & Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay {selectedPlan.priceRupees === 0 ? '₹0' : `₹${selectedPlan.priceRupees}`} & Activate
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: TARGETS CONFIG */}
      {activeSubTab === 'targets' && (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-6 shadow-2xl space-y-6 max-w-2xl">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-lg font-serif italic text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#10b981]" />
              <span>Configure Daily Target Benchmarks</span>
            </h3>
            <p className="text-xs text-white/50 font-light mt-0.5">
              Adjust your daily caloric intake, protein target, study/coding hours, and workout frequency.
            </p>
          </div>

          <form onSubmit={handleSaveTargets} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-white/70 block">Daily Caloric Target (kcal)</label>
              <input
                type="number"
                value={tempTargets.dailyCaloriesTarget}
                onChange={(e) => setTempTargets({ ...tempTargets, dailyCaloriesTarget: parseInt(e.target.value) || 0 })}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 block">Daily Protein Target (grams)</label>
              <input
                type="number"
                value={tempTargets.dailyProteinTarget}
                onChange={(e) => setTempTargets({ ...tempTargets, dailyProteinTarget: parseInt(e.target.value) || 0 })}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 block">Daily Study / Deep Work Target (hours)</label>
              <input
                type="number"
                step="0.5"
                value={tempTargets.dailyStudyHoursTarget}
                onChange={(e) => setTempTargets({ ...tempTargets, dailyStudyHoursTarget: parseFloat(e.target.value) || 0 })}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 block">Weekly Workout Target (sessions / week)</label>
              <input
                type="number"
                value={tempTargets.weeklyWorkoutsTarget}
                onChange={(e) => setTempTargets({ ...tempTargets, weeklyWorkoutsTarget: parseInt(e.target.value) || 0 })}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>

            {targetsSavedMsg && (
              <div className="p-3 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Target benchmarks updated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-[#10b981] hover:bg-[#34d399] text-black font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
              Save Targets Configuration
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
