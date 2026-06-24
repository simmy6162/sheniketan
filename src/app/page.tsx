<<<<<<< HEAD
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Key, 
  HeartPulse, 
  Megaphone, 
  Plane, 
  CheckCircle, 
  Wifi, 
  Clock, 
  Heart, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Mail, 
  Phone, 
  Menu, 
  X, 
  Smile, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ComplaintTicket {
  id: string;
  issue: string;
  date: string;
  status: 'Submitted' | 'In Progress' | 'Done';
=======
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">She Niketan</h1>
      <p className="text-muted-foreground text-center max-w-md text-zinc-600">
        Girls Residence Management Systemssss — platform scaffolding initialized.
      </p>
    </main>
  );
>>>>>>> 3401034407d6096de9304da90be5e9b3879b6a05
}

interface LeaveRequest {
  id: string;
  reason: string;
  dates: string;
  status: 'Pending Admin Review' | 'Approved by Warden';
}

export default function App() {
  const [activeSimTab, setActiveSimTab] = useState<'room' | 'care' | 'notices' | 'leave'>('room');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Custom states for form submissions in the simulated phone screen
  const [newComplaintText, setNewComplaintText] = useState('');
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([
    { id: '1', issue: 'Wi-Fi connection latency in Wing B', date: 'Today, 10:15 AM', status: 'In Progress' },
    { id: '2', issue: 'Thermostat calibration request', date: 'Yesterday', status: 'Done' }
  ]);

  const [leaveReason, setNewLeaveReason] = useState('');
  const [leaveDates, setNewLeaveDates] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: '1', reason: 'Weekend home visit to parents', dates: 'June 26 - June 28', status: 'Approved by Warden' }
  ]);

  // Active lifestyle profile state (For personalized value presentation)
  const [activePersona, setActivePersona] = useState<'student' | 'professional' | 'aspirant' | 'attendant'>('student');

  // FAQ Accordion Toggle Status
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSimComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintText.trim()) return;

    const newTicket: ComplaintTicket = {
      id: Date.now().toString(),
      issue: newComplaintText,
      date: 'Just now',
      status: 'Submitted'
    };

    setComplaints([newTicket, ...complaints]);
    setNewComplaintText('');

    // Simulate Warden acknowledging the ticket and putting it "In Progress"
    setTimeout(() => {
      setComplaints(prevTickets => 
        prevTickets.map(t => t.id === newTicket.id ? { ...t, status: 'In Progress' } : t)
      );
    }, 2500);
  };

  const handleSimLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim() || !leaveDates.trim()) return;

    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      reason: leaveReason,
      dates: leaveDates,
      status: 'Pending Admin Review'
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setNewLeaveReason('');
    setNewLeaveDates('');

    // Simulate Warden reviewing and approving the request automatically
    setTimeout(() => {
      setLeaveRequests(prevRequests =>
        prevRequests.map(r => r.id === newRequest.id ? { ...r, status: 'Approved by Warden' } : r)
      );
    }, 3000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-brand-cream text-brand-charcoal font-sans min-h-screen selection:bg-brand-sage-light selection:text-brand-forest overflow-x-hidden">
      
      {/* Header section */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-sand transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <span className="w-10 h-10 rounded-full bg-brand-sage flex items-center justify-center text-brand-cream font-serif text-xl font-semibold tracking-wider transition-transform duration-500 group-hover:rotate-12">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wide text-brand-forest leading-none">she niketan</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-brand-sage font-semibold mt-1">Girls' Residence Sanctuary</span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('experience')} className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal hover:text-brand-sage transition-colors">Our Approach</button>
            <button onClick={() => scrollToSection('personalization')} className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal hover:text-brand-sage transition-colors">Your Fit</button>
            <button onClick={() => scrollToSection('suites')} className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal hover:text-brand-sage transition-colors">The Suites</button>
            <button onClick={() => scrollToSection('guarantee')} className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal hover:text-brand-sage transition-colors">Trust & Safety</button>
            <button onClick={() => scrollToSection('faq')} className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal hover:text-brand-sage transition-colors">FAQ</button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs tracking-wider uppercase font-semibold text-brand-sage hover:text-brand-forest transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-brand-sage hover:bg-brand-sage-hover text-brand-cream px-5 py-2.5 rounded-full text-xs tracking-wider uppercase font-semibold shadow-md shadow-brand-sage/10 transition-all duration-300 hover:translate-y-[-1px]"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Hamburger menu */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-brand-charcoal hover:text-brand-sage focus:outline-none">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-20 bg-brand-cream border-b border-brand-sand shadow-xl animate-fade-in">
            <div className="px-6 py-6 flex flex-col gap-4">
              <button onClick={() => scrollToSection('experience')} className="text-left text-xs uppercase tracking-wider font-semibold text-brand-charcoal py-2 border-b border-brand-sand/50">Our Approach</button>
              <button onClick={() => scrollToSection('personalization')} className="text-left text-xs uppercase tracking-wider font-semibold text-brand-charcoal py-2 border-b border-brand-sand/50">Your Fit</button>
              <button onClick={() => scrollToSection('suites')} className="text-left text-xs uppercase tracking-wider font-semibold text-brand-charcoal py-2 border-b border-brand-sand/50">The Suites</button>
              <button onClick={() => scrollToSection('guarantee')} className="text-left text-xs uppercase tracking-wider font-semibold text-brand-charcoal py-2 border-b border-brand-sand/50">Trust & Safety</button>
              <button onClick={() => scrollToSection('faq')} className="text-left text-xs uppercase tracking-wider font-semibold text-brand-charcoal py-2 border-b border-brand-sand/50">FAQ</button>
              <div className="pt-2 flex flex-col gap-3">
                <Link href="/login" className="bg-brand-sage text-brand-cream w-full py-3 rounded-xl text-xs tracking-wider uppercase font-semibold text-center shadow-md">
                  Login
                </Link>
                <Link href="/register" className="border border-brand-sage text-brand-sage w-full py-3 rounded-xl text-xs tracking-wider uppercase font-semibold text-center">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-brand-sage-light/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-0 -ml-20 w-96 h-96 bg-brand-sand/50 rounded-full blur-2xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <div className="lg:col-span-6 flex flex-col space-y-8 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-sage-light border border-brand-sage-border/50 w-fit">
                <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wider text-brand-forest uppercase">An Autonomy-First Girls' Sanctuary</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-forest leading-[1.1] font-light">
                Beautiful city living,<br />
                <span className="font-serif italic font-normal text-brand-sage">perfectly managed.</span>
              </h1>

              <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed font-light">
                She Niketan is an independent, premium girls' residence sanctuary. Completely free from rigid, outdated college-dorm rules, we provide modern, fully managed suites designed for focus, safety, and sisterhood.
              </p>

              {/* Core value vectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-4 border-t border-brand-sand">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-sage-light flex items-center justify-center text-brand-sage">
                    <Smile className="w-4 h-4" />
                  </span>
                  <span className="text-xs text-brand-forest font-semibold tracking-wide uppercase">Warden-Guided Warmth</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-sage-light flex items-center justify-center text-brand-sage">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span className="text-xs text-brand-forest font-semibold tracking-wide uppercase">Biometric Gates & Logs</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-sage-light flex items-center justify-center text-brand-sage">
                    <HeartPulse className="w-4 h-4" />
                  </span>
                  <span className="text-xs text-brand-forest font-semibold tracking-wide uppercase">One-Tap Comfort Tickets</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-sage-light flex items-center justify-center text-brand-sage">
                    <Key className="w-4 h-4" />
                  </span>
                  <span className="text-xs text-brand-forest font-semibold tracking-wide uppercase">Lifestyle Matchmaking</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => scrollToSection('inquiry')} 
                  className="bg-brand-sage hover:bg-brand-sage-hover text-brand-cream px-8 py-4 rounded-xl text-xs tracking-wider uppercase font-bold shadow-lg shadow-brand-sage/20 transition-all duration-300 hover:translate-y-[-2px] flex items-center justify-center gap-2"
                >
                  <span>Select Suite & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollToSection('experience')} 
                  className="bg-transparent hover:bg-brand-sand border border-brand-sage/30 text-brand-forest px-8 py-4 rounded-xl text-xs tracking-wider uppercase font-bold transition-all duration-300"
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Right Column: Dynamic Live App Mockup Simulator */}
            <div className="lg:col-span-6 relative flex justify-center">
              
              {/* Outer phone mockup structure */}
              <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-brand-charcoal p-3 sm:p-4 rounded-[40px] sm:rounded-[48px] border-[8px] sm:border-[10px] border-brand-charcoal shadow-2xl overflow-hidden aspect-[9/18.5]">
                
                {/* Phone Speaker & Camera Notch */}
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center items-center z-20">
                  <div className="w-24 h-4 bg-brand-charcoal rounded-b-xl flex justify-center items-center">
                    <span className="w-8 h-1 bg-[#1c1d1d] rounded-full"></span>
                    <span className="w-2 h-2 bg-[#1c1d1d] rounded-full ml-2"></span>
                  </div>
                </div>

                {/* Mockup Screen Area */}
                <div className="relative bg-brand-beige rounded-[28px] sm:rounded-[36px] overflow-hidden flex flex-col h-[480px] sm:h-[530px] pt-4 select-none">
                  
                  {/* Phone Header Block */}
                  <div className="bg-brand-cream p-3 sm:p-4 border-b border-brand-sand flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-brand-sage flex items-center justify-center text-brand-cream font-serif text-sm font-semibold">S</span>
                      <div>
                        <h4 className="font-serif text-[11px] font-bold text-brand-forest leading-none">She Niketan</h4>
                        <p className="text-[9px] text-gray-500 font-medium mt-0.5">Hello, Priyanjali (Resident)</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Secure Portal Online"></span>
                  </div>

                  {/* Simulator Dynamic Content Frame */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
                    
                    {activeSimTab === 'room' && (
                      <div className="space-y-3 animate-fade-in text-left">
                        <div className="bg-brand-cream p-3 rounded-xl border border-brand-sand">
                          <span className="text-[8px] uppercase tracking-wider font-bold text-brand-sage block">Suite Configuration</span>
                          <h5 className="font-serif text-xs font-semibold text-brand-charcoal mt-1">Twin Sharing (Studio 402-A)</h5>
                          <p className="text-[9px] text-gray-500">Silent Study & Deep Focus Wing</p>
                        </div>
                        
                        <div className="bg-brand-cream p-3 rounded-xl border border-brand-sand">
                          <span className="text-[8px] uppercase tracking-wider font-bold text-brand-sage block">Warden Aligned Roommate</span>
                          <div className="flex items-center gap-2.5 mt-2">
                            <div className="w-7 h-7 rounded-full bg-brand-sage-light flex items-center justify-center font-bold text-[10px] text-brand-sage">AM</div>
                            <div>
                              <p className="text-[10px] font-semibold text-slate-800">Ananya Mishra</p>
                              <p className="text-[9px] text-gray-500">Exam Aspirant • Quiet Hours: 10 PM</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] text-emerald-800 flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>Warden Match validated: Mutual morning schedules and focus goals perfectly aligned.</span>
                        </div>
                      </div>
                    )}

                    {activeSimTab === 'care' && (
                      <div className="space-y-3 animate-fade-in text-left">
                        <div className="bg-brand-cream p-3 rounded-xl border border-brand-sand">
                          <span className="text-[8px] uppercase tracking-wider font-bold text-brand-sage block">Raise Comfort Care Ticket</span>
                          <form onSubmit={handleSimComplaintSubmit} className="mt-2 space-y-2">
                            <input 
                              type="text" 
                              value={newComplaintText}
                              onChange={(e) => setNewComplaintText(e.target.value)}
                              placeholder="E.g., Bathroom lightbulb flickering" 
                              className="w-full text-[10px] p-2 bg-brand-beige border border-brand-sand rounded-lg focus:outline-none focus:border-brand-sage"
                            />
                            <button 
                              type="submit" 
                              className="w-full bg-brand-sage text-brand-cream text-[9px] uppercase tracking-wider font-bold py-1.5 rounded-lg transition-colors hover:bg-brand-sage-hover"
                            >
                              File Care Ticket
                            </button>
                          </form>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[8px] uppercase tracking-wider font-bold text-gray-400 block">Ticket Resolution Log</span>
                          {complaints.map((item) => (
                            <div key={item.id} className="bg-brand-cream p-2.5 rounded-lg border border-brand-sand flex justify-between items-center">
                              <div>
                                <p className="text-[9.5px] font-semibold text-brand-charcoal leading-normal">{item.issue}</p>
                                <p className="text-[8px] text-gray-400">{item.date}</p>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                item.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                                item.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSimTab === 'notices' && (
                      <div className="space-y-3 animate-fade-in text-left">
                        <span className="text-[8px] uppercase tracking-wider font-bold text-gray-400 block">Notice Board Updates</span>
                        
                        <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5 text-amber-900 text-[10px] font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Teej Festival Celebration 🎉</span>
                          </div>
                          <p className="text-[9px] text-amber-800 leading-normal mt-1">
                            Friday 6:00 PM: Central lawn floral decor, music, and traditional buffet. All residents welcome!
                          </p>
                        </div>

                        <div className="bg-red-50 border border-red-100 p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5 text-red-900 text-[10px] font-bold">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Facility Maintenance Scheduled</span>
                          </div>
                          <p className="text-[9px] text-red-800 leading-normal mt-1">
                            Tomorrow, 2:00 PM to 4:00 PM: Routine water filter servicing. Expect temporary outage.
                          </p>
                        </div>

                        <div className="bg-brand-cream border border-brand-sand p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5 text-slate-800 text-[10px] font-bold">
                            <CheckCircle className="w-3.5 h-3.5 text-brand-sage" />
                            <span>Parcel Arrivals Notification</span>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal mt-1">
                            Packages received today have been verified and placed inside storage lockers. Claim yours with Warden Desk.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeSimTab === 'leave' && (
                      <div className="space-y-3 animate-fade-in text-left">
                        <div className="bg-brand-cream p-3 rounded-xl border border-brand-sand">
                          <span className="text-[8px] uppercase tracking-wider font-bold text-brand-sage block">Log Secure Travel Leave</span>
                          <form onSubmit={handleSimLeaveSubmit} className="mt-2 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[7.5px] font-bold text-gray-500 uppercase block">Leave Dates</label>
                                <input 
                                  type="text" 
                                  required
                                  value={leaveDates}
                                  onChange={(e) => setNewLeaveDates(e.target.value)}
                                  placeholder="E.g., June 25-27" 
                                  className="w-full text-[9px] p-1.5 bg-brand-beige border border-brand-sand rounded"
                                />
                              </div>
                              <div>
                                <label className="text-[7.5px] font-bold text-gray-500 uppercase block">Log Reason</label>
                                <input 
                                  type="text" 
                                  required
                                  value={leaveReason}
                                  onChange={(e) => setNewLeaveReason(e.target.value)}
                                  placeholder="E.g., Going home" 
                                  className="w-full text-[9px] p-1.5 bg-brand-beige border border-brand-sand rounded"
                                />
                              </div>
                            </div>
                            <button 
                              type="submit" 
                              className="w-full bg-brand-sage text-brand-cream text-[9px] uppercase tracking-wider font-bold py-1.5 rounded-lg transition-colors hover:bg-brand-sage-hover"
                            >
                              Log Secure Leave
                            </button>
                          </form>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[8px] uppercase tracking-wider font-bold text-gray-400 block">Travel Log Security Logs</span>
                          {leaveRequests.map((req) => (
                            <div key={req.id} className="bg-brand-cream p-2.5 rounded-lg border border-brand-sand flex justify-between items-center">
                              <div>
                                <p className="text-[9.5px] font-semibold text-brand-charcoal leading-normal">{req.reason}</p>
                                <p className="text-[8px] text-gray-400">Duration: {req.dates}</p>
                              </div>
                              <span className={`text-[7.5px] font-bold px-1.5 py-0.5 rounded-full ${
                                req.status === 'Approved by Warden' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {req.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Menu Tabs Navigation */}
                  <div className="bg-brand-cream border-t border-brand-sand px-2 py-2 flex justify-around text-gray-500 text-[10px]">
                    <button 
                      onClick={() => setActiveSimTab('room')} 
                      className={`flex flex-col items-center flex-1 py-1 transition-all ${activeSimTab === 'room' ? 'text-brand-sage font-bold' : 'hover:text-brand-sage'}`}
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span className="text-[8.5px] mt-0.5">My Suite</span>
                    </button>
                    <button 
                      onClick={() => setActiveSimTab('care')} 
                      className={`flex flex-col items-center flex-1 py-1 transition-all ${activeSimTab === 'care' ? 'text-brand-sage font-bold' : 'hover:text-brand-sage'}`}
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span className="text-[8.5px] mt-0.5">Care Ticket</span>
                    </button>
                    <button 
                      onClick={() => setActiveSimTab('notices')} 
                      className={`flex flex-col items-center flex-1 py-1 transition-all ${activeSimTab === 'notices' ? 'text-brand-sage font-bold' : 'hover:text-brand-sage'}`}
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span className="text-[8.5px] mt-0.5">Notices</span>
                    </button>
                    <button 
                      onClick={() => setActiveSimTab('leave')} 
                      className={`flex flex-col items-center flex-1 py-1 transition-all ${activeSimTab === 'leave' ? 'text-brand-sage font-bold' : 'hover:text-brand-sage'}`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span className="text-[8.5px] mt-0.5">Travel Log</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Helper Tip Block */}
              <div className="absolute -bottom-6 bg-brand-cream/95 backdrop-blur-md px-4 py-2.5 border border-brand-sand rounded-full shadow-lg flex items-center gap-2 text-xs text-brand-forest font-semibold">
                <Sparkles className="w-4 h-4 text-brand-sage animate-bounce" />
                <span>Tap simulated screens above to preview live!</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ethos Section */}
      <section id="experience" className="py-20 bg-brand-beige border-y border-brand-sand">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-sage">The She Niketan Ethos</span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-forest font-light leading-tight">
            "We built a home that protects your focus, celebrates your ambitions, and honors your autonomy."
          </h2>
          <div className="w-16 h-[1px] bg-brand-sage/50 mx-auto"></div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light max-w-2xl mx-auto">
            Standard hostels and dorms often make residents feel like numbers governed by outdated restrictions. At She Niketan, we believe independent living should support you, not monitor you. From exam focus rooms to customized clinical caregiver options, everything we do centers around customer support.
          </p>
        </div>
      </section>

      {/* Personalization Section */}
      <section id="personalization" className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-wider text-brand-sage font-bold">Resident Alignment</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-forest font-light">Customized for your current life chapter</h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-lg mx-auto">Select your current focus to see how we systematically mold our quiet spaces and management care around you.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 md:gap-4 max-w-3xl mx-auto mb-10">
            {[
              { id: 'student', title: 'Student & Intern', icon: Smile },
              { id: 'professional', title: 'Job Holder & Professional', icon: Key },
              { id: 'aspirant', title: 'Competitive Exam Prepper', icon: Clock },
              { id: 'attendant', title: 'Patient Attendant / Families', icon: HeartPulse }
            ].map((p) => {
              const IconComp = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activePersona === p.id 
                    ? 'bg-brand-sage text-brand-cream shadow-md shadow-brand-sage/25' 
                    : 'bg-brand-beige border border-brand-sand text-brand-forest hover:bg-brand-sage-light'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto bg-brand-beige border border-brand-sand p-6 sm:p-10 rounded-2xl shadow-sm transition-all duration-500">
            {activePersona === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-sage">Ecosystem Alignment</span>
                  <h3 className="font-serif text-2xl font-light text-brand-forest">Quiet Roommate Matching & Peer Mentorship</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    Shared space should mean aligned aspirations. Our system matches you with fellow university students or hospital trainees on similar sleep patterns, academic programs, and lifestyle habits.
                  </p>
                  <ul className="space-y-1.5 text-xs text-brand-forest font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Curated Peer-To-Peer Networking</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Academic Study Lounges</li>
                  </ul>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800" 
                    alt="Students studying comfortably" 
                    className="rounded-xl w-full h-52 object-cover filter brightness-95"
                  />
                </div>
              </div>
            )}

            {activePersona === 'professional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-sage">Zero-Friction Co-Living</span>
                  <h3 className="font-serif text-2xl font-light text-brand-forest">Worry-Free Chores & Professional Ergonomics</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    When working full days or dealing with night shifts, the last thing you need is a rigid curfew or roommate clashes. We offer dedicated professional zones with ergonomic setups, high-speed secondary fiber backups, and housekeeping managed entirely on your tap.
                  </p>
                  <ul className="space-y-1.5 text-xs text-brand-forest font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Automated Weekly Laundry Logs</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Dignified Digital Door Access codes</li>
                  </ul>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800" 
                    alt="Modern room office space" 
                    className="rounded-xl w-full h-52 object-cover filter brightness-95"
                  />
                </div>
              </div>
            )}

            {activePersona === 'aspirant' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-sage">Silent study focus</span>
                  <h3 className="font-serif text-2xl font-light text-brand-forest">Silent Zones & High Focus Hours</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    Preparing for Civil Exams, Banking, or Clinical entry requires absolute stillness. In our Aspirant focus corridors, strict quiet regulations exist after 9:30 PM. Roommates are systematically matched to fellow preppers.
                  </p>
                  <ul className="space-y-1.5 text-xs text-brand-forest font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Silent Individual Desks with Ergonomic Chairs</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Warden-Enforced Focus Hours</li>
                  </ul>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" 
                    alt="Desk set up for preparation" 
                    className="rounded-xl w-full h-52 object-cover filter brightness-95"
                  />
                </div>
              </div>
            )}

            {activePersona === 'attendant' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-sage">Sanctuary Healing Care</span>
                  <h3 className="font-serif text-2xl font-light text-brand-forest">Empathy-Driven Stays for Families</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    Caring for a relative in nearby medical hubs is emotionally taxing. We provide specialized, clean, high-hygiene suites with streamlined check-in coordinates, custom meal logs, and absolute safety to make your heavy days simpler.
                  </p>
                  <ul className="space-y-1.5 text-xs text-brand-forest font-medium">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Flexible Short-Term Stays Available</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-sage" /> Direct Communication channels with Warden</li>
                  </ul>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" 
                    alt="Sanitized clean bedside" 
                    className="rounded-xl w-full h-52 object-cover filter brightness-95"
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-20 bg-brand-beige border-t border-brand-sand">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-wider text-brand-sage font-bold">Uncompromising Quality</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-forest font-light">Crafted for a friction-free experience in the city</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">We focus on eliminating minor stress triggers so you can dedicate full attention to your core ambitions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Value Card 1 */}
            <div className="bg-brand-cream p-8 rounded-2xl border border-brand-sand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-sage-light flex items-center justify-center text-brand-sage">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-brand-charcoal">Suite Matchmaking</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  No random roommate allocations. We look closely at work backgrounds, bedtime limits, and general habits before pairing you up.
                </p>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-brand-sage mt-6 block">Personalized Pairings Only</span>
            </div>

            {/* Value Card 2 */}
            <div className="bg-brand-cream p-8 rounded-2xl border border-brand-sand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-sage-light flex items-center justify-center text-brand-sage">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-brand-charcoal">Rapid Comfort Tickets</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Flickering bulb? Lagging Wi-Fi connection? Lodge it with a tap inside your secure app, and follow the exact progression without awkward follow-ups.
                </p>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-brand-sage mt-6 block">Always Handled Within Hours</span>
            </div>

            {/* Value Card 3 */}
            <div className="bg-brand-cream p-8 rounded-2xl border border-brand-sand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-sage-light flex items-center justify-center text-brand-sage">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-brand-charcoal">Shared Sisterhood</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  From critical security advisories from the Warden to community dinners and local Teej festival gatherings, you are always beautifully aligned.
                </p>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-brand-sage mt-6 block">Real-time Bulletin Board</span>
            </div>

            {/* Value Card 4 */}
            <div className="bg-brand-cream p-8 rounded-2xl border border-brand-sand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-sage-light flex items-center justify-center text-brand-sage">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-brand-charcoal">Dignified Safe Logs</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Update the Warden instantly about weekend travels or holiday visits home without filling out outdated paper registers or arguing with gate staff.
                </p>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-brand-sage mt-6 block">Transparent Guard Security</span>
            </div>

          </div>
        </div>
      </section>

      {/* Sanctuary Suites section */}
      <section id="suites" className="py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-3 text-left">
              <span className="text-xs uppercase tracking-wider text-brand-sage font-bold">Quiet Sanctuaries</span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-forest font-light">Elegantly Furnished Girls' Suites</h2>
            </div>
            <p className="text-slate-500 text-xs md:text-sm max-w-sm mt-3 md:mt-0 text-left">
              Every room includes ergonomic study desks, posture-support mattresses, individual closets, and 24/7 hot water access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Single Sanctuary */}
            <div className="bg-brand-beige rounded-2xl overflow-hidden border border-brand-sand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" 
                    alt="Single Premium Suite Bedroom" 
                    className="w-full h-64 object-cover filter brightness-95"
                  />
                  <span className="absolute top-4 left-4 bg-brand-forest text-brand-cream px-3 py-1 rounded-full text-[9px] uppercase font-semibold tracking-wider">
                    Absolute Quiet Wing
                  </span>
                </div>
                <div className="p-6 space-y-3 text-left">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-2xl font-light text-brand-forest">Single Suite Sanctuary</h3>
                    <span className="text-xs text-gray-500">Starting at <strong className="text-brand-sage font-serif text-lg">$249</strong>/mo</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    The ultimate space for competitive exam preppers, software developers, and research students who need a quiet layout for study blocks.
                  </p>
                </div>
              </div>
            </div>

            {/* Twin Sharing Studio */}
            <div className="bg-brand-beige rounded-2xl overflow-hidden border border-brand-sand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" 
                    alt="Twin sharing co-living setup" 
                    className="w-full h-64 object-cover filter brightness-95"
                  />
                  <span className="absolute top-4 left-4 bg-brand-forest text-brand-cream px-3 py-1 rounded-full text-[9px] uppercase font-semibold tracking-wider">
                    Lifestyle Matched Pairing
                  </span>
                </div>
                <div className="p-6 space-y-3 text-left">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-2xl font-light text-brand-forest">Twin Sharing Studio</h3>
                    <span className="text-xs text-gray-500">Starting at <strong className="text-brand-sage font-serif text-lg">$169</strong>/mo</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    Perfect for friends, interns, or students seeking shared economic values combined with matched schedules and quiet study limits.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section id="guarantee" className="py-20 bg-brand-forest text-brand-cream">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-sage-border font-bold">Uncompromising Protection</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-light">Independent Living. Deep Security.</h2>
            <p className="text-brand-sage-border text-xs md:text-sm">We provide a robust safety circle that protects you 24/7 without limiting your autonomy as an adult.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-brand-forest-dark rounded-2xl border border-brand-sage/25 space-y-4 text-left">
              <div className="w-10 h-10 rounded-full bg-brand-sage/30 flex items-center justify-center text-brand-cream">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white">Biometric Access & Logs</h3>
              <p className="text-xs text-brand-sage-border leading-relaxed font-light">
                Smart gates verify residents instantly. Visitors receive unique entry codes via your resident portal, eliminating manual guestbook logging.
              </p>
            </div>

            <div className="p-8 bg-brand-forest-dark rounded-2xl border border-brand-sage/25 space-y-4 text-left">
              <div className="w-10 h-10 rounded-full bg-brand-sage/30 flex items-center justify-center text-brand-cream">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white">24/7 Security Patrols</h3>
              <p className="text-xs text-brand-sage-border leading-relaxed font-light">
                Trained guards patrol all perimeters continuously, backed by high-definition CCTV security arrays mapping all corridor and entrance gates.
              </p>
            </div>

            <div className="p-8 bg-brand-forest-dark rounded-2xl border border-brand-sage/25 space-y-4 text-left">
              <div className="w-10 h-10 rounded-full bg-brand-sage/30 flex items-center justify-center text-brand-cream">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white">Integrated Warden Care</h3>
              <p className="text-xs text-brand-sage-border leading-relaxed font-light">
                Professional wardens reside on-site, offering dedicated support, meal management, medical assistance coordination, and emergency response.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-brand-cream border-t border-brand-sand">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-wider text-brand-sage font-bold">Your Questions Answered</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-forest font-light">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Get details on our guidelines, subscription values, and daily residency operations.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 1,
                q: "Are there strict curfew rules at She Niketan?",
                a: "Unlike traditional hostels, we do not enforce rigid, outdated curfews. We treat you as an adult. We ask residents to log late-night entries or weekend stays on their portal so our guard log is synchronized and the warden remains aware of building occupancy for safety reasons."
              },
              {
                id: 2,
                q: "How is the roommate matching process handled?",
                a: "During application, you share details about your daily routines, study periods, noise tolerances, and active goals. Our lifestyle matchmaking systematically groups preppers in quiet zones, students in active zones, and aligns mutual waking habits."
              },
              {
                id: 3,
                q: "What is included in the monthly suite subscription?",
                a: "Your subscription includes fully furnished suite accommodation (ergonomic desk, custom storage), high-speed Wi-Fi access, bi-weekly deep cleaning, washing machine logs, 24/7 security perimeter logs, and complete access to study lounges."
              },
              {
                id: 4,
                q: "How does the Comfort Care Ticketing work?",
                a: "If a lightbulb flickers or connection lags, open your simulated care tab to submit a ticket. Our warden desk receives the alert instantly, assign an engineer, and update the ticket status dynamically in real-time, removing manual follow-up stress."
              }
            ].map((item) => (
              <div key={item.id} className="border-b border-brand-sand pb-4">
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex justify-between items-center py-4 text-left text-brand-forest hover:text-brand-sage transition-colors focus:outline-none"
                >
                  <span className="font-serif text-lg font-medium">{item.q}</span>
                  {faqOpen[item.id] ? (
                    <ChevronUp className="w-5 h-5 text-brand-sage flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-brand-sage flex-shrink-0" />
                  )}
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    faqOpen[item.id] ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-600 text-sm leading-relaxed font-light pl-1 pr-6 pb-2">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-brand-cream border-t border-brand-forest-dark py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-brand-sage flex items-center justify-center text-brand-cream font-serif text-xl font-bold">
                S
              </span>
              <span className="font-serif text-2xl font-bold tracking-wide text-white">she niketan</span>
            </div>
            <p className="text-xs text-brand-sage-border leading-relaxed font-light max-w-sm">
              An independent, premium residence sanctuary for girls, designed to support focus, health, and secure sisterhood without curfew constraints.
            </p>
            <div className="space-y-3 pt-2 text-xs text-brand-sage-border">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-sage flex-shrink-0" />
                <span>Sector A-4, Sanctuary Residency Block, City Centre</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-sage flex-shrink-0" />
                <span>desk@sheniketan.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-sage flex-shrink-0" />
                <span>+1 800 555 888 (24/7 Front Desk)</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white">Navigation</h4>
            <div className="flex flex-col gap-2.5 text-xs text-brand-sage-border">
              <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors text-left">Home</button>
              <button onClick={() => scrollToSection('experience')} className="hover:text-white transition-colors text-left">Our Ethos</button>
              <button onClick={() => scrollToSection('personalization')} className="hover:text-white transition-colors text-left">Your Fit</button>
              <button onClick={() => scrollToSection('suites')} className="hover:text-white transition-colors text-left">Sanctuary Suites</button>
              <button onClick={() => scrollToSection('guarantee')} className="hover:text-white transition-colors text-left">Safety Systems</button>
            </div>
          </div>

          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white">Ethical Guidelines</h4>
            <p className="text-xs text-brand-sage-border leading-relaxed font-light">
              She Niketan operates on mutual respect, professional boundary management, and focus security. Resident logs are strictly private and accessible only to verified wardens for emergency support.
            </p>
            <div className="w-fit border border-brand-sage/30 rounded-xl px-4 py-2 bg-brand-forest-dark/45 text-[10px] text-brand-sage-border">
              Warden Alignment Certified • 2026
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-brand-forest-dark/50 flex flex-col sm:flex-row justify-between items-center text-xs text-brand-sage-border gap-4">
          <p>© {new Date().getFullYear()} She Niketan Sanctuary. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Stay</a>
            <a href="#" className="hover:text-white transition-colors">Resident Charter</a>
          </div>
        </div>
      </footer>

    </div>
  );
}