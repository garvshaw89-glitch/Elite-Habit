import React, { useState, useEffect, useRef } from 'react';
import { Shield, Phone, Lock, ArrowRight, CheckCircle2, RefreshCw, KeyRound, Sparkles, ChevronDown, User, Scale, Target, Flame, Activity } from 'lucide-react';
import { UserSession } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

const FITNESS_GOALS = [
  { id: 'Weight Loss & Fat Burn', label: 'Weight Loss & Fat Burn', icon: '🔥', desc: 'Caloric deficit, cardio & lean physique' },
  { id: 'Muscle Mass & Hypertrophy', label: 'Muscle Mass & Hypertrophy', icon: '💪', desc: 'Protein synthesis, progressive overload' },
  { id: 'Endurance & Athletics', label: 'Endurance & Athletics', icon: '🏃', desc: 'Stamina, zone-2 training & recovery' },
  { id: 'Healthy Maintenance', label: 'Healthy Maintenance', icon: '🧘', desc: 'Balanced lifestyle, daily consistency' },
  { id: 'Focus & Productivity', label: 'Focus & Mental Stamina', icon: '🧠', desc: 'Cognitive deep work & study discipline' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [showSimulatedBanner, setShowSimulatedBanner] = useState<boolean>(false);

  // Profile preferences state
  const [fullName, setFullName] = useState<string>('');
  const [age, setAge] = useState<string>('24');
  const [weightKg, setWeightKg] = useState<string>('72');
  const [targetWeightKg, setTargetWeightKg] = useState<string>('68');
  const [fitnessGoal, setFitnessGoal] = useState<string>('Weight Loss & Fat Burn');
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Generate a random 6-digit OTP code for simulation
  const generateRandomOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length < 8) {
      setErrorMsg('Please enter a valid mobile number (minimum 8 digits).');
      return;
    }

    setErrorMsg(null);
    setIsSendingOtp(true);

    setTimeout(() => {
      const code = generateRandomOtp();
      setGeneratedOtp(code);
      setIsSendingOtp(false);
      setStep('otp');
      setResendTimer(30);
      setShowSimulatedBanner(true);
      // Auto focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pastedDigits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setOtpDigits(digits);
    otpInputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    if (enteredCode !== generatedOtp && enteredCode !== '123456') {
      setErrorMsg(`Invalid verification code. Use '${generatedOtp}' or demo code '123456'.`);
      return;
    }

    setErrorMsg(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setStep('profile');
    }, 800);
  };

  const handleCompleteProfileAndLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const userSession: UserSession = {
      phoneNumber: `${countryCode} ${phoneNumber.replace(/\D/g, '')}`,
      countryCode,
      isLoggedIn: true,
      loginTime: Date.now(),
      fullName: fullName.trim() || 'Elite Practitioner',
      age: parseInt(age) || 24,
      weightKg: parseFloat(weightKg) || 72,
      targetWeightKg: parseFloat(targetWeightKg) || 68,
      fitnessGoal,
      experienceLevel,
    };

    localStorage.setItem('elite_habit_user_session', JSON.stringify(userSession));
    localStorage.setItem('aegis_user_session', JSON.stringify(userSession));
    onLoginSuccess(userSession);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setErrorMsg(null);
    const code = generateRandomOtp();
    setGeneratedOtp(code);
    setResendTimer(30);
    setShowSimulatedBanner(true);
    setOtpDigits(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#070908] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow FX */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Container */}
      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-xl shadow-emerald-950/50 border border-emerald-300/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-serif font-bold tracking-wider text-white uppercase">
                Elite Habit
              </h1>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold">
                PRO
              </span>
            </div>
            <p className="text-xs text-emerald-400/70 font-mono tracking-widest uppercase mt-1">
              High Performance Routine Architecture & AI Systems
            </p>
          </div>
        </div>

        {/* Simulated SMS Notification Popup */}
        {showSimulatedBanner && generatedOtp && step === 'otp' && (
          <div className="bg-[#0b1410] border border-emerald-500/50 rounded-xl p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500 text-black font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  Simulated SMS Code Received
                </span>
                <p className="text-white font-mono font-bold tracking-widest text-sm">
                  {generatedOtp}
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoFillOtp}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-[#0b0f0d]/95 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 carbon-card">
          {step === 'phone' && (
            /* STEP 1: Enter Mobile Number */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Enter Mobile Number</span>
                </h2>
                <p className="text-xs text-white/60 font-light">
                  Sign in or register with your mobile phone to access your high performance habit routine logs.
                </p>
              </div>

              {/* Input Group */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                  Mobile Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country Selector */}
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none bg-black border border-white/20 rounded-lg px-3 pr-8 py-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0e0e0e] text-white">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Phone Input */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(555) 019-2834"
                      autoFocus
                      required
                      className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-xs text-red-300 font-mono">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!phoneNumber.trim() || isSendingOtp}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-50"
              >
                {isSendingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Sending SMS Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-white/40 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-Bit Encrypted Secure Authentication</span>
              </div>
            </form>
          )}

          {step === 'otp' && (
            /* STEP 2: Enter OTP Code */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Enter Verification Code</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setErrorMsg(null);
                    }}
                    className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 hover:underline"
                  >
                    Edit Phone
                  </button>
                </div>
                <p className="text-xs text-white/50 font-light">
                  Enter the 6-digit OTP code sent to{' '}
                  <span className="text-white font-mono font-bold">{countryCode} {phoneNumber}</span>.
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                  6-Digit OTP Code
                </label>
                <div className="flex gap-2 justify-between">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-12 text-center bg-black border border-white/20 rounded-lg text-lg font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-xs text-red-300 font-mono">
                  {errorMsg}
                </div>
              )}

              {/* Resend Link */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/40">Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="text-emerald-400 hover:underline font-semibold disabled:text-white/30 disabled:no-underline"
                >
                  {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code Now'}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otpDigits.join('').length < 6 || isVerifying}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP & Next Step</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'profile' && (
            /* STEP 3: Personal Preferences & Fitness Goals */
            <form onSubmit={handleCompleteProfileAndLogin} className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif italic text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Personal Profile & Fitness Goals</span>
                  </h2>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-bold">
                    Step 2 of 2
                  </span>
                </div>
                <p className="text-xs text-white/50 font-light">
                  Elite Habit AI customizes your daily targets based on your age, body composition, and performance ambitions.
                </p>
              </div>

              {/* Name & Age Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/70 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    required
                    className="w-full bg-black border border-white/20 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/70 block">
                    Age
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full bg-black border border-white/20 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Current Weight & Target Weight Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/70 flex items-center gap-1">
                    <Scale className="w-3 h-3 text-emerald-400" />
                    <span>Current Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    required
                    className="w-full bg-black border border-white/20 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/70 flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-400" />
                    <span>Target Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(e.target.value)}
                    required
                    className="w-full bg-black border border-white/20 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Fitness Goal Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/70 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  <span>Primary Fitness & Performance Goal</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {FITNESS_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setFitnessGoal(goal.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                        fitnessGoal === goal.id
                          ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500/40 text-white'
                          : 'bg-black/60 border-white/10 hover:border-white/20 text-white/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{goal.icon}</span>
                        <div>
                          <span className="text-xs font-bold font-serif block text-white">
                            {goal.label}
                          </span>
                          <span className="text-[10px] font-mono text-white/50 block">
                            {goal.desc}
                          </span>
                        </div>
                      </div>
                      {fitnessGoal === goal.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity / Experience Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-white/70 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>Training Experience Level</span>
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {['Beginner', 'Intermediate', 'Advanced Athlete'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-2 rounded-lg border text-center transition-colors ${
                        experienceLevel === lvl
                          ? 'bg-emerald-500 border-emerald-400 text-black font-bold'
                          : 'bg-black border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete Setup & Launch Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Profile & Launch Elite Habit</span>
              </button>
            </form>
          )}
        </div>

        {/* Demo Quick Access Hint */}
        <div className="text-center bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-[11px] font-mono text-white/60">
          💡 <span className="text-white font-bold">Instant Access:</span> Enter phone number, click 'Send OTP', use code <span className="text-emerald-400 font-bold">123456</span> or auto-fill!
        </div>
      </div>
    </div>
  );
};

