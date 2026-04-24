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

function badgeStyle(kind) {
  const styles = {
    Gold: { bg: '#fef3c7', color: '#b45309' },
    Silver: { bg: '#e2e8f0', color: '#475569' },
    Bronze: { bg: '#ffedd5', color: '#c2410c' },
    'At risk': { bg: 'var(--danger-soft)', color: 'var(--danger)' },
    'Refund pending': { bg: 'var(--warn-soft)', color: 'var(--warn)' },
    Active: { bg: 'var(--success-soft)', color: 'var(--success)' },
    Live: { bg: 'var(--success-soft)', color: 'var(--success)' },
    Draft: { bg: 'var(--primary-soft)', color: 'var(--text)' }
  };
  return styles[kind] || { bg: 'var(--info-soft)', color: 'var(--info)' };
}

function Badge({ children }) {
  const style = badgeStyle(children);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', borderRadius: 999, background: style.bg, color: style.color, fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function Card({ title, right, children }) {
  return (
    <section style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
        {right}
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </section>
  );
}

function Kpi({ label, value, helper }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow)' }}>
      <div style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 13 }}>{helper}</div>
    </div>
  );
}

const primaryButton = { border: 'none', background: 'var(--primary)', color: '#fff', padding: '12px 16px', borderRadius: 16, fontWeight: 700 };
const secondaryButton = { border: '1px solid var(--border)', background: '#fff', color: 'var(--text)', padding: '12px 16px', borderRadius: 16, fontWeight: 700 };

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
      <div style={{ display: 'grid', gap: 14 }}>
        {filteredCustomers.map((c) => (
          <button key={c.id} onClick={() => { setSelectedCustomerId(c.id); setActivePage('Customer 360'); }} style={{ textAlign: 'left', width: '100%', background: selectedCustomer?.id === c.id ? '#f8fafc' : '#fff', border: selectedCustomer?.id === c.id ? '1px solid #0f172a' : '1px solid var(--border)', borderRadius: 22, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 800 }}>{c.name}</div>
                  <Badge>{c.tier}</Badge>
                  <Badge>{c.status}</Badge>
                </div>
                <div style={{ marginTop: 8, fontSize: 14, color: 'var(--muted)' }}>{c.segment}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.clv}</div>
            </div>
            <div style={{ marginTop: 10, fontSize: 14 }}>{c.issue}</div>
          </button>
        ))}
      </div>
    );
  }

  function OverviewPage() {
    return (
      <div style={{ display: 'grid', gap: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          <Kpi label="Active loyalty members" value="18.4k" helper="Across online and retail" />
          <Kpi label="Service-aware segments" value="12" helper="Built from orders, refunds, and support signals" />
          <Kpi label="Operational journeys live" value="7" helper="Delay, refund, gift, VIP and more" />
          <Kpi label="Store-linked profiles" value="91%" helper="Retail enrollment matched to customer records" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 22 }}>
          <Card title="Priority customer segments">
            <div style={{ display: 'grid', gap: 12 }}>
              {SEGMENTS.map((s) => (
                <div key={s.name} style={{ border: '1px solid var(--border)', borderRadius: 18, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>{s.size} customers</div>
                  </div>
                  <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14 }}>{s.logic}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Why this matters to the team">
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                'Support can see loyalty status, case history, and lifetime value in one customer view.',
                'Journeys react to real events like delays, refunds, and missing gifts - not just marketing events.',
                'Store enrollment becomes part of the same customer record instead of a disconnected manual flow.',
                'Compensation and goodwill can be targeted more precisely for high-value or high-risk customers.'
              ].map((text) => (
                <div key={text} style={{ padding: 16, borderRadius: 18, background: 'var(--panel-soft)', fontSize: 14 }}>{text}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function CustomersPage() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card title="Customer list"><CustomerList /></Card>
        <Card title="Customer summary">
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Badge>{selectedCustomer.tier}</Badge><Badge>{selectedCustomer.status}</Badge></div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{selectedCustomer.name}</div>
              <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 14 }}>{selectedCustomer.email}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
              {[
                ['Lifetime value', selectedCustomer.clv],
                ['Points', String(selectedCustomer.points)],
                ['Preferred channel', selectedCustomer.channel],
                ['Last order', selectedCustomer.lastOrder]
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'var(--panel-soft)', borderRadius: 18, padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</div>
                  <div style={{ marginTop: 8, fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 18, borderRadius: 20, background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <div style={{ fontWeight: 700, color: '#9a3412' }}>Current context</div>
              <div style={{ marginTop: 8, color: '#9a3412', fontSize: 14 }}>{selectedCustomer.issue}</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  function Customer360Page() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card title={`Customer 360 - ${selectedCustomer.name}`} right={<Badge>{selectedCustomer.tier}</Badge>}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
              {[
                ['Segment', selectedCustomer.segment],
                ['Case count', String(selectedCustomer.cases)],
                ['Refunds', String(selectedCustomer.refunds)],
                ['Substitute acceptance', selectedCustomer.substituteRate],
                ['Preferred channel', selectedCustomer.channel],
                ['Journey', selectedCustomer.journey]
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'var(--panel-soft)', borderRadius: 18, padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</div>
                  <div style={{ marginTop: 8, fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Event timeline</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {selectedCustomer.timeline.map((step) => (
                  <div key={step} style={{ border: '1px solid var(--border)', borderRadius: 18, padding: 14, fontSize: 14 }}>{step}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card title="Next best actions">
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Issue a service recovery reward or points based on case severity.',
              'Use preferred channel when the next order issue occurs.',
              'Escalate automatically if another delay happens within 30 days.',
              'Use previous substitute acceptance pattern when offering replacement products.'
            ].map((text) => (
              <div key={text} style={{ padding: 16, borderRadius: 18, background: 'var(--panel-soft)', fontSize: 14 }}>{text}</div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function SegmentsPage() {
    return (
      <Card title="Service-aware segments">
        <div style={{ display: 'grid', gap: 12 }}>
          {SEGMENTS.map((s) => (
            <div key={s.name} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 800 }}>{s.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{s.size} customers</div>
              </div>
              <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14 }}>{s.logic}</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function JourneysPage() {
    return (
      <Card title="Operational journeys">
        <div style={{ display: 'grid', gap: 12 }}>
          {JOURNEYS.map((j) => (
            <div key={j.name} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{j.name}</div>
                  <div style={{ marginTop: 8, fontSize: 14, color: 'var(--muted)' }}>Trigger: {j.trigger}</div>
                  <div style={{ marginTop: 6, fontSize: 14 }}>Action: {j.action}</div>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{j.goal}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function LoyaltyPage() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card title="Loyalty system">
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Points earned on purchases and selected service recovery events',
              'Tier visibility for support and customer operations',
              'Retail enrollment linked to the same profile as online activity',
              'Goodwill and compensation rules can be tied to value and case type'
            ].map((text) => (
              <div key={text} style={{ padding: 16, borderRadius: 18, background: 'var(--panel-soft)', fontSize: 14 }}>{text}</div>
            ))}
          </div>
        </Card>
        <Card title="Support-facing loyalty value">
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Agents can see whether the customer is worth escalating or protecting.',
              'Points and benefits can be used as compensation after service failures.',
              'Loyalty status gives context for exceptions and goodwill decisions.'
            ].map((text) => (
              <div key={text} style={{ padding: 16, borderRadius: 18, background: 'var(--panel-soft)', fontSize: 14 }}>{text}</div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  function RewardsPage() {
    return (
      <Card title="Rewards and service recovery">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
          {REWARDS.map((r) => (
            <div key={r.name} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18 }}>
              <div style={{ fontWeight: 800 }}>{r.name}</div>
              <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14 }}>{r.type}</div>
              <div style={{ marginTop: 14, fontSize: 24, fontWeight: 800 }}>{r.cost === 0 ? 'Dynamic' : `${r.cost} pts`}</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function CampaignsPage() {
    return (
      <Card title="Campaigns">
        <div style={{ display: 'grid', gap: 12 }}>
          {CAMPAIGNS.map((c) => (
            <div key={c.name} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{c.name}</div>
                  <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14 }}>Audience: {c.audience}</div>
                  <div style={{ marginTop: 6, fontSize: 14 }}>Channel: {c.channel}</div>
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
        <div style={{ display: 'grid', gap: 12 }}>
          {STORE.map((s) => (
            <div key={s.location} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 800 }}>{s.location}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{s.enrollments} enrollments</div>
              </div>
              <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14 }}>Linked profiles: {s.linkedProfiles} - Missing links: {s.missingLinks}</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function SettingsPage() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card title="Connected systems">
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Magento customer and order feed',
              'Directo refund and case context',
              'Store enrollment sync',
              'Email and SMS provider integration',
              'Support case and campaign context feed'
            ].map((text) => (
              <div key={text} style={{ padding: 16, borderRadius: 18, background: 'var(--panel-soft)', fontSize: 14 }}>{text}</div>
            ))}
          </div>
        </Card>
        <Card title="Rules and controls">
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              'Delay recovery points threshold',
              'VIP escalation conditions',
              'Refund risk segmentation rules',
              'Preferred channel logic based on response history'
            ].map((text) => (
              <div key={text} style={{ padding: 16, borderRadius: 18, background: 'var(--panel-soft)', fontSize: 14 }}>{text}</div>
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
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      <aside style={{ width: 274, background: '#ffffff', borderRight: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 16, background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>G</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Gemer Flow</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Loyalty & Customer Studio</div>
          </div>
        </div>
        <nav style={{ display: 'grid', gap: 6 }}>
          {NAV.map((item) => {
            const active = activePage === item;
            return (
              <button key={item} onClick={() => setActivePage(item)} style={{ border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 18, background: active ? 'var(--primary)' : '#fff', color: active ? '#fff' : 'var(--text)', fontWeight: active ? 700 : 600, boxShadow: active ? '0 8px 20px rgba(15,23,42,.12)' : 'none' }}>
                <span>{item}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', background: 'var(--primary)', color: '#fff', borderRadius: 26, padding: 18 }}>
          <div style={{ fontWeight: 800 }}>Current product story</div>
          <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,.78)', lineHeight: 1.5 }}>
            Loyalty, service recovery, and customer context in one system for support, marketing, and retail teams.
          </div>
          <button onClick={() => setActivePage('Overview')} style={{ marginTop: 14, border: 'none', background: '#fff', color: 'var(--primary)', padding: '10px 14px', borderRadius: 14, fontWeight: 700 }}>Open overview</button>
        </div>
      </aside>
      <main style={{ flex: 1, minWidth: 0 }}>
        <header style={{ background: 'rgba(255,255,255,.92)', borderBottom: '1px solid var(--border)', padding: '20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.04em' }}>{activePage}</h1>
              <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 14 }}>Customer intelligence, loyalty, and operational journeys aligned to real support workflows.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customer, segment, order" style={{ width: 280, padding: '12px 14px', borderRadius: 16, border: '1px solid var(--border)', background: '#fff', outline: 'none' }} />
              <button style={secondaryButton}>Export audience</button>
              <button style={primaryButton}>Create journey</button>
            </div>
          </div>
        </header>
        <div style={{ padding: 28 }}>{renderPage()}</div>
      </main>
    </div>
  );
}
