export interface Company {
  id: string;
  name: string;
  ticker: string;
  logoColor: string;
  accentColor: string;
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: string;
  description: string;
}

export interface RelationshipFollowUp {
  id: string;
  contactName: string;
  role: string;
  companyId: string; // references Company.id
  subject: string;
  summary: string;
  urgency: 'high' | 'medium' | 'low';
  channel: 'email' | 'linkedin' | 'slack';
  daysElapsed: number;
  draftText: string;
  status: 'pending_approval' | 'approved' | 'snoozed' | 'delegated';
  lastActivityDate: string;
  history: { date: string; event: string; channel: string }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  companyId: string;
  category: 'focus' | 'meeting' | 'strategic' | 'onboarding';
  isConflicting?: boolean;
  originalTime?: string;
  rescheduledByAI?: boolean;
  attendees: string[];
}

export interface OrchestrationTask {
  id: string;
  title: string;
  priorityScore: number;
  dependencies: string[];
  companyId: string;
  stage: 'pending' | 'in_progress' | 'completed';
  timeEstimate: string;
}

export interface DealWorkflow {
  id: string;
  companyName: string;
  dealSize: string;
  stage: 'New Inquiry' | 'Qualification' | 'Negotiation' | 'Procurement' | 'Waiting for Response' | 'Legal Review' | 'Contract Sent' | 'Completed';
  momentumRisk: 'low' | 'medium' | 'high' | 'critical';
  projectedClose: string;
  companyId: string;
  progress: number; // percentage
  stakeholders: string[];
  recentActivity: string;
  aiRecommendation: string;
}

export interface ActivityStreamEvent {
  id: string;
  timestamp: string;
  type: 'draft' | 'schedule' | 'deal' | 'crm' | 'alert';
  title: string;
  detail: string;
  companyId?: string;
}

export const COMPANIES: Company[] = [
  { id: 'aether', name: 'Aether Technologies', ticker: 'AE', logoColor: '#a78bfa', accentColor: 'rgba(139, 92, 246, 0.2)' },
  { id: 'veloce', name: 'Veloce Mobility', ticker: 'VM', logoColor: '#60a5fa', accentColor: 'rgba(59, 130, 246, 0.2)' },
  { id: 'heirloom', name: 'Heirloom Bio', ticker: 'HB', logoColor: '#34d399', accentColor: 'rgba(52, 211, 153, 0.2)' },
];

export const INITIAL_METRICS: MetricCard[] = [
  {
    label: 'Tasks Automated Today',
    value: '24',
    change: '+18%',
    isPositive: true,
    iconName: 'Cpu',
    description: 'Email drafts, CRM syncing, and contract tracking'
  },
  {
    label: 'Founder Hours Saved',
    value: '42.5h',
    change: '+5.5h today',
    isPositive: true,
    iconName: 'Zap',
    description: 'Autopilot coordination, follow-ups & scheduling'
  },
  {
    label: 'Critical Bottlenecks Saved',
    value: '4',
    change: '-2 active',
    isPositive: true,
    iconName: 'ShieldCheck',
    description: 'Deals/procurements automatically pushed past roadblocks'
  },
  {
    label: 'Waiting on External Response',
    value: '8',
    change: '3 urgent',
    isPositive: false,
    iconName: 'Hourglass',
    description: 'Vendors, investors, and clients with pending items'
  },
];

export const INITIAL_FOLLOW_UPS: RelationshipFollowUp[] = [
  {
    id: 'followup-1',
    contactName: 'Sarah Jenkins',
    role: 'Partner, Vanguard Ventures',
    companyId: 'aether',
    subject: 'Series B Valuation Alignment',
    summary: 'Sarah requested updated compute projection spreadsheets after last Thursday\'s pitch. No reply detected on either side since. Urgency score heightened due to round closing timeline.',
    urgency: 'high',
    channel: 'email',
    daysElapsed: 4,
    draftText: `Hi Sarah,

Thanks again for the great discussion last Thursday. I wanted to follow up with the updated high-performance compute projection spreadsheets we discussed. 

Our engineering team compiled our projected node allocation through Q4 2027, factoring in our upcoming edge deployment. You can find the secure model sheet attached here.

Let me know if you and the Vanguard team have 15 minutes to sync on these numbers this Thursday or Friday.

Best,
[Founder]`,
    status: 'pending_approval',
    lastActivityDate: '4 days ago',
    history: [
      { date: '4 days ago', event: 'Pitch Meeting Completed', channel: 'zoom' },
      { date: '4 days ago', event: 'Sent initial deck & model', channel: 'email' }
    ]
  },
  {
    id: 'followup-2',
    contactName: 'Marcus Vance',
    role: 'VP of Procurement, Tesla Sourcing',
    companyId: 'veloce',
    subject: 'Solid State Battery Supply MSA',
    summary: 'Negotiations regarding Section 4.2 indemnity clauses stalled on Marcus\'s side. Relationship intelligence suggests Marcus typically signs agreements within 48h of final approval, but hasn\'t replied to our redline.',
    urgency: 'high',
    channel: 'email',
    daysElapsed: 3,
    draftText: `Hi Marcus,

I wanted to circle back briefly on the outstanding MSA redlines. 

We refined Section 4.2 regarding indemnity caps to better align with the tier-1 supplier framework we spoke about. This should protect both parties while accelerating our Q3 pilot integration schedule.

Do you have 10 minutes for a quick huddle tomorrow morning, or is this ready to clear with your legal team?

Best,
[Founder]`,
    status: 'pending_approval',
    lastActivityDate: '3 days ago',
    history: [
      { date: '3 days ago', event: 'Sent legal markup of MSA', channel: 'email' },
      { date: '5 days ago', event: 'Introductory pricing agreement', channel: 'docsign' }
    ]
  },
  {
    id: 'followup-3',
    contactName: 'Dr. Evelyn Foster',
    role: 'Head of Research, Novartis Biotech',
    companyId: 'heirloom',
    subject: 'CRISPR Synthesizer Licensing Contract',
    summary: 'Biotech licensing negotiation draft sent. Follow-up is needed to secure the exclusivity window expiring next Wednesday. Evelyn was highly active on LinkedIn yesterday, indicating she is in active office days.',
    urgency: 'medium',
    channel: 'linkedin',
    daysElapsed: 5,
    draftText: `Hi Evelyn, I hope your week is off to a great start. I wanted to check if you and the Novartis compliance committee had a chance to review the CRISPR-v4 synthesizer exclusivity terms we sent over. 

We have two other research institutions inquiring about that specific geographical license block, but I wanted to make sure you get first-priority clearance since Heirloom Bio and Novartis have such strong alignment here. 

Let me know if there's any technical detail we can clarify!`,
    status: 'pending_approval',
    lastActivityDate: '5 days ago',
    history: [
      { date: '5 days ago', event: 'Licensing proposal sent', channel: 'email' },
      { date: '8 days ago', event: 'Scientific advisory call', channel: 'zoom' }
    ]
  },
  {
    id: 'followup-4',
    contactName: 'James Corden',
    role: 'Lead Infrastructure Engineer (Incoming)',
    companyId: 'aether',
    subject: 'Offer Letter & Equity Package Finalization',
    summary: 'James accepted the verbal offer but requested clarification on the reverse-vesting acceleration trigger in case of acquisition. No response sent yet.',
    urgency: 'medium',
    channel: 'slack',
    daysElapsed: 2,
    draftText: `Hey James, great to connect. To clarify the reverse-vesting acceleration: it's a standard double-trigger. 

If Aether is acquired and your role is either eliminated or materially changed within 12 months, 100% of your unvested equity accelerates immediately. 

We want to make sure you have complete security here. Let me know if that clears it up and if you're ready to sign the docusign!`,
    status: 'pending_approval',
    lastActivityDate: '2 days ago',
    history: [
      { date: '2 days ago', event: 'Verbal offer accepted', channel: 'phone' },
      { date: '2 days ago', event: 'James asked about equity triggers', channel: 'slack' }
    ]
  },
  {
    id: 'followup-5',
    contactName: 'Elena Rostova',
    role: 'Chief Procurement Officer, Airbus Defense',
    companyId: 'veloce',
    subject: 'Lidar Sensor Sourcing Bid RFQ-909',
    summary: 'Airbus launched an RFQ. Elena noted we have a minor technical compliance mismatch on battery safety standards. Auto-monitoring indicates Airbus updated their compliance criteria last night, erasing the conflict.',
    urgency: 'low',
    channel: 'email',
    daysElapsed: 1,
    draftText: `Dear Elena,

I noticed Airbus updated the battery thermal stability thresholds in RFQ-909 Section 8.4 yesterday. 

This change brings Veloce's standard cell specifications into perfect alignment with your safety metrics, removing the requirement for custom cell packaging. 

I've uploaded our updated engineering safety sheet to your RFQ portal. We look forward to the vendor selection committee's decision.

Warm regards,
[Founder]`,
    status: 'pending_approval',
    lastActivityDate: '1 day ago',
    history: [
      { date: '1 day ago', event: 'Compliance mismatch flagged', channel: 'portal' },
      { date: '3 days ago', event: 'Submitting RFQ package', channel: 'email' }
    ]
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Aether Strategy Briefing',
    time: '09:00 AM - 09:30 AM',
    duration: '30m',
    companyId: 'aether',
    category: 'strategic',
    attendees: ['Founder', 'Co-Founder Tom']
  },
  {
    id: 'cal-2',
    title: 'Sarah Jenkins (Vanguard B Round)',
    time: '10:00 AM - 10:45 AM',
    duration: '45m',
    companyId: 'aether',
    category: 'meeting',
    attendees: ['Founder', 'Sarah Jenkins', 'Vanguard Partners']
  },
  {
    id: 'cal-3',
    title: 'Strategic Focus: Bio-Synth Roadmap',
    time: '11:00 AM - 01:00 PM',
    duration: '2h',
    companyId: 'heirloom',
    category: 'focus',
    attendees: ['Founder']
  },
  {
    id: 'cal-4',
    title: 'Marcus Vance (Tesla MSA Sync)',
    time: '01:30 PM - 02:00 PM',
    duration: '30m',
    companyId: 'veloce',
    category: 'meeting',
    isConflicting: true,
    originalTime: '01:30 PM - 02:00 PM',
    attendees: ['Founder', 'Marcus Vance']
  },
  {
    id: 'cal-5',
    title: 'Heirloom Lab Onboarding Review',
    time: '02:00 PM - 02:45 PM',
    duration: '45m',
    companyId: 'heirloom',
    category: 'onboarding',
    attendees: ['Founder', 'Dr. Evelyn Foster', 'Lab Team']
  },
  {
    id: 'cal-6',
    title: 'Veloce Logistics Review & Sync',
    time: '03:30 PM - 04:30 PM',
    duration: '1h',
    companyId: 'veloce',
    category: 'meeting',
    attendees: ['Founder', 'Product VP Laura']
  }
];

export const INITIAL_ORCHESTRATION_TASKS: OrchestrationTask[] = [
  {
    id: 'task-1',
    title: 'Approve final Aether Q3 hardware budget allocations',
    priorityScore: 94,
    dependencies: ['Sarah Jenkins meeting approval'],
    companyId: 'aether',
    stage: 'in_progress',
    timeEstimate: '30m'
  },
  {
    id: 'task-2',
    title: 'Submit revised Tesla MSA Redline (Sec 4.2)',
    priorityScore: 89,
    dependencies: ['Marcus Vance alignment confirmation'],
    companyId: 'veloce',
    stage: 'pending',
    timeEstimate: '15m'
  },
  {
    id: 'task-3',
    title: 'Verify Novartis Compliance Exclusivity Window',
    priorityScore: 82,
    dependencies: ['Evelyn Foster response'],
    companyId: 'heirloom',
    stage: 'pending',
    timeEstimate: '20m'
  },
  {
    id: 'task-4',
    title: 'Approve James Corden offer letter contract adjustments',
    priorityScore: 78,
    dependencies: [],
    companyId: 'aether',
    stage: 'completed',
    timeEstimate: '10m'
  }
];

export const INITIAL_DEAL_WORKFLOWS: DealWorkflow[] = [
  {
    id: 'deal-1',
    companyName: 'Lockheed Autonomous Bid',
    dealSize: '$4.2M',
    stage: 'Negotiation',
    momentumRisk: 'high',
    projectedClose: 'June 18, 2026',
    companyId: 'veloce',
    progress: 60,
    stakeholders: ['General Vance', 'Sec Ops Team', 'VP Logistics'],
    recentActivity: 'Vendor safety checklist requested by Lockheed compliance last Monday.',
    aiRecommendation: 'Lockheed safety criteria overlaps 98% with Veloce\'s ISO-26262 audit documents. Let AI bundle and auto-submit safety packages.'
  },
  {
    id: 'deal-2',
    companyName: 'Pfizer Bio-Synthesis Licensing',
    dealSize: '$8.5M',
    stage: 'Legal Review',
    momentumRisk: 'medium',
    projectedClose: 'July 05, 2026',
    companyId: 'heirloom',
    progress: 75,
    stakeholders: ['Dr. Evelyn Foster', 'Pfizer IP Council'],
    recentActivity: 'Heirloom legal team uploaded redlines of Section 8. Pfizer legal hasn\'t responded in 5 business days.',
    aiRecommendation: 'Stall detected. Trigger stakeholder ping to Pfizer IP head or schedule a 10m alignment huddle automatically.'
  },
  {
    id: 'deal-3',
    companyName: 'AWS Compute Grant (Aether v2)',
    dealSize: '$1.2M',
    stage: 'Contract Sent',
    momentumRisk: 'low',
    projectedClose: 'May 28, 2026',
    companyId: 'aether',
    progress: 90,
    stakeholders: ['AWS Startup Program Head', 'Aether CTO'],
    recentActivity: 'Contract generated and sent to AWS Startup Program. Waiting for final digital signature.',
    aiRecommendation: 'AWS Startup Program Head opened signature package 3 hours ago. Auto-trigger signature reminder in 24 hours if unsigned.'
  },
  {
    id: 'deal-4',
    companyName: 'Tesla Logistics Fleet Integration',
    dealSize: '$12.0M',
    stage: 'Procurement',
    momentumRisk: 'critical',
    projectedClose: 'June 12, 2026',
    companyId: 'veloce',
    progress: 45,
    stakeholders: ['Marcus Vance', 'Tesla Procurement Committee'],
    recentActivity: 'Procurement questionnaire delayed. Tesla requested detailed liability caps for automated driving code.',
    aiRecommendation: 'High momentum risk. Vendor meeting scheduling conflict currently blocking negotiations. Auto-reschedule meeting.'
  },
  {
    id: 'deal-5',
    companyName: 'Roche Bio-Manufacturing Consortium',
    dealSize: '$3.8M',
    stage: 'Qualification',
    momentumRisk: 'low',
    projectedClose: 'August 15, 2026',
    companyId: 'heirloom',
    progress: 25,
    stakeholders: ['Roche Tech Committee'],
    recentActivity: 'AI qualified Roche Bio-Manufacturing consortium and auto-populated the Salesforce CRM.',
    aiRecommendation: 'Awaiting Roche technical evaluation scorecard due next Tuesday. No manual operator action required.'
  },
  {
    id: 'deal-6',
    companyName: 'Airtable Enterprise Licensing Deal',
    dealSize: '$350K',
    stage: 'Completed',
    momentumRisk: 'low',
    projectedClose: 'May 19, 2026',
    companyId: 'aether',
    progress: 100,
    stakeholders: ['Airtable Rep', 'Aether Finance'],
    recentActivity: 'Deal completed and signed by both parties. Auto-notified Slack channel #announcements.',
    aiRecommendation: 'Onboarding sequences started automatically.'
  }
];

export const INITIAL_ACTIVITY_STREAM: ActivityStreamEvent[] = [
  {
    id: 'act-1',
    timestamp: '10 mins ago',
    type: 'draft',
    title: 'AI drafted follow-up email',
    detail: 'Drafted valuation alignment follow-up to Sarah Jenkins (Vanguard Ventures).',
    companyId: 'aether'
  },
  {
    id: 'act-2',
    timestamp: '25 mins ago',
    type: 'schedule',
    title: 'Calendar Optimizations complete',
    detail: 'Detected conflict for Tesla MSA Sync. Prepared rescheduled slots for Marcus Vance.',
    companyId: 'veloce'
  },
  {
    id: 'act-3',
    timestamp: '1 hour ago',
    type: 'alert',
    title: 'Deal momentum risk detected',
    detail: 'Pfizer Bio-Synthesis Legal Review stalled (no activity for 5 days). Recommended stakeholder escalation.',
    companyId: 'heirloom'
  },
  {
    id: 'act-4',
    timestamp: '3 hours ago',
    type: 'crm',
    title: 'Salesforce updated automatically',
    detail: 'Synced negotiation progress with Airbus Defense RFQ-909.',
    companyId: 'veloce'
  },
  {
    id: 'act-5',
    timestamp: '5 hours ago',
    type: 'deal',
    title: 'Contract sent to AWS Startup Program',
    detail: 'Generated and sent $1.2M Compute Grant signature package.',
    companyId: 'aether'
  },
  {
    id: 'act-6',
    timestamp: 'Yesterday',
    type: 'draft',
    title: 'LinkedIn follow-up drafted',
    detail: 'Drafted exclusive-licensing reminder for Dr. Evelyn Foster (Novartis Biotech).',
    companyId: 'heirloom'
  }
];

export const AI_INSIGHTS = [
  {
    id: 'ins-1',
    message: 'Blocked 2 hours for strategic work tomorrow morning (09:00 AM - 11:00 AM). All conflicts cleared.',
    type: 'calendar'
  },
  {
    id: 'ins-2',
    message: 'Rescheduled Tesla MSA review with Marcus Vance to avoid conflicts. Moved onboarding review by 30 mins.',
    type: 'calendar'
  },
  {
    id: 'ins-3',
    message: 'Airbus updated compliance safety rules. Veloce cell standards are now a 100% safety match.',
    type: 'relationship'
  },
  {
    id: 'ins-4',
    message: 'Suggested follow-up with Sarah Jenkins tomorrow at 9:00 AM (Series B timeline context).',
    type: 'relationship'
  }
];

export interface AutopilotCompletedAction {
  id: string;
  companyId: string;
  action: string;
  detail: string;
  time: string;
}

export const COMPLETED_AUTOPILOT_ACTIONS: AutopilotCompletedAction[] = [
  {
    id: 'comp-1',
    companyId: 'veloce',
    action: 'Battery compliance resolved & submitted',
    detail: 'Airbus relaxed stability rules. Sovereign matched Veloce cell specs with ISO-26262 audits and autonomously uploaded files to the vendor portal.',
    time: '2 hours ago'
  },
  {
    id: 'comp-2',
    companyId: 'heirloom',
    action: 'Salesforce HubSpot notes synced',
    detail: 'Logged Novartis CRISPR-v4 meeting transcripts, generated actions, and populated pipeline fields without founder input.',
    time: '4 hours ago'
  },
  {
    id: 'comp-3',
    companyId: 'aether',
    action: 'James Corden offer draft finalized',
    detail: 'Audited double-trigger vesting clause adjustments against company handbook, prepared docusign, and sent to James.',
    time: '1 day ago'
  },
  {
    id: 'comp-4',
    companyId: 'aether',
    action: 'AWS grant document audit active',
    detail: 'Monitored AWS program head link interactions. Document open event captured at 5:14 PM. Auto-reminder scheduled for Friday.',
    time: 'Yesterday'
  }
];
