'use client';

import { useMemo, useState } from 'react';

const NAV = [
  'Overview',
  'Customers',
  'Customer 360',
  'Segments',
  'Journeys',
  'Loyalty',
  'Rewards',
  'Campaigns',
  'Store',
  'Settings'
];

const CUSTOMERS = [
  {
    id: 'C-1001',
    name: 'Laura Magi',
    email: 'laura@example.com',
    tier: 'Gold',
    clv: 'EUR 1,280',
    points: 1240,
    channel: 'SMS',
    status: 'At risk',
    segment: 'VIP with delayed order',
    issue: 'Delayed order + substitute offered',
    cases: 3,
    refunds: 1,
    substituteRate: 'High',
    journey: 'Delay recovery',
    lastOrder: '#100481',
    timeline: [
      'Order #100481 delayed due to stock',
      'SMS sent with substitute offer',
      'Customer accepted substitute via mobile',
      '250 goodwill points issued'
    ]
  },
  {
    id: 'C-1002',
    name: 'Emma Laine',
    email: 'emma@example.com',
    tier: 'Silver',
    clv: 'EUR 640',
    points: 420,
    channel: 'Email',
    status: 'Refund pending',
    segment: 'Repeat refund risk',
    issue: 'Partial refund awaiting accounting',
    cases: 2,
    refunds: 3,
    substituteRate: 'Low',
    journey: 'Refund update',
    lastOrder: '#100355',
    timeline: [
      'Return created from support email',
      'Refund pre-filled for agent approval',
      'Accounting status pending',
      'Reminder sent to customer'
    ]
  },
  {
    id: 'C-1003',
    name: 'Kadi Tamm',
    email: 'kadi@example.com',
    tier: 'Bronze',
    clv: 'EUR 190',
    points: 180,
    channel: 'SMS',
    status: 'Active',
    segment: 'Gift campaign issue',
    issue: 'Missing campaign gift on last order',
    cases: 1,
    refunds: 0,
    substituteRate: 'Medium',
    journey: 'Gift recovery',
    lastOrder: '#100433',
    timeline: [
      'Gift-qualified order placed',
      'Gift SKU unavailable',
      'Compensation message drafted',
      'Voucher added to account'
    ]
  }
];

const SEGMENTS = [
  { name: 'VIP with delayed orders', size: 42, logic: 'CLV > EUR 500 and active delayed case' },
  { name: 'Repeat refund risk', size: 18, logic: 'Refund count >= 2 in 6 months' },
  { name: 'Substitute-friendly customers', size: 71, logic: 'Accepted substitute at least once' },
  { name: 'Store-heavy loyalty members', size: 93, logic: 'Most activity comes from retail enrollment or in-store use' }
];

const JOURNEYS = [
  { name: 'Delay recovery', trigger: 'Order delayed past SLA', action: 'SMS + substitute choice + goodwill points', goal: 'Reduce complaints and preserve order' },
  { name: 'Refund update', trigger: 'Refund confirmed by agent', action: 'Email status update + loyalty reassurance', goal: 'Reduce refund anxiety' },
  { name: 'Gift recovery', trigger: 'Gift campaign item unavailable', action: 'Apology + replacement benefit', goal: 'Protect campaign experience' },
  { name: 'VIP escalation', trigger: 'High-value customer with repeated issue', action: 'Route to senior agent + premium offer', goal: 'Protect lifetime value' }
];

const CAMPAIGNS = [
  { name: '2x Points on Skincare', audience: 'Active loyalty members', channel: 'Email + on-site', status: 'Live' },
  { name: 'Delayed Order Recovery Voucher', audience: 'Delay recovery segment', channel: 'SMS', status: 'Live' },
  { name: 'Store Enrollment Bonus', audience: 'Retail signups', channel: 'Store + email', status: 'Draft' }
];

const REWARDS = [
  { name: 'EUR 5 voucher', cost: 500, type: 'Voucher' },
  { name: 'Free shipping', cost: 300, type: 'Benefit' },
  { name: 'Gift set', cost: 900, type: 'Product' },
  { name: '250 goodwill points', cost: 0, type: 'Service recovery' }
];

const STORE = [
  { location: 'Tartu', enrollments: 28, linkedProfiles: 24, missingLinks: 4 },
  { location: 'Rocca', enrollments: 19, linkedProfiles: 17, missingLinks: 2 },
  { location: 'Kristiine', enrollments: 22, linkedProfiles: 20, missingLinks: 2 }
];

function Badge({ children, tone = 'default' }) {
  const tones = {
    Gold: { bg: '#fef3c7', color: '#b45309' },
    Silver: { bg: '#e2e8f0', color: '#475569' },
    Bronze: { bg: '#ffedd5', color: '#c2410c' },
    'At risk': { bg: 'var(--danger-soft)', color: 'var(--danger)' },
    'Refund pending': { bg: 'var(--warn-soft)', color: 'var(--warn)' },
    Active: { bg: 'var(--success-soft)', color: 'var(--success)' },
    Live: { bg: 'var(--success-soft)', color: 'var(--success)' },
    Draft: { bg: 'var(--primary-soft)', color: 'var(--text)' },
    default: { bg: 'var(--primary-soft)', color: 'var(--text)' }
  };
  const style = tones[children] || tones[tone] || tones.default;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', borderRadius: 999, background: style.bg, color: style.color, fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function Card({ title, right, children }) {
  return (
    <div className="card-shell">
      <div className="card-head">
        <div className="card-title">{title}</div>
        {right}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function Kpi({ label, value, helper }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-helper">{helper}</div>
    </div>
  );
}

export default function LoyaltyCustomerStudio() {
  const [activePage, setActivePage] = useState('Overview');
  const [selectedCustomerId, setSelectedCustomerId] = useState('C-1001');
  const [query, setQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return CUSTOMERS;
    return CUSTOMERS.filter((c) => [c.id, c.name, c.email, c.segment, c.issue, c.status, c.lastOrder].join(' ').toLowerCase().includes(q));
  }, [query]);

  const selectedCustomer = filteredCustomers.find((c) => c.id === selectedCustomerId) || CUSTOMERS[0];

  function CustomerList() {
    return (
      <div className="stack-md">
        {filteredCustomers.map((c) => (
          <button key={c.id} onClick={() => { setSelectedCustomerId(c.id); setActivePage('Customer 360'); }} className={`list-button ${selectedCustomer?.id === c.id ? 'selected' : ''}`}>
            <div className="row-between-start gap-md">
              <div>
                <div className="row-wrap gap-sm">
                  <div className="font-strong">{c.name}</div>
                  <Badge>{c.tier}</Badge>
                  <Badge>{c.status}</Badge>
                </div>
                <div className="muted mt-8">{c.segment}</div>
              </div>
              <div className="muted small">{c.clv}</div>
            </div>
            <div className="mt-10">{c.issue}</div>
          </button>
        ))}
      </div>
    );
  }

  function OverviewPage() {
    return (
      <div className="stack-lg">
        <div className="grid-kpis">
          <Kpi label="Active loyalty members" value="18.4k" helper="Across online and retail" />
          <Kpi label="Service-aware segments" value="12" helper="Built from orders, refunds, and support signals" />
          <Kpi label="Operational journeys live" value="7" helper="Delay, refund, gift, VIP and more" />
          <Kpi label="Store-linked profiles" value="91%" helper="Retail enrollment matched to customer records" />
        </div>
        <div className="grid-main-split">
          <Card title="Priority customer segments">
            <div className="stack-md">
              {SEGMENTS.map((s) => (
                <div key={s.name} className="panel-soft outlined">
                  <div className="row-between gap-md">
                    <div className="font-semibold">{s.name}</div>
                    <div className="muted small">{s.size} customers</div>
                  </div>
                  <div className="muted mt-8">{s.logic}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="How this helps the team">
            <div className="stack-md">
              {[
                'Support can see loyalty status, case history, and lifetime value in one customer view.',
                'Journeys react to real events like delays, refunds, and missing gifts — not just marketing events.',
                'Store enrollment becomes part of the same customer record instead of a disconnected manual flow.',
                'Compensation and goodwill can be targeted more precisely for high-value or high-risk customers.'
              ].map((text) => (
                <div key={text} className="panel-soft">{text}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function CustomersPage() {
    return (
      <div className="grid-detail-split">
        <Card title="Customer list"><CustomerList /></Card>
        <Card title="Customer summary">
          <div className="stack-lg">
            <div className="row-wrap gap-sm"><Badge>{selectedCustomer.tier}</Badge><Badge>{selectedCustomer.status}</Badge></div>
            <div>
              <div className="hero-name">{selectedCustomer.name}</div>
              <div className="muted mt-6">{selectedCustomer.email}</div>
            </div>
            <div className="grid-mini-cards">
              {[
                ['Lifetime value', selectedCustomer.clv],
                ['Points', String(selectedCustomer.points)],
                ['Preferred channel', selectedCustomer.channel],
                ['Last order', selectedCustomer.lastOrder]
              ].map(([label, value]) => (
                <div key={label} className="panel-soft">
                  <div className="mini-label">{label}</div>
                  <div className="mini-value">{value}</div>
                </div>
              ))}
            </div>
            <div className="warn-box">
              <div className="warn-title">Current context</div>
              <div className="warn-text">{selectedCustomer.issue}</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  function Customer360Page() {
    return (
      <div className="grid-detail-split">
        <Card title={`Customer 360 · ${selectedCustomer.name}`} right={<Badge>{selectedCustomer.tier}</Badge>}>
          <div className="stack-lg">
            <div className="grid-mini-cards">
              {[
                ['Segment', selectedCustomer.segment],
                ['Case count', String(selectedCustomer.cases)],
                ['Refunds', String(selectedCustomer.refunds)],
                ['Substitute acceptance', selectedCustomer.substituteRate],
                ['Preferred channel', selectedCustomer.channel],
                ['Journey', selectedCustomer.journey]
              ].map(([label, value]) => (
                <div key={label} className="panel-soft">
                  <div className="mini-label">{label}</div>
                  <div className="mini-value">{value}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="section-label">Event timeline</div>
              <div className="stack-sm mt-12">
                {selectedCustomer.timeline.map((step) => (
                  <div key={step} className="timeline-row">{step}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card title="Next best actions">
          <div className="stack-md">
            {[
              'Issue a service recovery reward or points based on case severity.',
              'Use preferred channel when the next order issue occurs.',
              'Escalate automatically if another delay happens within 30 days.',
              'Use previous substitute acceptance pattern when offering replacement products.'
            ].map((text) => (
              <div key={text} className="panel-soft">{text}</div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function SegmentsPage() {
    return (
      <Card title="Service-aware segments">
        <div className="stack-md">
          {SEGMENTS.map((s) => (
            <div key={s.name} className="outlined panel-softless">
              <div className="row-between gap-md">
                <div className="font-strong">{s.name}</div>
                <div className="muted small">{s.size} customers</div>
              </div>
              <div className="muted mt-8">{s.logic}</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function JourneysPage() {
    return (
      <Card title="Operational journeys">
        <div className="stack-md">
          {JOURNEYS.map((j) => (
            <div key={j.name} className="outlined panel-softless">
              <div className="row-between-start gap-md">
                <div>
                  <div className="font-strong">{j.name}</div>
                  <div className="muted mt-8">Trigger: {j.trigger}</div>
                  <div className="mt-6">Action: {j.action}</div>
                </div>
                <div className="muted small">{j.goal}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function LoyaltyPage() {
    return (
      <div className="grid-detail-split">
        <Card title="Loyalty system">
          <div className="stack-md">
            {[
              'Points earned on purchases and selected service recovery events',
              'Tier visibility for support and customer operations',
              'Retail enrollment linked to the same profile as online activity',
              'Goodwill and compensation rules can be tied to value and case type'
            ].map((text) => (
              <div key={text} className="panel-soft">{text}</div>
            ))}
          </div>
        </Card>
        <Card title="Support-facing loyalty value">
          <div className="stack-md">
            {[
              'Agents can see whether the customer is worth escalating or protecting.',
              'Points and benefits can be used as compensation after service failures.',
              'Loyalty status gives context for exceptions and goodwill decisions.'
            ].map((text) => (
              <div key={text} className="panel-soft">{text}</div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function RewardsPage() {
    return (
      <Card title="Rewards and service recovery">
        <div className="grid-rewards">
          {REWARDS.map((r) => (
            <div key={r.name} className="outlined panel-softless">
              <div className="font-strong">{r.name}</div>
              <div className="muted mt-8">{r.type}</div>
              <div className="reward-value">{r.cost === 0 ? 'Dynamic' : `${r.cost} pts`}</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function CampaignsPage() {
    return (
      <Card title="Campaigns">
        <div className="stack-md">
          {CAMPAIGNS.map((c) => (
            <div key={c.name} className="outlined panel-softless">
              <div className="row-between-start gap-md">
                <div>
                  <div className="font-strong">{c.name}</div>
                  <div className="muted mt-8">Audience: {c.audience}</div>
                  <div className="mt-6">Channel: {c.channel}</div>
                </div>
                <Badge>{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function StorePage() {
    return (
      <Card title="Store enrollment and profile linking">
        <div className="stack-md">
          {STORE.map((s) => (
            <div key={s.location} className="outlined panel-softless">
              <div className="row-between gap-md">
                <div className="font-strong">{s.location}</div>
                <div className="muted small">{s.enrollments} enrollments</div>
              </div>
              <div className="muted mt-8">Linked profiles: {s.linkedProfiles} · Missing links: {s.missingLinks}</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function SettingsPage() {
    return (
      <div className="grid-detail-split">
        <Card title="Connected systems">
          <div className="stack-md">
            {[
              'Magento customer and order feed',
              'Directo refund and case context',
              'Store enrollment sync',
              'Email and SMS provider integration',
              'Support case and campaign context feed'
            ].map((text) => (
              <div key={text} className="panel-soft">{text}</div>
            ))}
          </div>
        </Card>
        <Card title="Rules and controls">
          <div className="stack-md">
            {[
              'Delay recovery points threshold',
              'VIP escalation conditions',
              'Refund risk segmentation rules',
              'Preferred channel logic based on response history'
            ].map((text) => (
              <div key={text} className="panel-soft">{text}</div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function renderPage() {
    switch (activePage) {
      case 'Overview': return <OverviewPage />;
      case 'Customers': return <CustomersPage />;
      case 'Customer 360': return <Customer360Page />;
      case 'Segments': return <SegmentsPage />;
      case 'Journeys': return <JourneysPage />;
      case 'Loyalty': return <LoyaltyPage />;
      case 'Rewards': return <RewardsPage />;
      case 'Campaigns': return <CampaignsPage />;
      case 'Store': return <StorePage />;
      case 'Settings': return <SettingsPage />;
      default: return <OverviewPage />;
    }
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">G</div>
            <div>
              <div className="brand-title">Gemer Flow</div>
              <div className="brand-subtitle">Loyalty & Customer Studio</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {NAV.map((item) => {
              const active = activePage === item;
              return (
                <button key={item} onClick={() => setActivePage(item)} className={`nav-button ${active ? 'active' : ''}`}>
                  <span>{item}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer-card">
            <div className="footer-card-title">Product story</div>
            <div className="footer-card-text">
              Loyalty, service recovery, and customer context in one system for support, marketing, and retail teams.
            </div>
            <button onClick={() => setActivePage('Overview')} className="footer-card-button">Open overview</button>
          </div>
        </aside>

        <main className="content-area">
          <header className="topbar">
            <div>
              <h1 className="page-title">{activePage}</h1>
              <div className="page-subtitle">Customer intelligence, loyalty, and operational journeys aligned to real support workflows.</div>
            </div>
            <div className="topbar-actions">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer, segment, order" className="search-input" />
              <button className="ghost-btn">Export audience</button>
              <button className="primary-btn">Create journey</button>
            </div>
          </header>

          <div className="content-wrap">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
