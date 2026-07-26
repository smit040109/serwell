'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminShell from '@/components/admin/AdminShell'
import {
  Loader2, Users, MousePointerClick, MapPin, Smartphone, Globe,
  ArrowUpRight, Mail, RefreshCcw, X,
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6']

function KpiCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-3">
        <Icon size={16} className="text-white/50" />
      </div>
      <div className="text-3xl font-semibold tracking-tight tabular-nums">{value?.toLocaleString?.() ?? value ?? 0}</div>
      <div className="text-[11px] tracking-[0.2em] uppercase text-white/50 mt-1">{label}</div>
      {hint ? <div className="text-[11px] text-white/40 mt-2">{hint}</div> : null}
    </div>
  )
}

function Panel({ title, children, className = '' }) {
  return (
    <div className={`p-5 rounded-xl border border-white/10 bg-white/[0.02] ${className}`}>
      <div className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-4">{title}</div>
      {children}
    </div>
  )
}

function BreakdownList({ items, max = 8 }) {
  const top = (items || []).slice(0, max)
  const total = top.reduce((s, x) => s + (x.value || 0), 0) || 1
  return (
    <ul className="space-y-2.5">
      {top.length === 0 && <li className="text-xs text-white/40">No data yet.</li>}
      {top.map((it, i) => {
        const pct = Math.round((it.value / total) * 100)
        return (
          <li key={i} className="flex items-center gap-3 text-[13px]">
            <div className="flex-1 truncate" title={it.label}>{it.label || '—'}</div>
            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden shrink-0">
              <div className="h-full bg-white/60" style={{ width: `${pct}%` }} />
            </div>
            <div className="tabular-nums w-10 text-right text-white/60">{it.value}</div>
          </li>
        )
      })}
    </ul>
  )
}

function DonutChart({ items }) {
  const data = (items || []).slice(0, 6)
  if (!data.length) return <div className="text-xs text-white/40">No data yet.</div>
  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={45} outerRadius={75} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 11, color: 'white' }} />
          <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function AnalyticsPage() {
  const { apiFetch, loading: authLoading } = useAdmin() || {}
  const [days, setDays] = useState(7)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [journey, setJourney] = useState(null)
  const [journeyLoading, setJourneyLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    if (!apiFetch) return
    try {
      setError('')
      const r = await apiFetch(`/api/admin/analytics?days=${days}`)
      setData(r)
    } catch (e) {
      setError(e.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (authLoading || !apiFetch) return
    setLoading(true)
    load()
  }, [apiFetch, authLoading, days])

  async function openJourney(sessionId) {
    setJourneyLoading(true); setJourney(null)
    try {
      const r = await apiFetch(`/api/admin/analytics/session/${sessionId}`)
      setJourney(r)
    } catch (e) {
      setJourney({ error: e.message })
    } finally {
      setJourneyLoading(false)
    }
  }

  const chartData = data?.series?.map(s => ({ ...s, day: s.day?.slice(5) })) || []

  if (authLoading) return null

  return (
    <AdminShell
      title="Analytics & Visitor Tracking"
      description="First-party analytics from your website — visitors, sources, devices, journeys, and lead attribution."
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {[1, 7, 30, 90].map(n => (
            <button
              key={n}
              onClick={() => setDays(n)}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase ${days === n ? 'bg-white text-black' : 'text-white/60 hover:bg-white/[0.05]'}`}
            >
              {n === 1 ? 'Today' : `${n}d`}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setRefreshing(true); load() }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs uppercase tracking-wider text-white/70 hover:bg-white/[0.05]"
        >
          <RefreshCcw size={12} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
        <div className="text-[11px] text-white/40 ml-auto">
          Backed by GTM · GA4 · Clarity · first-party events.
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-white/50 text-sm"><Loader2 className="animate-spin" size={14}/> Loading analytics…</div>
      ) : !data ? null : (
        <>
          {/* KPI ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <KpiCard icon={Users} label="Sessions" value={data.totals.sessions} />
            <KpiCard icon={Users} label="Unique visitors" value={data.totals.uniqueVisitors} />
            <KpiCard icon={RefreshCcw} label="Returning sessions" value={data.totals.returningSessions} />
            <KpiCard icon={Mail} label="Leads captured" value={data.totals.leads} />
          </div>

          {/* TRAFFIC OVER TIME */}
          <Panel title={`Sessions & unique visitors · last ${days} day${days > 1 ? 's' : ''}`} className="mb-6">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff11" />
                  <XAxis dataKey="day" tick={{ fill: '#ffffff88', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#ffffff88', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'white' }} />
                  <Line type="monotone" dataKey="sessions" stroke="#6366F1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="visitors" stroke="#EC4899" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* BREAKDOWNS ROW */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Panel title="Traffic source"><DonutChart items={data.breakdowns.source} /></Panel>
            <Panel title="Device type"><DonutChart items={data.breakdowns.device} /></Panel>
            <Panel title="Top browsers"><BreakdownList items={data.breakdowns.browser} /></Panel>
            <Panel title="Top OS"><BreakdownList items={data.breakdowns.os} /></Panel>
            <Panel title={<span className="inline-flex items-center gap-1"><MapPin size={11}/> Top countries</span>}>
              <BreakdownList items={data.breakdowns.country} />
            </Panel>
            <Panel title="Top cities">
              <BreakdownList items={data.breakdowns.city} />
            </Panel>
            <Panel title={<span className="inline-flex items-center gap-1"><Globe size={11}/> Top pages</span>}>
              <BreakdownList items={data.breakdowns.pages} max={10} />
            </Panel>
            <Panel title={<span className="inline-flex items-center gap-1"><MousePointerClick size={11}/> Button clicks</span>}>
              <BreakdownList items={data.breakdowns.clicks} max={10} />
            </Panel>
            <Panel title="Section engagement (top pages)">
              <div className="text-xs text-white/50 leading-relaxed">
                Section time-on-screen is captured per <code className="text-white/70">data-section</code> element.
                Add <code className="text-white/70">data-section=&quot;hero&quot;</code> etc. to any component to start
                collecting section-wise time. Data appears in individual session journeys below.
              </div>
            </Panel>
          </div>

          {/* RECENT LEADS */}
          <Panel title={`Recent leads · ${data.recentLeads?.length || 0}`} className="mb-6">
            {(!data.recentLeads || data.recentLeads.length === 0) ? (
              <div className="text-xs text-white/40">No leads yet in this range.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/40 uppercase tracking-wider text-[10px]">
                      <th className="text-left py-2 pr-3">When</th>
                      <th className="text-left py-2 pr-3">Name</th>
                      <th className="text-left py-2 pr-3">Email</th>
                      <th className="text-left py-2 pr-3">Phone</th>
                      <th className="text-left py-2 pr-3">Business</th>
                      <th className="text-left py-2 pr-3">Source</th>
                      <th className="text-left py-2 pr-3">Location</th>
                      <th className="text-left py-2 pr-3">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentLeads.map((l) => (
                      <tr key={l._id} className="border-t border-white/5 hover:bg-white/[0.03]">
                        <td className="py-2 pr-3 whitespace-nowrap text-white/70">{new Date(l.createdAt).toLocaleString()}</td>
                        <td className="py-2 pr-3 font-medium">{l.name}</td>
                        <td className="py-2 pr-3 text-white/70">{l.email}</td>
                        <td className="py-2 pr-3 text-white/70">{l.phone || '—'}</td>
                        <td className="py-2 pr-3 text-white/70">{l.business || '—'}</td>
                        <td className="py-2 pr-3"><span className="inline-flex px-1.5 py-0.5 rounded bg-white/10 text-[10px]">{l.source || 'Direct'}</span></td>
                        <td className="py-2 pr-3 text-white/60 text-[11px]">{[l.city, l.country].filter(Boolean).join(', ') || '—'}</td>
                        <td className="py-2 pr-3 max-w-xs truncate text-white/60" title={l.message}>{l.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          {/* LATEST SESSIONS */}
          <Panel title="Latest visitor sessions (click a row for full journey)">
            {(!data.latestSessions || data.latestSessions.length === 0) ? (
              <div className="text-xs text-white/40">No sessions yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/40 uppercase tracking-wider text-[10px]">
                      <th className="text-left py-2 pr-3">Last seen</th>
                      <th className="text-left py-2 pr-3">Visitor</th>
                      <th className="text-left py-2 pr-3">Location</th>
                      <th className="text-left py-2 pr-3">Device</th>
                      <th className="text-left py-2 pr-3">Source</th>
                      <th className="text-left py-2 pr-3">Pages</th>
                      <th className="text-left py-2 pr-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.latestSessions.map((s) => (
                      <tr key={s._id || s.sessionId} className="border-t border-white/5 hover:bg-white/[0.03]">
                        <td className="py-2 pr-3 whitespace-nowrap text-white/70">{new Date(s.lastSeen).toLocaleString()}</td>
                        <td className="py-2 pr-3 font-mono text-[11px] text-white/60">{s.visitorId?.slice(0, 8)}…{s.isReturning ? ' (ret)' : ''}</td>
                        <td className="py-2 pr-3 text-white/70">{[s.city, s.country].filter(Boolean).join(', ') || '—'}</td>
                        <td className="py-2 pr-3 text-white/70 flex items-center gap-1"><Smartphone size={11}/> {s.device || '—'} · {s.browser || ''}</td>
                        <td className="py-2 pr-3"><span className="inline-flex px-1.5 py-0.5 rounded bg-white/10 text-[10px]">{s.source || 'Direct'}</span></td>
                        <td className="py-2 pr-3 tabular-nums">{s.pageviews || 0}</td>
                        <td className="py-2 pr-3">
                          <button onClick={() => openJourney(s.sessionId)} className="inline-flex items-center gap-1 text-white/60 hover:text-white text-[11px]">
                            Journey <ArrowUpRight size={11} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}

      {/* Journey drawer */}
      {(journey || journeyLoading) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-4" onClick={() => { setJourney(null) }}>
          <div className="w-full max-w-3xl bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium tracking-wide">Visitor journey</div>
              <button onClick={() => setJourney(null)} className="text-white/50 hover:text-white"><X size={16} /></button>
            </div>
            {journeyLoading ? (
              <div className="flex items-center gap-2 text-white/50 text-sm"><Loader2 className="animate-spin" size={14}/> Loading…</div>
            ) : journey?.error ? (
              <div className="text-sm text-red-400">{journey.error}</div>
            ) : journey?.session ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[12px] text-white/70 mb-5">
                  <div><span className="text-white/40">Visitor</span><div className="font-mono">{journey.session.visitorId?.slice(0, 12)}…</div></div>
                  <div><span className="text-white/40">Location</span><div>{[journey.session.city, journey.session.country].filter(Boolean).join(', ') || '—'}</div></div>
                  <div><span className="text-white/40">Device</span><div>{journey.session.device} · {journey.session.browser}</div></div>
                  <div><span className="text-white/40">OS</span><div>{journey.session.os || '—'}</div></div>
                  <div><span className="text-white/40">Source</span><div>{journey.session.source || 'Direct'}</div></div>
                  <div><span className="text-white/40">Language</span><div>{journey.session.language || '—'}</div></div>
                  <div><span className="text-white/40">Referrer</span><div className="truncate">{journey.session.referrer || '—'}</div></div>
                  <div><span className="text-white/40">First seen</span><div>{new Date(journey.session.firstSeen).toLocaleString()}</div></div>
                  <div><span className="text-white/40">Last seen</span><div>{new Date(journey.session.lastSeen).toLocaleString()}</div></div>
                </div>

                <div className="text-[11px] tracking-[0.2em] uppercase text-white/40 mb-2">Journey timeline</div>
                <ol className="space-y-2 border-l border-white/10 pl-4">
                  {(journey.events || []).map((e, i) => (
                    <li key={e._id || i} className="relative text-[12px]">
                      <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-white/60" />
                      <span className="text-white/40 text-[11px] mr-2">{new Date(e.createdAt).toLocaleTimeString()}</span>
                      {e.type === 'pageview' && <span>Viewed <code className="text-white/80">{e.path}</code></span>}
                      {e.type === 'click' && <span>Clicked <b className="text-white/80">{e.name}</b> — {e.label || e.href}</span>}
                      {e.type === 'page_time' && <span>Spent <b>{Math.round((e.ms || 0) / 1000)}s</b> on <code>{e.path}</code></span>}
                      {e.type === 'section_time' && (
                        <span>
                          Section time on <code>{e.path}</code>:{' '}
                          {(e.sections || []).map((s, j) => (
                            <span key={j} className="text-white/70 mr-2">{s.id} <span className="text-white/40">{Math.round(s.ms / 1000)}s</span></span>
                          ))}
                        </span>
                      )}
                    </li>
                  ))}
                  {(!journey.events || journey.events.length === 0) && (
                    <li className="text-xs text-white/40">No detailed events for this session yet.</li>
                  )}
                </ol>
              </>
            ) : null}
          </div>
        </div>
      )}
    </AdminShell>
  )
}
