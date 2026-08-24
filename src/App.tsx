import { useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@/lib/cn'
import {
  LayoutDashboard, Newspaper, Shield, Bitcoin, TrendingUp, BarChart3, Droplets,
  Globe, Send, Bell, Star, Activity, Settings, Server, Search, X,
  ChevronDown, ChevronRight, ExternalLink, AlertTriangle, CheckCircle2,
  Clock, ArrowUpRight, ArrowDownRight, Minus, Zap, Target, AlertOctagon,
  Menu, Copy, ToggleLeft, ToggleRight, Volume2, Mail, Smartphone, ChevronLeft,
  Skull, ArrowRight, Flame, Wifi,
} from 'lucide-react'
import { demoAirdrops, demoAlerts, demoWatchlist, demoSources, demoMacroCalendar, demoSystemStatus, demoSettings } from '@/lib/mock-data'
import type {
  IntelligenceEvent, AirdropOpportunity, Alert, NavSection, Direction,
  VerificationStatus, AirdropStatus, MarketMover, SystemStatus, SourceInfo,
  UserSettings, RiskLevel
} from '@/lib/types'
import {
  getImpactColor, getDirectionColor, getDirectionIcon, getConfidenceColor,
  getVerificationBadge, getAirdropStatusColor, getRiskColor, timeAgo,
  getSourceTypeLabel, getAgentTypeLabel
} from '@/lib/types'

function useLivePrices() {
  const [prices, setPrices] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/live/prices')
        const body = await res.json()
        if (mounted && body.ok) setPrices(body.data)
      } catch {}
      if (mounted) setLoading(false)
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])
  const get = useCallback((coinId: string) => {
    const p = prices[coinId]
    if (!p) return null
    return { price: p.usd, change24h: p.usd_24h_change, marketCap: p.usd_market_cap, volume: p.usd_24h_vol }
  }, [prices])
  return { get, loading, raw: prices }
}

function useLiveNews() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/live/news')
        const body = await res.json()
        if (mounted && body.ok) setItems(body.items)
      } catch {}
      if (mounted) setLoading(false)
    }
    fetchNews()
    const interval = setInterval(fetchNews, 300000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])
  return { items, loading }
}

const COIN_MAP: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  XRP: 'ripple', DOGE: 'dogecoin', ADA: 'cardano', AVAX: 'avalanche-2',
  LINK: 'chainlink', TON: 'the-open-network',
}

function Sidebar({ active, onNavigate, collapsed, onToggle }: {
  active: NavSection; onNavigate: (s: NavSection) => void; collapsed: boolean; onToggle: () => void
}) {
  const sections: { icon: React.ReactNode; label: string; id: NavSection; badge?: number }[] = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <Newspaper size={18} />, label: 'Live News', id: 'live-news' },
    { icon: <Shield size={18} />, label: 'Market Intel', id: 'market-intelligence' },
    { icon: <Bitcoin size={18} />, label: 'Crypto', id: 'crypto' },
    { icon: <TrendingUp size={18} />, label: 'Forex', id: 'forex' },
    { icon: <BarChart3 size={18} />, label: 'Stocks', id: 'stocks' },
    { icon: <Droplets size={18} />, label: 'Commodities', id: 'commodities' },
    { icon: <Globe size={18} />, label: 'Macro', id: 'macro' },
    { icon: <Send size={18} />, label: 'Airdrops', id: 'airdrops', badge: demoAirdrops.length },
    { icon: <Bell size={18} />, label: 'Alerts', id: 'alerts', badge: demoAlerts.filter(a => !a.is_read).length },
    { icon: <Star size={18} />, label: 'Watchlist', id: 'watchlist' },
    { icon: <Activity size={18} />, label: 'Analytics', id: 'analytics' },
    { icon: <Settings size={18} />, label: 'Settings', id: 'settings' },
    { icon: <Server size={18} />, label: 'System', id: 'admin' },
  ]
  return (
    <aside className={cn('h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 sticky top-0', collapsed ? 'w-16' : 'w-60')}>
      <div className="h-14 flex items-center justify-between px-3 border-b border-zinc-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-100 tracking-tight font-headline">World Financial News</span>
          </div>
        )}
        <button onClick={onToggle} className="text-zinc-500 hover:text-zinc-300 transition-colors">
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map(s => (
          <button key={s.id} onClick={() => onNavigate(s.id)}
            className={cn('w-full flex items-center gap-3 px-3 py-2 text-sm transition-all',
              active === s.id ? 'bg-violet-500/10 text-violet-400 border-r-2 border-violet-500' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900')}>
            {s.icon}
            {!collapsed && (
              <>
                <span className="flex-1 text-left font-body">{s.label}</span>
                {s.badge && s.badge > 0 && (
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                    s.id === 'alerts' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400')}>{s.badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-zinc-800">
        {!collapsed && <div className="flex items-center gap-2 text-[10px] text-zinc-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span>7/8 agents online</span></div>}
      </div>
    </aside>
  )
}

function ImpactBadge({ score, size = 'sm' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={cn('inline-flex items-center gap-1 font-bold border rounded', getImpactColor(score),
      size === 'sm' && 'text-[10px] px-1.5 py-0.5', size === 'md' && 'text-xs px-2 py-1', size === 'lg' && 'text-sm px-2.5 py-1')}>
      <Zap size={size === 'sm' ? 10 : 12} />{score}
    </span>
  )
}
function ConfidenceBadge({ score }: { score: number }) {
  return <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', getConfidenceColor(score))}><Target size={10} />{score}%</span>
}
function DirectionBadge({ direction }: { direction: Direction }) {
  return <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', getDirectionColor(direction))}>{getDirectionIcon(direction)} {direction}</span>
}
function VerificationBadge({ status }: { status: VerificationStatus }) {
  const badge = getVerificationBadge(status)
  return <span className={cn('text-[10px] font-bold border px-1.5 py-0.5 rounded', badge.className)}>{badge.label}</span>
}

function IntelligenceCard({ event }: { event: IntelligenceEvent }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={cn('border rounded-lg p-4 transition-all hover:shadow-md bg-violet-500/10',
      event.impact_score >= 90 ? 'border-l-4 border-l-red-500 border-t-gray-200 border-r-gray-200 border-b-gray-200' :
      event.impact_score >= 75 ? 'border-l-4 border-l-orange-400 border-t-gray-200 border-r-gray-200 border-b-gray-200' :
      event.impact_score >= 60 ? 'border-l-4 border-l-amber-400 border-t-gray-200 border-r-gray-200 border-b-gray-200' : 'border-violet-200')}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] font-bold text-gray-600 bg-violet-100 px-1.5 py-0.5 rounded">{event.asset}</span>
            <span className="text-[10px] text-gray-500 bg-violet-100 px-1.5 py-0.5 rounded">{event.asset_class}</span>
            <VerificationBadge status={event.verification_status} />
            {event.source_count && event.source_count > 1 && <span className="text-[10px] text-gray-400">{event.source_count} sources</span>}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug font-editorial">{event.headline}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <ImpactBadge score={event.impact_score} />
          <ConfidenceBadge score={event.confidence_score} />
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed mb-2 font-editorial">{event.summary}</p>
      <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-2">
        <span>{getAgentTypeLabel(event.agent_type)}</span>
        <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(event.published_at)}</span>
        <span>{getSourceTypeLabel(event.source_type)}: {event.source}</span>
      </div>
      {event.market_reaction && (
        <div className="text-[10px] text-gray-600 bg-violet-500/5 rounded px-2 py-1 mb-2 border border-gray-100">
          <span className="text-gray-500 font-medium">Market: </span>{event.market_reaction}
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <DirectionBadge direction={event.direction} />
        {event.affected_assets && event.affected_assets.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {event.affected_assets.slice(0, 4).map(a => (
              <span key={a} className="text-[9px] text-gray-500 bg-violet-100 px-1 py-0.5 rounded">{a}</span>
            ))}
            {event.affected_assets.length > 4 && <span className="text-[9px] text-gray-400">+{event.affected_assets.length - 4}</span>}
          </div>
        )}
        <div className="flex-1" />
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">
          {expanded ? 'Less' : 'Why it matters'}{expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
        <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1">Source <ExternalLink size={10} /></a>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {event.reasoning && <div><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Why it matters</span><p className="text-xs text-gray-600 mt-1">{event.reasoning}</p></div>}
          {event.risk_flags && event.risk_flags.length > 0 && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded px-3 py-2">
              <AlertTriangle size={12} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-1">{event.risk_flags.map((f, i) => <span key={i} className="text-[10px] text-red-600 bg-red-100 px-1.5 py-0.5 rounded">{f}</span>)}</div>
            </div>
          )}
          {event.other_sources && event.other_sources.length > 0 && (
            <div><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Other Sources</span>
              <div className="flex flex-wrap gap-2 mt-1">{event.other_sources.map((s, i) => <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1">{s.name} <ExternalLink size={8} /></a>)}</div>
            </div>
          )}
          {event.is_demo && <div className="text-[9px] text-amber-600 flex items-center gap-1"><AlertTriangle size={9} /> DEMO DATA</div>}
        </div>
      )}
    </div>
  )
}

function LiveNewsCard({ item }: { item: any }) {
  const pubDate = new Date(item.pubDate)
  const minutesAgo = Math.floor((Date.now() - pubDate.getTime()) / 60000)
  const timeStr = minutesAgo < 60 ? `${minutesAgo}m ago` : minutesAgo < 1440 ? `${Math.floor(minutesAgo / 60)}h ago` : `${Math.floor(minutesAgo / 1440)}d ago`
  return (
    <div className="border border-violet-200 rounded-lg p-4 bg-violet-500/10 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-gray-600 bg-violet-100 px-1.5 py-0.5 rounded">{item.source}</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {timeStr}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug font-editorial">{item.title}</h3>
          {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
        </div>
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0">Read <ExternalLink size={10} /></a>
      </div>
    </div>
  )
}

function AirdropCard({ airdrop }: { airdrop: AirdropOpportunity }) {
  const [expanded, setExpanded] = useState(false)
  const isScam = airdrop.scam_risk === 'High'
  return (
    <div className={cn('border rounded-lg p-4 transition-all bg-violet-500/10 hover:shadow-md',
      isScam ? 'border-l-4 border-l-red-500 border-t-gray-200 border-r-gray-200 border-b-gray-200' :
      airdrop.opportunity_score >= 80 ? 'border-l-4 border-l-emerald-500 border-t-gray-200 border-r-gray-200 border-b-gray-200' : 'border-violet-200')}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={cn('text-[10px] font-bold border px-1.5 py-0.5 rounded', getAirdropStatusColor(airdrop.status))}>{airdrop.status.replace(/_/g, ' ')}</span>
            <span className="text-[10px] text-gray-500 bg-violet-100 px-1.5 py-0.5 rounded">{airdrop.chain}</span>
            {airdrop.official_confirmation && <span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><CheckCircle2 size={10} /> Official</span>}
            {isScam && <span className="text-[10px] text-red-600 flex items-center gap-0.5"><Skull size={10} /> SCAM</span>}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 font-editorial">{airdrop.project_name}</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">{airdrop.category} · {airdrop.project_age || 'Unknown age'}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className={cn('text-lg font-bold', airdrop.opportunity_score >= 80 ? 'text-emerald-600' : airdrop.opportunity_score >= 50 ? 'text-amber-600' : 'text-gray-400')}>{airdrop.opportunity_score}</div>
          <span className="text-[9px] text-gray-400 uppercase">Score</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 text-[10px]">
        <div className="bg-violet-500/5 border border-gray-100 rounded px-2 py-1.5"><span className="text-gray-400">Risk</span><span className={cn('ml-1 font-bold', getRiskColor(airdrop.risk_score <= 30 ? 'Low' : airdrop.risk_score <= 60 ? 'Medium' : 'High'))}>{airdrop.risk_score}/100</span></div>
        <div className="bg-violet-500/5 border border-gray-100 rounded px-2 py-1.5"><span className="text-gray-400">Effort</span><span className="ml-1 font-bold text-gray-700">{airdrop.estimated_effort}</span></div>
        <div className="bg-violet-500/5 border border-gray-100 rounded px-2 py-1.5"><span className="text-gray-400">Confidence</span><span className={cn('ml-1 font-bold', getConfidenceColor(airdrop.confidence_score))}>{airdrop.confidence_score}%</span></div>
      </div>
      {airdrop.funding && <div className="text-[10px] text-gray-500 mb-2"><span className="text-gray-400">Funding:</span> {airdrop.funding}{airdrop.tvl && <> · TVL: {airdrop.tvl}</>}{airdrop.participants && <> · {airdrop.participants.toLocaleString()} participants</>}</div>}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">{expanded ? 'Less' : 'Details'}{expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}</button>
        {airdrop.website && <a href={airdrop.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1">Website <ExternalLink size={10} /></a>}
        {airdrop.campaign_url && <a href={airdrop.campaign_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1">Campaign <ExternalLink size={10} /></a>}
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {airdrop.requirements && airdrop.requirements.length > 0 && (
            <div><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Required Actions</span>
              <ul className="mt-1 space-y-1">{airdrop.requirements.map((r, i) => <li key={i} className="text-xs text-gray-600 flex items-start gap-2"><span className="text-violet-500 mt-0.5">•</span>{r}</li>)}</ul></div>
          )}
          {airdrop.backers && airdrop.backers.length > 0 && <div className="text-[10px] text-gray-500"><span className="text-gray-400 font-medium">Backers: </span>{airdrop.backers.join(', ')}</div>}
          {airdrop.risk_flags && airdrop.risk_flags.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
              <div className="flex items-center gap-1 mb-1"><Skull size={11} className="text-red-500" /><span className="text-[10px] font-bold text-red-600">RISK WARNINGS</span></div>
              {airdrop.risk_flags.map((f, i) => <div key={i} className="text-[10px] text-red-600 flex items-start gap-1"><span>•</span>{f}</div>)}
              <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">Never enter your seed phrase or private key into an airdrop website.</div>
            </div>
          )}
          {airdrop.notes && <div className="text-[10px] text-gray-600 italic">{airdrop.notes}</div>}
        </div>
      )}
    </div>
  )
}

function AlertPopup({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  if (alert.priority !== 'CRITICAL' && alert.priority !== 'HIGH') return null
  const isCritical = alert.priority === 'CRITICAL'
  return (
    <div className={cn('border rounded-lg p-4 mb-3 bg-violet-500/10 shadow-lg animate-in slide-in-from-top-2',
      isCritical ? 'border-l-4 border-l-red-500 border-t-gray-200 border-r-gray-200 border-b-gray-200' : 'border-l-4 border-l-orange-400 border-t-gray-200 border-r-gray-200 border-b-gray-200')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isCritical ? <AlertOctagon size={14} className="text-red-500" /> : <AlertTriangle size={14} className="text-orange-500" />}
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', isCritical ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600')}>{alert.priority}</span>
            {alert.asset && <span className="text-[10px] text-gray-500">{alert.asset}</span>}
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1 font-editorial">{alert.title}</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-editorial">{alert.message}</p>
          <div className="flex items-center gap-3 mt-2">
            {alert.impact_score && <ImpactBadge score={alert.impact_score} size="md" />}
            {alert.confidence_score && <ConfidenceBadge score={alert.confidence_score} />}
            <span className="text-[10px] text-gray-400">{timeAgo(alert.created_at)}</span>
          </div>
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {alert.source_url && <a href={alert.source_url} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-violet-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded flex items-center gap-1 transition-colors">View Source <ExternalLink size={10} /></a>}
        <button onClick={onDismiss} className="text-[10px] bg-violet-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors">Dismiss</button>
      </div>
    </div>
  )
}

function MarketMoversWidget({ priceHook }: { priceHook: ReturnType<typeof useLivePrices> }) {
  const cryptoList = [{ symbol: 'BTC', coinId: 'bitcoin', name: 'Bitcoin' }, { symbol: 'ETH', coinId: 'ethereum', name: 'Ethereum' }, { symbol: 'SOL', coinId: 'solana', name: 'Solana' }, { symbol: 'BNB', coinId: 'binancecoin', name: 'BNB' }, { symbol: 'XRP', coinId: 'ripple', name: 'XRP' }]
  return (
    <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial mb-3 flex items-center gap-2"><Flame size={12} className="text-orange-500" /> Live Market Prices</h3>
      <div className="space-y-1">
        {cryptoList.map(c => {
          const data = priceHook.get(c.coinId)
          return (
            <div key={c.symbol} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-violet-500/5 transition-colors">
              <div className="flex items-center gap-2"><span className="text-xs font-bold text-gray-900 w-12">{c.symbol}</span><span className="text-[10px] text-gray-400">{c.name}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-700 font-medium">{data ? `$${data.price.toLocaleString(undefined, { maximumFractionDigits: data.price < 1 ? 4 : 2 })}` : '...'}</span>
                {data && <span className={cn('text-[10px] font-bold flex items-center gap-0.5', data.change24h > 0 ? 'text-emerald-600' : data.change24h < 0 ? 'text-red-600' : 'text-gray-400')}>{data.change24h > 0 ? <ArrowUpRight size={10} /> : data.change24h < 0 ? <ArrowDownRight size={10} /> : <Minus size={10} />}{data.change24h > 0 ? '+' : ''}{data.change24h.toFixed(1)}%</span>}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100 text-[9px] text-gray-400 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />Live from CoinGecko · Auto-refreshes every 60s</div>
    </div>
  )
}

function MacroCalendarWidget() {
  return (
    <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial mb-3 flex items-center gap-2"><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg> Upcoming Macro Events</h3>
      <div className="space-y-2">
        {demoMacroCalendar.map(e => (
          <div key={e.id} className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-violet-500/5 transition-colors">
            <div className="text-center shrink-0 w-12"><div className="text-[10px] text-gray-400">{e.date.split('-').slice(1).join('/')}</div><div className="text-[10px] font-bold text-gray-700">{e.time}</div></div>
            <div className="flex-1 min-w-0"><div className="text-xs text-gray-700 truncate font-medium">{e.event}</div><div className="text-[10px] text-gray-400">{e.country} · P: {e.previous} → F: {e.forecast}</div></div>
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', e.impact === 'high' ? 'bg-red-100 text-red-600' : e.impact === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-violet-100 text-gray-500')}>{e.impact.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterBar({ assetClass, onAssetClassChange, direction, onDirectionChange, search, onSearchChange }: {
  assetClass: string; onAssetClassChange: (v: string) => void; direction: string; onDirectionChange: (v: string) => void; search: string; onSearchChange: (v: string) => void
}) {
  const classes = ['ALL', 'CRYPTO', 'FOREX', 'STOCKS', 'COMMODITIES', 'MACRO']
  const directions = ['ALL', 'BULLISH', 'BEARISH', 'MIXED', 'NEUTRAL']
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search intelligence..." className="w-full bg-violet-500/10 border border-violet-200 rounded px-3 pl-9 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200" />
        {search && <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={12} /></button>}
      </div>
      <div className="flex items-center gap-1">{classes.map(c => <button key={c} onClick={() => onAssetClassChange(c)} className={cn('text-[10px] px-2 py-1 rounded transition-colors', assetClass === c ? 'bg-violet-100 text-violet-700 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-violet-100')}>{c}</button>)}</div>
      <div className="w-px h-5 bg-gray-200" />
      <div className="flex items-center gap-1">{directions.map(d => <button key={d} onClick={() => onDirectionChange(d)} className={cn('text-[10px] px-2 py-1 rounded transition-colors', direction === d ? 'bg-violet-100 text-violet-700 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-violet-100')}>{d === 'BULLISH' && '🟢 '}{d === 'BEARISH' && '🔴 '}{d === 'MIXED' && '🟡 '}{d}</button>)}</div>
    </div>
  )
}

function Dashboard({ onNavigate, priceHook }: { onNavigate: (s: NavSection) => void; priceHook: ReturnType<typeof useLivePrices> }) {
  const topAirdrops = [...demoAirdrops].filter(a => a.scam_risk !== 'High').sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 3)
  const now = new Date()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-900 font-headline">Intelligence Dashboard</h1><p className="text-xs text-gray-500">Real-time market intelligence · {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
        <div className="flex items-center gap-2"><span className="text-[10px] text-gray-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE DATA</span></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial flex items-center gap-2"><Zap size={12} className="text-amber-500" /> Top Airdrop Opportunities</h3>
              <button onClick={() => onNavigate('airdrops')} className="text-[10px] text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">View All <ArrowRight size={10} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {topAirdrops.map(a => (
                <div key={a.id} className="bg-violet-500/5 border border-violet-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-gray-900">{a.project_name}</span><span className={cn('text-sm font-bold', a.opportunity_score >= 80 ? 'text-emerald-600' : 'text-amber-600')}>{a.opportunity_score}</span></div>
                  <div className="text-[10px] text-gray-500 space-y-0.5"><div>{a.chain} · {a.category}</div><div>{a.estimated_effort} effort · {a.funding || 'Unknown'}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial flex items-center gap-2"><Newspaper size={12} className="text-blue-500" /> Recent News</h3>
              <button onClick={() => onNavigate('live-news')} className="text-[10px] text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">View All <ArrowRight size={10} /></button>
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Live from CoinDesk, CoinTelegraph, Reuters</div>
          </div>
        </div>
        <div className="space-y-4"><MarketMoversWidget priceHook={priceHook} /><MacroCalendarWidget /></div>
      </div>
    </div>
  )
}

function LiveNewsView({ newsHook }: { newsHook: ReturnType<typeof useLiveNews> }) {
  const [search, setSearch] = useState('')
  const filtered = newsHook.items.filter(item => { if (!search) return true; const q = search.toLowerCase(); return item.title.toLowerCase().includes(q) || item.source.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)) })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-lg font-bold text-gray-900 font-headline">Live News Feed</h1><span className="text-xs text-gray-400">{filtered.length} articles · Live</span></div>
      <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news..." className="w-full bg-violet-500/10 border border-violet-200 rounded px-3 pl-9 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200" />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={12} /></button>}</div>
      {newsHook.loading && <div className="text-center py-8 text-gray-400 text-sm">Loading live news...</div>}
      <div className="space-y-3">{filtered.map((item, i) => <LiveNewsCard key={i} item={item} />)}</div>
    </div>
  )
}

function SectorView({ sector, label }: { sector: string; label: string }) {
  const { items, loading } = useLiveNews()
  const filtered = items.filter((item: any) => {
    const text = `${item.title} ${item.description} ${item.source}`.toLowerCase()
    const keywords: Record<string, string[]> = { CRYPTO: ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'solana', 'sol', 'defi', 'token', 'blockchain', 'xrp', 'bnb'], FOREX: ['forex', 'dollar', 'euro', 'yen', 'pound', 'currency', 'fx', 'usd', 'eur', 'gbp', 'jpy'], STOCKS: ['stock', 'equity', 'nasdaq', 's&p', 'dow', 'earnings', 'ipo', 'nvidia', 'apple', 'tesla', 'tech'], COMMODITIES: ['gold', 'oil', 'silver', 'commodity', 'crude', 'opec', 'natural gas', 'wti', 'brent'], MACRO: ['fed', 'interest rate', 'inflation', 'cpi', 'gdp', 'central bank', 'monetary policy', 'fomc', 'recession'] }
    return (keywords[sector] || []).some(k => text.includes(k))
  })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-lg font-bold text-gray-900 font-headline">{label} Intelligence</h1><span className="text-xs text-gray-400">{filtered.length} articles · Live</span></div>
      {loading && <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>}
      <div className="space-y-3">{filtered.map((item: any, i: number) => <LiveNewsCard key={i} item={item} />)}{!loading && filtered.length === 0 && <div className="text-center py-12 text-gray-400"><p className="text-sm">No {label.toLowerCase()} news currently</p></div>}</div>
    </div>
  )
}

function MarketIntelligence({ onNavigate }: { onNavigate: (s: NavSection) => void }) {
  const sectors: { id: NavSection; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'crypto', label: 'Crypto', icon: <Bitcoin size={16} />, color: 'text-amber-500' },
    { id: 'forex', label: 'Forex', icon: <TrendingUp size={16} />, color: 'text-blue-500' },
    { id: 'stocks', label: 'Stocks', icon: <BarChart3 size={16} />, color: 'text-emerald-500' },
    { id: 'commodities', label: 'Commodities', icon: <Droplets size={16} />, color: 'text-orange-500' },
    { id: 'macro', label: 'Macro', icon: <Globe size={16} />, color: 'text-violet-500' },
  ]
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900 font-headline">Market Intelligence</h1>
      <p className="text-xs text-gray-500">Select a sector to view live intelligence</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectors.map(s => (
          <button key={s.id} onClick={() => onNavigate(s.id)} className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 text-left hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg bg-violet-500/5 group-hover:bg-violet-100 transition-colors', s.color)}>{s.icon}</div>
              <div><h3 className="text-sm font-bold text-gray-900">{s.label}</h3><p className="text-[10px] text-gray-400">Live feed</p></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function AirdropsView() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const filtered = demoAirdrops.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false
    if (search) { const q = search.toLowerCase(); return a.project_name.toLowerCase().includes(q) || a.chain.toLowerCase().includes(q) }
    return true
  }).sort((a, b) => b.opportunity_score - a.opportunity_score)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-lg font-bold text-gray-900 font-headline">Airdrop Intelligence</h1><span className="text-xs text-gray-400">{filtered.length} opportunities</span></div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search airdrops..." className="w-full bg-violet-500/10 border border-violet-200 rounded px-3 pl-9 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200" /></div>
        {['ALL', 'CONFIRMED_AIRDROP', 'ACTIVE_CAMPAIGN', 'POTENTIAL_AIRDROP', 'SPECULATIVE'].map(s => <button key={s} onClick={() => setStatusFilter(s)} className={cn('text-[10px] px-2 py-1 rounded transition-colors', statusFilter === s ? 'bg-violet-100 text-violet-700 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-violet-100')}>{s === 'ALL' ? 'ALL' : s.replace(/_/g, ' ')}</button>)}</div>
      <div className="space-y-3">{filtered.map(a => <AirdropCard key={a.id} airdrop={a} />)}</div>
    </div>
  )
}

function AlertsView() {
  const [filter, setFilter] = useState<string>('ALL')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const filtered = demoAlerts.filter(a => { if (dismissed.has(a.id)) return false; if (filter !== 'ALL' && a.priority !== filter) return false; return true }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-lg font-bold text-gray-900 font-headline">Alerts</h1><span className="text-xs text-gray-400">{filtered.length} alerts</span></div>
      <div className="flex items-center gap-2">{['ALL', 'CRITICAL', 'HIGH', 'IMPORTANT', 'INFO'].map(p => <button key={p} onClick={() => setFilter(p)} className={cn('text-[10px] px-2 py-1 rounded transition-colors', filter === p ? 'bg-violet-100 text-violet-700 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-violet-100')}>{p}</button>)}</div>
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className={cn('border rounded-lg p-4 bg-violet-500/10 shadow-sm', a.priority === 'CRITICAL' ? 'border-l-4 border-l-red-500 border-t-gray-200 border-r-gray-200 border-b-gray-200' : a.priority === 'HIGH' ? 'border-l-4 border-l-orange-400 border-t-gray-200 border-r-gray-200 border-b-gray-200' : 'border-violet-200')}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', a.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' : a.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' : a.priority === 'IMPORTANT' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600')}>{a.priority}</span>
                  {a.asset && <span className="text-[10px] text-gray-500">{a.asset}</span>}
                  <span className="text-[10px] text-gray-400">{timeAgo(a.created_at)}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 font-editorial">{a.title}</h3>
                <p className="text-xs text-gray-600">{a.message}</p>
                <div className="flex items-center gap-3 mt-2">{a.impact_score && <ImpactBadge score={a.impact_score} />}{a.confidence_score && <ConfidenceBadge score={a.confidence_score} />}</div>
              </div>
              <div className="flex items-center gap-2">
                {a.source_url && <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1">Source <ExternalLink size={10} /></a>}
                <button onClick={() => setDismissed(prev => new Set([...prev, a.id]))} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WatchlistView({ priceHook }: { priceHook: ReturnType<typeof useLivePrices> }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-lg font-bold text-gray-900 font-headline">Watchlist</h1><span className="text-xs text-gray-400">{demoWatchlist.length} assets tracked</span></div>
      <div className="bg-violet-500/10 border border-violet-200 rounded-lg overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-violet-500/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-violet-200">
          <div className="col-span-2">Asset</div><div className="col-span-3">Name</div><div className="col-span-2">Class</div><div className="col-span-2 text-right">Price</div><div className="col-span-2 text-right">24h</div><div className="col-span-1 text-right">Intel</div>
        </div>
        {demoWatchlist.map(item => {
          const coinId = COIN_MAP[item.symbol]
          const live = coinId ? priceHook.get(coinId) : null
          const price = live ? live.price : item.price
          const change = live ? live.change24h : (item.change_24h || 0)
          return (
            <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-100 hover:bg-violet-500/5 transition-colors items-center">
              <div className="col-span-2"><span className="text-xs font-bold text-gray-900">{item.symbol}</span></div>
              <div className="col-span-3"><span className="text-xs text-gray-500">{item.name}</span></div>
              <div className="col-span-2"><span className="text-[10px] text-gray-500 bg-violet-100 px-1.5 py-0.5 rounded">{item.asset_class}</span></div>
              <div className="col-span-2 text-right"><span className="text-xs font-mono text-gray-700 font-medium">{price != null ? (price >= 1000 ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : price >= 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(4)}`) : '—'}</span></div>
              <div className="col-span-2 text-right"><span className={cn('text-xs font-bold', change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-gray-400')}>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span></div>
              <div className="col-span-1 text-right"><span className="text-[10px] text-gray-400">{live ? '●' : '○'}</span></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AnalyticsView() {
  const stats = [{ label: 'Live Sources', value: '3', color: 'text-blue-500', icon: <Newspaper size={14} /> }, { label: 'Crypto Assets', value: '10', color: 'text-amber-500', icon: <Bitcoin size={14} /> }, { label: 'Airdrops Tracked', value: demoAirdrops.length.toString(), color: 'text-violet-500', icon: <Send size={14} /> }, { label: 'Alert History', value: demoAlerts.length.toString(), color: 'text-red-500', icon: <AlertOctagon size={14} /> }]
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900 font-headline">Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{stats.map(s => <div key={s.label} className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm"><div className={cn('mb-2', s.color)}>{s.icon}</div><div className="text-lg font-bold text-gray-900 font-headline">{s.value}</div><div className="text-[10px] text-gray-400">{s.label}</div></div>)}</div>
      <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial mb-3">Data Sources</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-violet-500/5 border border-gray-100 rounded p-3 text-center"><div className="text-sm font-bold text-gray-900">CoinGecko</div><div className="text-[10px] text-gray-400">Live Prices · 60s refresh</div></div>
          <div className="bg-violet-500/5 border border-gray-100 rounded p-3 text-center"><div className="text-sm font-bold text-gray-900">CoinDesk</div><div className="text-[10px] text-gray-400">RSS News Feed</div></div>
          <div className="bg-violet-500/5 border border-gray-100 rounded p-3 text-center"><div className="text-sm font-bold text-gray-900">CoinTelegraph</div><div className="text-[10px] text-gray-400">RSS News Feed</div></div>
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  const [settings, setSettings] = useState(demoSettings)
  const toggle = (key: keyof UserSettings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-lg font-bold text-gray-900 font-headline">Settings</h1>
      <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial">Notification Thresholds</h3>
        <div className="grid grid-cols-3 gap-4">
          {[{ key: 'high_impact_threshold' as const, label: 'High Impact' }, { key: 'critical_threshold' as const, label: 'Critical' }, { key: 'min_confidence' as const, label: 'Min Confidence' }].map(item => (
            <div key={item.key}><label className="text-[10px] text-gray-500 block mb-1">{item.label}</label><input type="number" value={settings[item.key]} min={0} max={100} onChange={e => setSettings(p => ({ ...p, [item.key]: +e.target.value }))} className="w-full bg-violet-500/5 border border-violet-200 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200" /></div>
          ))}
        </div>
      </div>
      <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial">Notifications</h3>
        {[{ key: 'notifications_enabled' as const, label: 'Enable Notifications', icon: <Bell size={14} /> }, { key: 'push_enabled' as const, label: 'Push Notifications', icon: <Smartphone size={14} /> }, { key: 'email_enabled' as const, label: 'Email Notifications', icon: <Mail size={14} /> }, { key: 'sound_enabled' as const, label: 'Sound Alerts', icon: <Volume2 size={14} /> }].map(item => (
          <div key={item.key} className="flex items-center justify-between py-1.5"><div className="flex items-center gap-2 text-xs text-gray-700">{item.icon} {item.label}</div><button onClick={() => toggle(item.key)} className="text-gray-400 hover:text-gray-600">{settings[item.key] ? <ToggleRight size={24} className="text-violet-500" /> : <ToggleLeft size={24} />}</button></div>
        ))}
      </div>
    </div>
  )
}

function SystemMonitor() {
  const status = demoSystemStatus
  const agents = [{ name: 'Chief Intelligence Agent', status: 'online' }, { name: 'Crypto Market Agent', status: 'online' }, { name: 'Forex Intelligence Agent', status: 'online' }, { name: 'Stock Market Agent', status: 'online' }, { name: 'Commodity Agent', status: 'online' }, { name: 'Macro Agent', status: 'online' }, { name: 'Geopolitical Agent', status: 'online' }, { name: 'News Scanner', status: 'offline' }]
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900 font-headline">System Monitor</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: 'Agents Online', value: `${status.agents_online}/${status.agents_total}`, icon: <Activity size={14} />, color: 'text-emerald-500' }, { label: 'Sources Active', value: `${status.sources_online}`, icon: <Wifi size={14} />, color: 'text-blue-500' }, { label: 'Events Processed', value: status.events_processed.toLocaleString(), icon: <Newspaper size={14} />, color: 'text-violet-500' }, { label: 'Duplicates Removed', value: status.duplicates_removed.toLocaleString(), icon: <Copy size={14} />, color: 'text-amber-500' }].map(s => <div key={s.label} className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm"><div className={cn('mb-2', s.color)}>{s.icon}</div><div className="text-lg font-bold text-gray-900 font-headline">{s.value}</div><div className="text-[10px] text-gray-400">{s.label}</div></div>)}</div>
      <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial mb-3">Agent Status</h3>
        <div className="space-y-2">{agents.map(a => <div key={a.name} className="flex items-center justify-between py-2 px-3 rounded bg-violet-500/5 border border-gray-100"><div className="flex items-center gap-3"><div className={cn('w-2 h-2 rounded-full', a.status === 'online' ? 'bg-emerald-500' : 'bg-red-500')} /><span className="text-xs text-gray-700">{a.name}</span></div><span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', a.status === 'online' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600')}>{a.status.toUpperCase()}</span></div>)}</div>
      </div>
      <div className="bg-violet-500/10 border border-violet-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-editorial mb-3">Live Data Sources</h3>
        <div className="space-y-1.5">{[{ name: 'CoinGecko API', type: 'Crypto Prices', status: 'Active' }, { name: 'CoinDesk RSS', type: 'News', status: 'Active' }, { name: 'CoinTelegraph RSS', type: 'News', status: 'Active' }, { name: 'Reuters RSS', type: 'News', status: 'Active' }].map(s => <div key={s.name} className="flex items-center justify-between py-1 text-[10px]"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-gray-600">{s.name}</span><span className="text-gray-400">({s.type})</span></div><span className="text-emerald-600 font-bold">{s.status}</span></div>)}</div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [alertPopups, setAlertPopups] = useState<Alert[]>(demoAlerts.filter(a => a.priority === 'CRITICAL' || a.priority === 'HIGH').slice(0, 2))
  const [now, setNow] = useState(new Date())
  const priceHook = useLivePrices()
  const newsHook = useLiveNews()
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t) }, [])
  useEffect(() => { const t = setTimeout(() => setAlertPopups(prev => prev.filter(a => a.id !== 'alert-001')), 15000); return () => clearTimeout(t) }, [])
  const dismissAlert = useCallback((id: string) => setAlertPopups(prev => prev.filter(a => a.id !== id)), [])
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard onNavigate={setActiveSection} priceHook={priceHook} />
      case 'live-news': return <LiveNewsView newsHook={newsHook} />
      case 'market-intelligence': return <MarketIntelligence onNavigate={setActiveSection} />
      case 'crypto': return <SectorView sector="CRYPTO" label="Crypto" />
      case 'forex': return <SectorView sector="FOREX" label="Forex" />
      case 'stocks': return <SectorView sector="STOCKS" label="Stocks" />
      case 'commodities': return <SectorView sector="COMMODITIES" label="Commodities" />
      case 'macro': return <SectorView sector="MACRO" label="Macro" />
      case 'airdrops': return <AirdropsView />
      case 'alerts': return <AlertsView />
      case 'watchlist': return <WatchlistView priceHook={priceHook} />
      case 'analytics': return <AnalyticsView />
      case 'settings': return <SettingsView />
      case 'admin': return <SystemMonitor />
      default: return <Dashboard onNavigate={setActiveSection} priceHook={priceHook} />
    }
  }
  return (
    <div className="flex h-screen bg-violet-500/5 text-gray-900 overflow-hidden">
      <Sidebar active={activeSection} onNavigate={setActiveSection} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-y-auto bg-violet-500/5">
        <div className="sticky top-0 z-10 bg-violet-500/8 backdrop-blur-sm border-b border-violet-200 px-6 py-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700 capitalize font-headline">{activeSection.replace(/-/g, ' ')}</h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE</span>
            <span className="text-[10px] text-gray-500">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="p-6">
          {alertPopups.length > 0 && activeSection === 'dashboard' && <div className="mb-4">{alertPopups.map(a => <AlertPopup key={a.id} alert={a} onDismiss={() => dismissAlert(a.id)} />)}</div>}
          {renderSection()}
        </div>
      </main>
    </div>
  )
}