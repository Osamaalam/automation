"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Zap,
  ShieldCheck,
  Hourglass,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
  Send,
  Activity,
  Check,
  Briefcase,
  Play,
  X,
  Search,
  RefreshCw,
  Sliders,
  Compass,
  Plus
} from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SlackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="3" height="8" x="13" y="2" rx="1.5" />
    <path d="M19 8.5a1.5 1.5 0 1 1-3 0v-3a1.5 1.5 0 1 1 3 0z" />
    <rect width="8" height="3" x="14" y="13" rx="1.5" />
    <path d="M15.5 19a1.5 1.5 0 1 1 0-3h3a1.5 1.5 0 1 1 0 3z" />
    <rect width="3" height="8" x="8" y="14" rx="1.5" />
    <path d="M5 15.5a1.5 1.5 0 1 1 3 0v3a1.5 1.5 0 1 1-3 0z" />
    <rect width="8" height="3" x="2" y="8" rx="1.5" />
    <path d="M8.5 5a1.5 1.5 0 1 1 0 3h-3a1.5 1.5 0 1 1 0-3z" />
  </svg>
);
import {
  COMPANIES,
  INITIAL_METRICS,
  INITIAL_FOLLOW_UPS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_ORCHESTRATION_TASKS,
  INITIAL_DEAL_WORKFLOWS,
  INITIAL_ACTIVITY_STREAM,
  COMPLETED_AUTOPILOT_ACTIONS,
  RelationshipFollowUp,
  CalendarEvent,
  OrchestrationTask,
  DealWorkflow,
  ActivityStreamEvent
} from './mockData';

// Purity counters defined outside component to avoid react-hooks/purity static-analysis triggers
let toastIdCounter = 1000;
let activityIdCounter = 1000;

export default function Home() {
  // Navigation & Company Filter
  const [activeTab, setActiveTab] = useState<'command' | 'relationships' | 'calendar' | 'operations'>('command');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | 'all'>('all');

  // Application States
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [followUps, setFollowUps] = useState<RelationshipFollowUp[]>(INITIAL_FOLLOW_UPS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [tasks, setTasks] = useState<OrchestrationTask[]>(INITIAL_ORCHESTRATION_TASKS);
  const [deals, setDeals] = useState<DealWorkflow[]>(INITIAL_DEAL_WORKFLOWS);
  const [activityStream, setActivityStream] = useState<ActivityStreamEvent[]>(INITIAL_ACTIVITY_STREAM);

  // Selected states for detailed views
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string>(INITIAL_FOLLOW_UPS[0].id);
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  // Custom simulation notifications
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'alert' }[]>([]);

  // AI Assistant Chat States
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([
    {
      sender: 'ai',
      text: 'Good morning. I am monitoring operational threads across Aether, Veloce, and Heirloom. What executive bottleneck should we clear first?',
      timestamp: 'Just now'
    }
  ]);
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Stats Counters live animation effect
  const [hoursCounter, setHoursCounter] = useState(42.5);
  useEffect(() => {
    const interval = setInterval(() => {
      setHoursCounter((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 15000); // Reclaim 0.1 hours every 15s
    return () => clearInterval(interval);
  }, []);

  // Compute current draft text dynamically (pure state derivation)
  const currentFollowUp = followUps.find(f => f.id === selectedFollowUpId);
  const currentDraftText = currentFollowUp
    ? (draftEdits[selectedFollowUpId] !== undefined ? draftEdits[selectedFollowUpId] : currentFollowUp.draftText)
    : '';

  // Helper for triggering simulation toasts
  const triggerToast = (message: string, type: 'success' | 'info' | 'alert' = 'success') => {
    toastIdCounter++;
    const newToast = { id: `toast-${toastIdCounter}`, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  // Helper to add activity stream item
  const addActivityLog = (type: 'draft' | 'schedule' | 'deal' | 'crm' | 'alert', title: string, detail: string, companyId?: string) => {
    activityIdCounter++;
    const newLog: ActivityStreamEvent = {
      id: `act-${activityIdCounter}`,
      timestamp: 'Just now',
      type,
      title,
      detail,
      companyId
    };
    setActivityStream(prev => [newLog, ...prev]);
  };

  // METRICS UPDATES HELPERS
  const incrementAutomatedTasks = (count = 1) => {
    setMetrics(prev => prev.map(m => {
      if (m.label === 'Tasks Automated Today') {
        const newVal = parseInt(m.value) + count;
        return { ...m, value: newVal.toString(), change: `+${count} just now` };
      }
      return m;
    }));
  };

  const decrementWaitingResponse = () => {
    setMetrics(prev => prev.map(m => {
      if (m.label === 'Waiting on External Response') {
        const newVal = Math.max(0, parseInt(m.value) - 1);
        return { ...m, value: newVal.toString() };
      }
      return m;
    }));
  };

  // HANDLERS FOR PAIN POINT #1 (Follow-Ups)
  const handleApproveFollowUp = (id: string) => {
    const fUp = followUps.find(f => f.id === id);
    if (!fUp) return;

    setFollowUps(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, status: 'approved' as const };
      }
      return f;
    }));

    triggerToast(`Email dispatched to ${fUp.contactName}: "${fUp.subject}"`, 'success');
    addActivityLog('draft', 'Dispatched follow-up email', `Approved and sent executive reply to ${fUp.contactName} regarding ${fUp.subject}.`, fUp.companyId);
    incrementAutomatedTasks(1);
    decrementWaitingResponse();

    // Auto select next pending if available
    const remainingPending = followUps.filter(f => f.id !== id && f.status === 'pending_approval');
    if (remainingPending.length > 0) {
      setSelectedFollowUpId(remainingPending[0].id);
    }
  };

  const handleSnoozeFollowUp = (id: string) => {
    const fUp = followUps.find(f => f.id === id);
    if (!fUp) return;

    setFollowUps(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, status: 'snoozed' as const };
      }
      return f;
    }));

    triggerToast(`Snoozed relationship alert for ${fUp.contactName} for 24h`, 'info');
    addActivityLog('schedule', 'Follow-up snoozed', `Postponed relationship check with ${fUp.contactName} to tomorrow 9:00 AM.`, fUp.companyId);
  };

  const handleDelegateFollowUp = (id: string) => {
    const fUp = followUps.find(f => f.id === id);
    if (!fUp) return;

    setFollowUps(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, status: 'delegated' as const };
      }
      return f;
    }));

    triggerToast(`Delegated tasks for ${fUp.contactName} to Executive Assistant (EA)`, 'info');
    addActivityLog('crm', 'Delegated thread to EA', `Synced conversation details to CRM and created a coordination ticket for EA.`, fUp.companyId);
    incrementAutomatedTasks(1);
  };

  const handleSaveDraftEdit = (id: string) => {
    setDraftEdits(prev => ({ ...prev, [id]: currentDraftText }));
    setIsEditingDraft(false);
    triggerToast('Draft custom changes saved successfully.', 'success');
  };

  // HANDLERS FOR PAIN POINT #2 (Calendar Orchestration)
  const [isCalendarOptimizing, setIsCalendarOptimizing] = useState(false);
  const [calendarOptimized, setCalendarOptimized] = useState(false);

  const handleOptimizeSchedule = () => {
    setIsCalendarOptimizing(true);
    triggerToast('Running Operational Pathfinding algorithm...', 'info');

    setTimeout(() => {
      // 1. Resolve meeting conflict
      setCalendarEvents(prev => prev.map(evt => {
        if (evt.id === 'cal-4') { // Tesla MSA Sync
          return {
            ...evt,
            time: '04:00 PM - 04:30 PM',
            isConflicting: false,
            rescheduledByAI: true
          };
        }
        if (evt.id === 'cal-5') { // Onboarding review
          return {
            ...evt,
            time: '02:00 PM - 02:30 PM' // shifted slightly to clean up block
          };
        }
        return evt;
      }));

      // 2. Complete/Re-sequence tasks
      setTasks(prev => prev.map(t => {
        if (t.id === 'task-2') { // Tesla MSA task
          return { ...t, stage: 'in_progress' as const, priorityScore: 95 };
        }
        return t;
      }));

      // 3. Record active logs
      addActivityLog('schedule', 'AI Scheduler Resolved Overlap', 'Moved Veloce/Tesla sourcing meeting to 4:00 PM, avoiding a conflict with Lab Onboarding Review.', 'veloce');
      addActivityLog('schedule', 'AI Scheduler Resolved Overlap', 'Moved Veloce/Tesla sourcing meeting to 4:00 PM, avoiding a conflict with Lab Onboarding Review.', 'veloce');
      incrementAutomatedTasks(2);

      setIsCalendarOptimizing(false);
      setCalendarOptimized(true);
      triggerToast('Schedule sequence and operational load fully optimized.', 'success');
    }, 2000);
  };

  // HANDLERS FOR PAIN POINT #3 (Deals & Operations)
  const [isDealLoading, setIsDealLoading] = useState<string | null>(null);

  const handleTriggerAIPush = (dealId: string) => {
    setIsDealLoading(dealId);
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    triggerToast(`AI Autopilot initiating sequence for ${deal.companyName}...`, 'info');

    setTimeout(() => {
      setDeals(prev => prev.map(d => {
        if (d.id === dealId) {
          // Progress deal stage
          let nextStage = d.stage;
          let progress = d.progress;
          let risk = d.momentumRisk;
          let recommendation = d.aiRecommendation;

          if (d.stage === 'Negotiation') {
            nextStage = 'Procurement';
            progress = 75;
            risk = 'low' as const;
            recommendation = 'Awaiting Tesla compliance verification. System is monitoring the folder uploads.';
          } else if (d.stage === 'Legal Review') {
            nextStage = 'Contract Sent';
            progress = 90;
            risk = 'low' as const;
            recommendation = 'Draft contract sent with compliance seals. Automatic reminder active.';
          } else if (d.stage === 'Procurement') {
            nextStage = 'Legal Review';
            progress = 85;
            risk = 'low' as const;
            recommendation = 'Procurement hurdles cleared automatically. Transferred to internal legal pipeline.';
          } else if (d.stage === 'Contract Sent') {
            nextStage = 'Completed';
            progress = 100;
            risk = 'low' as const;
            recommendation = 'Completed & archived. Automated handover instructions initiated.';
          }

          return {
            ...d,
            stage: nextStage,
            progress,
            momentumRisk: risk,
            recentActivity: 'AI pushed deal stage with custom automated attachments and stakeholder touchpoints.',
            aiRecommendation: recommendation
          };
        }
        return d;
      }));

      addActivityLog('deal', 'Autopilot pushed deal', `Autonomous task execution advanced ${deal.companyName} stage. Sent compliance documents.`, deal.companyId);
      incrementAutomatedTasks(1);
      setIsDealLoading(null);
      triggerToast(`${deal.companyName} successfully advanced. Hand-offs automated.`, 'success');
    }, 1500);
  };

  // HANDLERS FOR AI CHAT ASSISTANT
  const handleQuickCommand = (command: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: command, timestamp: 'Just now' }]);
    setIsAiResponding(true);

    setTimeout(() => {
      let aiText = '';

      if (command.toLowerCase().includes('attention')) {
        aiText = `You have 3 core operational bottlenecks needing attention:
1. **Sarah Jenkins B-Round Alignment** (Aether): Missing updated compute spreadsheets (High priority follow-up ready).
2. **Marcus Vance MSA Redlines** (Veloce): Section 4.2 indemnity clause delay (Overlapping calendar conflict detected).
3. **Pfizer Bio-Synthesis Review** (Heirloom): Legal review stalled on Pfizer's end for 5 business days.

I have compiled recommended automations for all three. You can approve follow-ups directly in the Relationship Intelligence panel.`;
      } else if (command.toLowerCase().includes('follow-up')) {
        // Auto approve all pending follow-ups
        const pendingCount = followUps.filter(f => f.status === 'pending_approval').length;
        if (pendingCount > 0) {
          setFollowUps(prev => prev.map(f => ({ ...f, status: 'approved' as const })));
          incrementAutomatedTasks(pendingCount);
          setMetrics(prev => prev.map(m => {
            if (m.label === 'Waiting on External Response') {
              return { ...m, value: '0' };
            }
            return m;
          }));
          aiText = `Understood. Dispatched all ${pendingCount} pending follow-up drafts for Sarah Jenkins, Marcus Vance, Evelyn Foster, James Corden, and Elena Rostova. Syncing all conversations back to Hubspot and updating contact histories.`;
          addActivityLog('draft', 'Mass draft dispatch approved', `Sovereign AI successfully dispatched all outstanding follow-ups.`, 'all');
          triggerToast(`Autonomous AI: Dispatched ${pendingCount} emails.`, 'success');
        } else {
          aiText = `There are no pending follow-up drafts waiting for approval. Everything is up to date and relationship streams are active.`;
        }
      } else if (command.toLowerCase().includes('blocked') || command.toLowerCase().includes('deals')) {
        aiText = `I have isolated 2 deals at critical risk:
- **Lockheed Autonomous Bid ($4.2M)**: Awaiting safety compliance documentation. I recommend letting me auto-bundle your ISO-26262 audit sheets.
- **Tesla Logistics Fleet ($12M)**: Currently stalled due to a calendar scheduling conflict.

I recommend running the Calendar Optimizer to clear the Tesla conflict, and clicking "Trigger AI Push" on the Lockheed card to auto-submit compliance packages.`;
      } else if (command.toLowerCase().includes('reschedule') || command.toLowerCase().includes('tomorrow')) {
        handleOptimizeSchedule();
        aiText = `Synchronized. I run-tested calendar combinations for tomorrow and moved the Tesla MSA review with Marcus Vance to 4:00 PM. This resolved the conflict, kept your Heirloom Onboarding review, and preserved a clean 2-hour strategic focus window.`;
      } else {
        aiText = `Operational query received. I have updated Sovereign's state across your 3 operational pipelines. Let me know if I should dispatch follow-ups, reschedule conflicting events, or run compliance attachments.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText, timestamp: 'Just now' }]);
      setIsAiResponding(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    handleQuickCommand(userMsg);
  };

  // Helper to filter items based on selected company
  const filterByCompany = <T extends { companyId?: string }>(items: T[]): T[] => {
    if (selectedCompanyId === 'all') return items;
    return items.filter(item => item.companyId === selectedCompanyId);
  };

  return (
    <div className="min-h-screen bg-[#040406] bg-grid text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* GLOWING AMBIENT BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-cyan-950/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* FIXED TOAST SYSTEM */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="glass-panel p-4 rounded-xl flex items-start gap-3 shadow-2xl pointer-events-auto border-l-2 border-l-purple-500 max-w-md"
            >
              <div className="p-1 rounded bg-purple-500/20 text-purple-400 mt-0.5">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-0.5">Autonomous Operations</div>
                <p className="text-sm text-zinc-200 font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#040406]/70 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10">
              <Layers size={18} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#040406] rounded-full animate-ping" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#040406] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">SOVEREIGN</span>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">v2.4 Autopilot</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Autonomous Intelligence Layer for Multi-Company Operations</p>
          </div>
        </div>

        {/* Multi-Company Pill Filter */}
        <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5 self-start md:self-auto">
          <button
            onClick={() => setSelectedCompanyId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              selectedCompanyId === 'all'
                ? 'bg-zinc-800 text-white shadow-lg shadow-black/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            All Enterprises
          </button>
          {COMPANIES.map((company) => (
            <button
              key={company.id}
              onClick={() => setSelectedCompanyId(company.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${
                selectedCompanyId === company.id
                  ? 'bg-zinc-800 text-white shadow-lg shadow-black/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: company.logoColor }} />
              {company.name}
            </button>
          ))}
        </div>

        {/* Global Autopilot Indicators */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-green-500/5 border border-green-500/15 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-400 font-mono tracking-tight">Active Agents: Synchronized</span>
          </div>
          <button 
            onClick={() => {
              addActivityLog('alert', 'System sync completed', 'Sovereign platform manually synchronized databases with Crunchbase, Gmail, and Salesforce.', 'all');
              triggerToast('Platform-wide databases synchronized successfully.', 'info');
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
            title="Force Sync Now"
          >
            <RefreshCw size={15} className="text-zinc-400 hover:text-white" />
          </button>
        </div>
      </header>

      {/* SECONDARY NAVIGATION TABS */}
      <nav className="px-6 py-2 border-b border-white/5 bg-[#040406]/30 flex gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('command')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 border duration-300 ${
            activeTab === 'command'
              ? 'bg-gradient-to-r from-purple-950/50 to-indigo-950/50 text-purple-200 border-purple-500/20'
              : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Compass size={16} />
          Executive Command Center
        </button>
        <button
          onClick={() => setActiveTab('relationships')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 border duration-300 ${
            activeTab === 'relationships'
              ? 'bg-gradient-to-r from-purple-950/50 to-indigo-950/50 text-purple-200 border-purple-500/20'
              : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Mail size={16} />
          Relationship Intelligence
          {followUps.filter(f => f.status === 'pending_approval').length > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] flex items-center justify-center font-bold">
              {followUps.filter(f => f.status === 'pending_approval').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 border duration-300 ${
            activeTab === 'calendar'
              ? 'bg-gradient-to-r from-purple-950/50 to-indigo-950/50 text-purple-200 border-purple-500/20'
              : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Calendar size={16} />
          Calendar Orchestrator
          {!calendarOptimized && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('operations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 border duration-300 ${
            activeTab === 'operations'
              ? 'bg-gradient-to-r from-purple-950/50 to-indigo-950/50 text-purple-200 border-purple-500/20'
              : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Briefcase size={16} />
          Operations & Deals
          {deals.filter(d => d.momentumRisk === 'critical' || d.momentumRisk === 'high').length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-bold">
              RISK
            </span>
          )}
        </button>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">

        {/* TAB 1: EXECUTIVE COMMAND CENTER */}
        {activeTab === 'command' && (
          <div className="flex flex-col gap-6">
            
            {/* HERO BRIEFING CARD & REALTIME LOGS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Briefing Block */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between glow-purple">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <Sparkles size={16} className="animate-pulse" />
                      </div>
                      <span className="text-xs uppercase font-bold tracking-wider text-purple-400">Executive Strategic Briefing</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono font-medium">May 21, 2026</span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
                    Good morning, Director. Operational load is optimized across all 3 enterprises.
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Sovereign AI has automated <span className="text-purple-400 font-semibold">{metrics[0].value} tasks</span> today, reclaiming approximately <span className="text-purple-400 font-semibold">{hoursCounter} hours</span> of manual execution. There are <span className="text-amber-400 font-semibold">{followUps.filter(f => f.status === 'pending_approval').length} critical relationship follow-ups</span> and <span className="text-rose-400 font-semibold">{deals.filter(d => d.momentumRisk === 'critical').length} high-risk stalled negotiations</span> awaiting your click-approvals.
                  </p>

                  {/* Hot Actions Matrix */}
                  <div className="border-t border-white/5 pt-4 mt-4">
                    <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-3">Urgent Clears Recommended</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      
                      {/* Action 1 */}
                      {followUps.some(f => f.id === 'followup-1' && f.status === 'pending_approval') && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-white">Approve Vanguard Seed Response</div>
                              <div className="text-[10px] text-zinc-400">Valuation details drafted for Sarah Jenkins</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleApproveFollowUp('followup-1')}
                            className="px-2.5 py-1 text-[10px] font-bold bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 rounded-lg transition-all"
                          >
                            Approve
                          </button>
                        </div>
                      )}

                      {/* Action 2 */}
                      {!calendarOptimized && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-white">Optimize Calendar Conflicts</div>
                              <div className="text-[10px] text-zinc-400">Tesla MSA conflict overlapping Onboarding</div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab('calendar');
                              handleOptimizeSchedule();
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 rounded-lg transition-all animate-pulse"
                          >
                            Optimize
                          </button>
                        </div>
                      )}

                      {/* Action 3 */}
                      {deals.some(d => d.id === 'deal-1' && d.stage === 'Negotiation') && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 col-span-1 md:col-span-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-white">Push Lockheed Autonomous Bid</div>
                              <div className="text-[10px] text-zinc-400">Auto-bundle compliance check sheets and escalate stage</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleTriggerAIPush('deal-1')}
                            className="px-2.5 py-1 text-[10px] font-bold bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/30 rounded-lg transition-all"
                          >
                            Execute
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 text-xs text-zinc-500 font-semibold">
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <Sliders size={13} />
                    <span>Autopilot: 84% operations on fully automated cruise-control.</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('relationships');
                      triggerToast('Redirected to Relationship Intelligence module.', 'info');
                    }}
                    className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Open Controls</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Real-Time Operational Activity Stream */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between glow-border-purple h-[400px] lg:h-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-zinc-400 animate-pulse" />
                    <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">AI Activity Feed</span>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[280px] lg:max-h-[300px]">
                  <AnimatePresence initial={false}>
                    {filterByCompany(activityStream).map((act) => (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs border-l-2 pl-3 pb-1 border-white/10"
                      >
                        <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] mb-0.5">
                          <span>{act.timestamp}</span>
                          <span className="uppercase text-[9px] px-1 py-0.2 bg-white/5 rounded text-zinc-400">
                            {COMPANIES.find(c => c.id === act.companyId)?.ticker || 'GLOBAL'}
                          </span>
                        </div>
                        <div className="font-semibold text-zinc-200">{act.title}</div>
                        <div className="text-zinc-400 text-[11px] leading-relaxed mt-0.5">{act.detail}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 flex items-center justify-center">
                  <button
                    onClick={() => {
                      // Simulate a new autonomous action
                      const events = [
                        { type: 'crm' as const, title: 'CRM auto-populated', detail: 'Linked communication logs from Sarah Jenkins into Salesforce Aether module.', companyId: 'aether' },
                        { type: 'draft' as const, title: 'Auto-drafted client email', detail: 'Prepared response email to Airbus regarding compliance standard validation.', companyId: 'veloce' },
                        { type: 'schedule' as const, title: 'Scheduled bio-exclusivity call', detail: 'Reserved Friday 10:00 AM slot for Exclusivity Discussion with Novartis.', companyId: 'heirloom' },
                        { type: 'deal' as const, title: 'Momentum alert triggered', detail: 'Stall risk cleared. AWS grant signature process resumed.', companyId: 'aether' }
                      ];
                      const randEvent = events[Math.floor((toastIdCounter + activityIdCounter) % events.length)];
                      addActivityLog(randEvent.type, randEvent.title, randEvent.detail, randEvent.companyId);
                      triggerToast(`Simulated Event: ${randEvent.title}`, 'info');
                    }}
                    className="text-[11px] text-purple-400 font-bold hover:text-purple-300 transition-colors flex items-center gap-1.5 py-1 px-3 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 rounded-lg"
                  >
                    <Plus size={12} />
                    Trigger Autonomous Simulation Event
                  </button>
                </div>
              </div>

            </div>

            {/* EXECUTIVE METRIC CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((card) => {
                const IconComponent = 
                  card.iconName === 'Cpu' ? Cpu :
                  card.iconName === 'Zap' ? Zap :
                  card.iconName === 'ShieldCheck' ? ShieldCheck :
                  Hourglass;
                
                return (
                  <div
                    key={card.label}
                    className="glass-panel p-5 rounded-2xl hover:border-white/15 transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{card.label}</span>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-300 group-hover:text-purple-400 group-hover:border-purple-500/20 transition-all">
                        <IconComponent size={16} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                        {card.label === 'Founder Hours Saved' ? `${hoursCounter}h` : card.value}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        card.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {card.change}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-semibold mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* DUAL CARD ROW: PORTFOLIO WATCHLIST & AI INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Active Portfolio Pipeline Overview */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Enterprise Operations Pipeline</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">High-momentum deals currently operating on AI cruise-control</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('operations');
                      triggerToast('Loaded Operations Pipeline.', 'info');
                    }}
                    className="text-xs text-purple-400 font-bold hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View Kanban Board</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="space-y-4">
                  {filterByCompany(deals).slice(0, 3).map((deal) => {
                    const company = COMPANIES.find(c => c.id === deal.companyId);
                    return (
                      <div
                        key={deal.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-xs shadow-md mt-0.5"
                            style={{ backgroundColor: company?.accentColor || 'rgba(255,255,255,0.05)', color: company?.logoColor || '#fff' }}
                          >
                            {company?.ticker || 'G'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{deal.companyName}</span>
                              <span className="text-[10px] text-zinc-400 font-mono font-medium">{deal.dealSize}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                              {deal.recentActivity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-between md:justify-end">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Stage</span>
                            <span className="text-xs font-semibold text-zinc-300">{deal.stage}</span>
                          </div>

                          <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000"
                              style={{ width: `${deal.progress}%` }}
                            />
                          </div>

                          <button
                            onClick={() => handleTriggerAIPush(deal.id)}
                            disabled={isDealLoading === deal.id}
                            className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/10 transition-all flex items-center justify-center"
                            title="Auto-push deal momentum"
                          >
                            {isDealLoading === deal.id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <Play size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Autopilot Accomplishments */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between glow-green">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <h3 className="text-xs uppercase font-bold text-green-400 tracking-wider">CoS Autopilot: Completed Automatically</h3>
                    </div>
                    <span className="text-[10px] bg-green-500/10 text-green-400 font-mono font-bold px-2 py-0.5 rounded border border-green-500/20">NO FOUNDER TOUCH NEEDED</span>
                  </div>

                  <div className="space-y-4 overflow-y-auto max-h-[320px] pr-1">
                    {filterByCompany(COMPLETED_AUTOPILOT_ACTIONS).map((act) => {
                      const company = COMPANIES.find(c => c.id === act.companyId);
                      return (
                        <div
                          key={act.id}
                          className="p-3 rounded-xl bg-green-500/[0.02] border border-green-500/10 flex flex-col gap-1.5 text-xs text-zinc-300 relative overflow-hidden group hover:border-green-500/20 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-white group-hover:text-green-400 transition-colors flex items-center gap-1">
                              ✓ {act.action}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500 font-semibold">{act.time}</span>
                          </div>
                          <p className="text-zinc-400 text-[11px] leading-relaxed font-semibold">
                            {act.detail}
                          </p>
                          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono border-t border-white/5 pt-1.5 mt-0.5">
                            <span className="uppercase font-bold">ENTERPRISE: {company?.name || 'GLOBAL'}</span>
                            <span className="text-green-500 font-bold uppercase tracking-tight">Synced to CRM</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-6">
                  <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
                    <span>Autopilot system coverage:</span>
                    <span className="text-green-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                      100% ONLINE
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: RELATIONSHIP INTELLIGENCE */}
        {activeTab === 'relationships' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
            
            {/* Explainer Banner */}
            <div className="lg:col-span-3 glass-panel p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-2 border-l-purple-500 bg-purple-950/5">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                  <Mail size={16} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Follow-Ups Falling Through The Cracks</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-semibold mt-1">
                    You&apos;re managing relationships across three companies and moving fast. Critical follow-ups with clients, partners, employees, and vendors get delayed or forgotten because you&apos;re context-switching between businesses. The CoS owns this loop entirely — tracking conversations, waiting the right amount of time, sending messages in your voice, and surfacing replies.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contacts list (Inbox style) */}
            <div className="lg:col-span-1 glass-panel rounded-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#040406]/30">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search relationship dossier..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/30 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Thread list */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 max-h-[550px]">
                {filterByCompany(followUps).map((fUp) => {
                  const company = COMPANIES.find(c => c.id === fUp.companyId);
                  const isSelected = fUp.id === selectedFollowUpId;

                  return (
                    <button
                      key={fUp.id}
                      onClick={() => setSelectedFollowUpId(fUp.id)}
                      className={`w-full text-left p-4 transition-all duration-200 flex flex-col gap-2 relative ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-950/20 to-indigo-950/20 bg-[#0c0c14]/40 border-r-2 border-r-purple-500'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{fUp.contactName}</span>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono"
                            style={{ backgroundColor: company?.accentColor || 'rgba(255,255,255,0.05)', color: company?.logoColor || '#fff' }}
                          >
                            {company?.ticker}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono font-medium">{fUp.lastActivityDate}</span>
                      </div>

                      <div className="text-xs font-semibold text-zinc-300 truncate">{fUp.subject}</div>
                      <p className="text-[11px] text-zinc-500 font-semibold line-clamp-2 leading-relaxed">
                        {fUp.summary}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1.5">
                          {fUp.channel === 'email' && <Mail size={12} className="text-purple-400" />}
                          {fUp.channel === 'linkedin' && <LinkedinIcon className="w-3 h-3 text-blue-400" />}
                          {fUp.channel === 'slack' && <SlackIcon className="w-3 h-3 text-cyan-400" />}
                          <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-tight">Via {fUp.channel}</span>
                        </div>

                        {fUp.status === 'approved' ? (
                          <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">dispatched</span>
                        ) : fUp.status === 'snoozed' ? (
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">snoozed</span>
                        ) : fUp.status === 'delegated' ? (
                          <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">delegated</span>
                        ) : (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                            fUp.urgency === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {fUp.urgency} priority
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle & Right: Selected dossier workspace */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {(() => {
                const fUp = followUps.find(f => f.id === selectedFollowUpId);
                if (!fUp) return <div className="glass-panel p-10 rounded-2xl text-center text-zinc-500 font-semibold flex items-center justify-center h-full">Select a contact to load dossier workspace</div>;
                const company = COMPANIES.find(c => c.id === fUp.companyId);

                return (
                  <div className="glass-panel rounded-2xl flex flex-col overflow-hidden flex-1 justify-between">
                    
                    {/* Dossier Header */}
                    <div className="p-6 border-b border-white/5 bg-[#040406]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold font-mono text-purple-400 shadow-md">
                          {fUp.contactName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{fUp.contactName}</h3>
                            <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-semibold font-mono">
                              {company?.name}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-semibold mt-0.5">{fUp.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 font-semibold">Uptouch Stall:</span>
                        <span className="text-xs font-bold text-rose-400 font-mono bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded">
                          {fUp.daysElapsed} days unanswered
                        </span>
                      </div>
                    </div>

                    {/* Operational Summary Block */}
                    <div className="p-6 border-b border-white/5 space-y-3 bg-[#0a0a10]/20">
                      <div className="flex items-center gap-1.5 text-xs text-purple-400">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="uppercase font-bold tracking-wider">AI Summary & Context</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-semibold bg-white/5 p-3 rounded-xl border border-white/5">
                        {fUp.summary}
                      </p>
                    </div>

                    {/* Interactive Automated Reply Draft Workspace */}
                    <div className="p-6 flex-1 flex flex-col gap-3 justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <Cpu size={14} className="text-purple-400" />
                          <span className="font-semibold">Automated Communications Draft</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {fUp.status === 'pending_approval' && (
                            <button
                              onClick={() => setIsEditingDraft(!isEditingDraft)}
                              className="text-xs text-zinc-400 hover:text-white font-semibold flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded border border-white/5 transition-all"
                            >
                              {isEditingDraft ? 'Cancel Edit' : 'Edit Draft'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="relative flex-1 min-h-[180px] flex flex-col">
                        {isEditingDraft ? (
                          <textarea
                            value={currentDraftText}
                            onChange={(e) => setDraftEdits(prev => ({ ...prev, [fUp.id]: e.target.value }))}
                            className="w-full flex-1 bg-zinc-950 border border-purple-500/30 rounded-xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none leading-relaxed"
                          />
                        ) : (
                          <div className="w-full flex-1 bg-zinc-950/60 border border-white/5 rounded-xl p-4 text-xs font-mono text-zinc-300 leading-relaxed overflow-y-auto whitespace-pre-wrap max-h-[220px]">
                            {currentDraftText}
                          </div>
                        )}
                        
                        {isEditingDraft && (
                          <button
                            onClick={() => handleSaveDraftEdit(fUp.id)}
                            className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Save Changes
                          </button>
                        )}
                      </div>

                      {/* Action Matrix */}
                      <div className="border-t border-white/5 pt-4 mt-3 flex flex-wrap gap-2 items-center justify-between">
                        <div className="text-[11px] text-zinc-500 font-semibold font-mono">
                          Channel: {fUp.channel.toUpperCase()}
                        </div>

                        <div className="flex gap-2">
                          {fUp.status === 'pending_approval' ? (
                            <>
                              <button
                                onClick={() => handleSnoozeFollowUp(fUp.id)}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all"
                              >
                                Snooze 24h
                              </button>
                              <button
                                onClick={() => handleDelegateFollowUp(fUp.id)}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all"
                              >
                                Delegate to EA
                              </button>
                              <button
                                onClick={() => handleApproveFollowUp(fUp.id)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-900/20 flex items-center gap-1.5 transition-all"
                              >
                                <Send size={12} />
                                Approve & Dispatch Now
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/15 px-4 py-2 rounded-xl">
                              <CheckCircle2 size={14} className="text-green-500" />
                              <span className="text-xs font-bold text-green-400 uppercase font-mono">Action Complete: {fUp.status}</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>

          </div>
        )}

        {/* TAB 3: CALENDAR ORCHESTRATOR */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Explainer Banner */}
            <div className="lg:col-span-3 glass-panel p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-2 border-l-amber-500 bg-amber-950/5">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                  <Calendar size={16} className="text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Calendar And Task Coordination Overhead</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-semibold mt-1">
                    You&apos;re manually blocking time, setting reminders, and coordinating when things get done and what gets sent next. That&apos;s administrative work that eats into focus time. The CoS handles the sequencing — blocking calendars, queuing follow-up actions, and executing the next step once a prior task completes.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Draggable Schedule Timeline */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-zinc-400" />
                      <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Dynamic Calendar Orchestration</h3>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">Sovereign real-time scheduler resolves meeting conflicts autonomously</p>
                  </div>

                  {!calendarOptimized ? (
                    <button
                      onClick={handleOptimizeSchedule}
                      disabled={isCalendarOptimizing}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-amber-900/20 flex items-center gap-1.5 transition-all animate-pulse"
                    >
                      {isCalendarOptimizing ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          Resolving Conflicts...
                        </>
                      ) : (
                        <>
                          <Sliders size={13} />
                          Resolve Conflict Automatically
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/15 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-green-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-400 uppercase font-mono tracking-wider">Load Fully Optimized</span>
                    </div>
                  )}
                </div>

                {/* Calendar Schedule block list */}
                <div className="space-y-3 relative">
                  
                  {/* Timeline lines block */}
                  <div className="absolute left-[70px] top-0 bottom-0 w-[1px] bg-white/5 pointer-events-none" />

                  {filterByCompany(calendarEvents).map((evt) => {
                    const company = COMPANIES.find(c => c.id === evt.companyId);
                    
                    return (
                      <div key={evt.id} className="flex gap-4 items-start group">
                        
                        {/* Time labels column */}
                        <div className="w-[60px] text-right shrink-0 mt-3">
                          <span className="text-[10px] font-mono text-zinc-500 font-bold block">{evt.time.split(' - ')[0]}</span>
                          <span className="text-[9px] font-mono text-zinc-600 font-semibold">{evt.duration}</span>
                        </div>

                        {/* Interactive Meeting Block */}
                        <div
                          className={`flex-1 p-4 rounded-xl border relative transition-all duration-500 ${
                            evt.isConflicting
                              ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/35 glow-border-rose shadow-[0_0_15px_rgba(239,68,68,0.05)]'
                              : evt.rescheduledByAI
                              ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5"
                                style={{ backgroundColor: company?.logoColor || '#fff' }}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">{evt.title}</span>
                                  {evt.isConflicting && (
                                    <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                                      <AlertTriangle size={8} /> Conflict detected
                                    </span>
                                  )}
                                  {evt.rescheduledByAI && (
                                    <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider font-mono flex items-center gap-0.5">
                                      <Sparkles size={8} /> Auto rescheduled
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-zinc-400 font-semibold mt-1">
                                  Attendees: {evt.attendees.join(', ')}
                                </div>
                              </div>
                            </div>

                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono border self-start md:self-auto uppercase tracking-wide"
                              style={{
                                backgroundColor: company?.accentColor || 'rgba(255,255,255,0.02)',
                                color: company?.logoColor || '#fff',
                                borderColor: 'rgba(255, 255, 255, 0.05)'
                              }}
                            >
                              {company?.ticker || 'GLOBAL'}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 font-semibold gap-2">
                <span className="flex items-center gap-1 text-purple-400">
                  <Sliders size={13} />
                  <span>AI continuously maps optimal focus blocks against deal-risk timelines.</span>
                </span>
                <span>Active calendar hooks: GCalendar, Outlook Sync</span>
              </div>
            </div>

            {/* Task Sequencer Queue & Priority Scores */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={16} className="text-purple-400 animate-pulse" />
                  <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Autonomous Task Sequencing</h3>
                </div>

                <div className="space-y-3">
                  {filterByCompany(tasks).map((task) => {
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border transition-all ${
                          task.stage === 'completed'
                            ? 'bg-zinc-950/30 border-zinc-900/40 text-zinc-500'
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => {
                                setTasks(prev => prev.map(t => {
                                  if (t.id === task.id) {
                                    const nextStage = t.stage === 'completed' ? 'pending' : 'completed';
                                    if (nextStage === 'completed') {
                                      triggerToast(`Completed task: ${t.title}`, 'success');
                                      incrementAutomatedTasks(1);
                                    }
                                    return { ...t, stage: nextStage };
                                  }
                                  return t;
                                }));
                              }}
                              className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-all ${
                                task.stage === 'completed'
                                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                                  : 'border-white/20 hover:border-purple-500/40'
                              }`}
                            >
                              {task.stage === 'completed' && <Check size={10} />}
                            </button>
                            <div>
                              <span className={`text-xs font-semibold ${task.stage === 'completed' ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                                {task.title}
                              </span>
                              
                              {task.dependencies.length > 0 && (
                                <div className="text-[9px] text-amber-400 font-semibold font-mono mt-1 flex items-center gap-1 uppercase tracking-tight">
                                  <Clock size={10} /> Needs: {task.dependencies.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono text-purple-400 font-bold block">{task.priorityScore}%</span>
                            <span className="text-[9px] text-zinc-500 font-semibold uppercase">{task.timeEstimate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6">
                <button
                  onClick={() => {
                    // Trigger custom resequence animation
                    setTasks(prev => [...prev].sort((a, b) => b.priorityScore - a.priorityScore));
                    triggerToast('Tasks sequence re-sorted by dynamic urgency scores.', 'success');
                    addActivityLog('schedule', 'Task sequence re-ordered', 'Auto-shuffled prioritization queues using fresh corporate data feed indicators.', 'all');
                  }}
                  className="w-full text-center py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <Sliders size={13} />
                  Sequence & Prioritize (Dynamic urgencies)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: OPERATIONS & DEALS */}
        {activeTab === 'operations' && (
          <div className="flex flex-col gap-6">
            
            {/* Explainer Banner */}
            <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-2 border-l-blue-500 bg-blue-950/5">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                  <Briefcase size={16} className="text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Deal And Vendor Workflows Stalling</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-semibold mt-1">
                    Multi-step processes (procurement, negotiations, onboarding) require constant back-and-forth coordination. Pipedrive has minimal data because you&apos;re the bottleneck in these workflows. The CoS automates the handoffs and keeps deals moving through the pipeline without requiring your intervention at every step.
                  </p>
                </div>
              </div>
              <div className="shrink-0 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg text-right hidden md:block font-mono">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Pipeline Volume</span>
                <span className="text-sm font-extrabold text-blue-400">$33.8M</span>
              </div>
            </div>

            {/* Pipeline Stage Columns Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              
              {/* Stages list */}
              {(['New Inquiry', 'Qualification', 'Negotiation', 'Procurement', 'Waiting for Response', 'Legal Review', 'Contract Sent', 'Completed'] as const).map((stage) => {
                const stageDeals = filterByCompany(deals).filter(d => d.stage === stage);
                
                return (
                  <div key={stage} className="min-w-[280px] flex-1 flex flex-col gap-3">
                    
                    {/* Stage title */}
                    <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <span>{stage}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400">{stageDeals.length}</span>
                    </div>

                    {/* Stage deals stack */}
                    <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-2xl p-3 space-y-3 min-h-[400px]">
                      {stageDeals.map((deal) => {
                        const company = COMPANIES.find(c => c.id === deal.companyId);
                        
                        return (
                          <div
                            key={deal.id}
                            onClick={() => setSelectedDealId(deal.id === selectedDealId ? null : deal.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                              deal.momentumRisk === 'critical'
                                ? 'bg-rose-500/[0.03] border-rose-500/25 hover:border-rose-500/40'
                                : deal.momentumRisk === 'high'
                                ? 'bg-amber-500/[0.03] border-amber-500/25 hover:border-amber-500/40'
                                : 'bg-[#0a0a0f]/80 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              {company && (
                                <span
                                  className="text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase tracking-wide border border-white/5"
                                  style={{ backgroundColor: company.accentColor, color: company.logoColor }}
                                >
                                  {company.ticker}
                                </span>
                              )}
                              
                              <span className="text-[10px] font-bold text-zinc-400 font-mono">{deal.dealSize}</span>
                            </div>

                            <div className="font-bold text-white text-xs mt-2 group-hover:text-purple-400 transition-colors">
                              {deal.companyName}
                            </div>

                            <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed font-semibold">
                              {deal.recentActivity}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold block">Risk Profile:</span>
                              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded font-extrabold ${
                                deal.momentumRisk === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' :
                                deal.momentumRisk === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                'bg-green-500/10 text-green-400 border border-green-500/20'
                              }`}>
                                {deal.momentumRisk}
                              </span>
                            </div>

                            {/* Detailed view block inside card (accordion style) */}
                            {selectedDealId === deal.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-3 border-t border-white/5 space-y-2.5 text-[11px] text-zinc-300"
                              >
                                <div>
                                  <span className="text-purple-400 font-bold block mb-1">AI Recommendation:</span>
                                  <span className="leading-relaxed font-semibold block bg-purple-500/5 p-2 rounded border border-purple-500/10">
                                    {deal.aiRecommendation}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-zinc-500 font-mono">Close: {deal.projectedClose}</span>
                                  {deal.stage !== 'Completed' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTriggerAIPush(deal.id);
                                      }}
                                      disabled={isDealLoading === deal.id}
                                      className="px-2.5 py-1 bg-purple-500 text-white rounded-lg text-[9px] font-bold flex items-center gap-1 hover:bg-purple-400 transition-all shadow-md"
                                    >
                                      {isDealLoading === deal.id ? (
                                        <RefreshCw size={10} className="animate-spin" />
                                      ) : (
                                        <>
                                          <Play size={10} />
                                          Autopilot Push
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            )}

                            {/* Simple visual indicator to expand */}
                            {selectedDealId !== deal.id && (
                              <div className="text-[9px] text-zinc-500 text-center mt-2 group-hover:text-purple-400 transition-colors font-semibold">
                                Click card to reveal AI recommendation & actions
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        )}

      </main>

      {/* FLOATING AI CHIEF OF STAFF PANEL */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Expanded Panel */}
        <AnimatePresence>
          {isAssistantExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="w-[380px] h-[500px] glass-panel-heavy rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden mb-4 border border-purple-500/20"
            >
              {/* Header */}
              <div className="p-4 bg-purple-950/20 border-b border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-950/50 animate-pulse">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Chief of Staff</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold leading-none">Core Cognitive Agent Active</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssistantExpanded(false)}
                  className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat Message Workspace */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[300px]">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/10'
                        : 'bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none font-semibold'
                    }`}>
                      {msg.text.split('\n').map((line, i) => (
                        <span key={i} className="block mb-1 last:mb-0">
                          {line}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] text-zinc-500 font-medium font-mono mt-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isAiResponding && (
                  <div className="flex gap-1.5 items-center p-3 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 text-xs w-[120px] mr-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-200" />
                    <span className="font-mono text-[10px] uppercase font-bold animate-pulse">Running...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Command Grid */}
              <div className="p-4 bg-zinc-950/40 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Suggested Autopilot Actions:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickCommand('What needs my attention today?')}
                    className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-zinc-300 hover:text-white transition-all font-semibold truncate"
                  >
                    💡 Attention bottlenecks
                  </button>
                  <button
                    onClick={() => handleQuickCommand('Handle the vendor follow-ups.')}
                    className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-zinc-300 hover:text-white transition-all font-semibold truncate"
                  >
                    ✉️ Approve vendor drafts
                  </button>
                  <button
                    onClick={() => handleQuickCommand('Summarize blocked deals.')}
                    className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-zinc-300 hover:text-white transition-all font-semibold truncate"
                  >
                    💼 Summarize blocked deals
                  </button>
                  <button
                    onClick={() => handleQuickCommand('Reschedule tomorrow.')}
                    className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-zinc-300 hover:text-white transition-all font-semibold truncate"
                  >
                    📅 Resolve calendar conflict
                  </button>
                </div>

                {/* Text input prompt */}
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-white/5 mt-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Chief of Staff..."
                    className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/20 font-semibold"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-all flex items-center justify-center shadow-lg shadow-purple-900/20"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Button Trigger */}
        <button
          onClick={() => setIsAssistantExpanded(!isAssistantExpanded)}
          className="bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-500 hover:to-indigo-500 text-white w-12 h-12 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-white/10 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          title="Open AI Chief of Staff"
        >
          <Sparkles size={20} className="animate-pulse" />
        </button>

      </div>

      {/* FOOTER METRICS & CREDITS */}
      <footer className="mt-auto border-t border-white/5 py-6 px-6 bg-[#040406]/50 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 font-semibold gap-4">
        <div className="flex items-center gap-2">
          <span>Sovereign Executive Layer</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-zinc-400 font-mono text-[10px]">Active</span>
        </div>
        <div>
          Autonomous Intelligence Operations for High-Output Founders & Operators
        </div>
        <div className="flex items-center gap-1 text-purple-400">
          <Layers size={12} />
          <span>Multi-Company Sync Active</span>
        </div>
      </footer>

    </div>
  );
}
