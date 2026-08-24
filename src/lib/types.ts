// Intelligence Event Types
export type AssetClass = 'CRYPTO' | 'FOREX' | 'STOCKS' | 'COMMODITIES' | 'MACRO' | 'GEOPOLITICAL'
export type EventCategory = 'news' | 'rumor' | 'confirmed' | 'official' | 'market_reaction'
export type SourceType = 'official' | 'government' | 'central_bank' | 'financial_media' | 'crypto_media' | 'social' | 'unverified'
export type Direction = 'BULLISH' | 'BEARISH' | 'MIXED' | 'NEUTRAL' | 'UNKNOWN'
export type VerificationStatus = 'RUMOR' | 'UNCONFIRMED' | 'CONFIRMED' | 'OFFICIAL'
export type ImpactLevel = 'MINIMAL' | 'LOW' | 'MODERATE' | 'IMPORTANT' | 'HIGH_IMPACT' | 'CRITICAL'
export type AirdropStatus = 'CONFIRMED_AIRDROP' | 'ACTIVE_CAMPAIGN' | 'POTENTIAL_AIRDROP' | 'SPECULATIVE'
export type AlertPriority = 'INFO' | 'IMPORTANT' | 'HIGH' | 'CRITICAL'
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type EffortLevel = 'Low' | 'Medium' | 'High'

export interface IntelligenceEvent {
  id: string
  event_id: string
  headline: string
  summary: string
  detail?: string
  asset: string
  asset_class: AssetClass
  category: EventCategory
  source: string
  source_url: string
  source_type: SourceType
  source_credibility: number
  published_at: string
  detected_at: string
  confidence_score: number
  impact_score: number
  direction: Direction
  verification_status: VerificationStatus
  affected_assets?: string[]
  reasoning?: string
  market_reaction?: string
  risk_flags?: string[]
  agent_type?: string
  is_demo: boolean
  source_count?: number
  other_sources?: { name: string; url: string }[]
}

export interface AirdropOpportunity {
  id: string
  project_name: string
  category: string
  chain: string
  status: AirdropStatus
  official_confirmation: boolean
  website?: string
  source_url?: string
  social_url?: string
  campaign_url?: string
  start_date?: string
  end_date?: string
  requirements?: string[]
  estimated_effort: EffortLevel
  opportunity_score: number
  risk_score: number
  confidence_score: number
  funding?: string
  backers?: string[]
  participants?: number
  token_confirmed: boolean
  tvl?: string
  project_age?: string
  sybil_risk: RiskLevel
  scam_risk: RiskLevel
  risk_flags?: string[]
  notes?: string
  is_demo: boolean
}

export interface Alert {
  id: string
  title: string
  message: string
  priority: AlertPriority
  asset?: string
  impact_score?: number
  confidence_score?: number
  event_id?: string
  source_url?: string
  is_read: boolean
  is_dismissed: boolean
  is_demo: boolean
  created_at: string
}

export interface WatchlistItem {
  id: string
  symbol: string
  name: string
  asset_class: AssetClass
  is_default: boolean
  sort_order: number
  price?: number
  change_24h?: number
}

export interface SourceInfo {
  id: string
  name: string
  url?: string
  source_type: SourceType
  credibility: number
  is_active: boolean
  last_scan?: string
  events_count: number
  accuracy_rate?: number
}

export interface UserSettings {
  notifications_enabled: boolean
  high_impact_threshold: number
  critical_threshold: number
  airdrop_threshold: number
  min_confidence: number
  watched_assets: string[]
  watched_sectors: string[]
  quiet_hours_start?: string
  quiet_hours_end?: string
  push_enabled: boolean
  email_enabled: boolean
  sound_enabled: boolean
  theme: 'dark' | 'light'
}

export interface SystemStatus {
  agents_online: number
  agents_total: number
  sources_online: number
  sources_offline: number
  events_processed: number
  duplicates_removed: number
  alerts_generated: number
  airdrops_discovered: number
  opportunities_verified: number
  queue_status: string
  database_status: string
  last_scan?: string
}

export interface MarketMover {
  symbol: string
  name: string
  price: number
  change_24h: number
  asset_class: AssetClass
}

export interface MacroEvent {
  id: string
  date: string
  time: string
  event: string
  country: string
  impact: 'high' | 'medium' | 'low'
  previous?: string
  forecast?: string
}

export type NavSection =
  | 'dashboard'
  | 'live-news'
  | 'market-intelligence'
  | 'crypto'
  | 'forex'
  | 'stocks'
  | 'commodities'
  | 'macro'
  | 'airdrops'
  | 'alerts'
  | 'watchlist'
  | 'analytics'
  | 'settings'
  | 'admin'

export function getImpactColor(score: number): string {
  if (score >= 91) return 'text-red-400 bg-red-500/20 border-red-500/30'
  if (score >= 76) return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
  if (score >= 61) return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
  if (score >= 41) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
  if (score >= 21) return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
  return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30'
}

export function getImpactLabel(score: number): string {
  if (score >= 91) return 'CRITICAL'
  if (score >= 76) return 'HIGH'
  if (score >= 61) return 'IMPORTANT'
  if (score >= 41) return 'MODERATE'
  if (score >= 21) return 'LOW'
  return 'MINIMAL'
}

export function getDirectionColor(direction: Direction): string {
  switch (direction) {
    case 'BULLISH': return 'text-emerald-400'
    case 'BEARISH': return 'text-red-400'
    case 'MIXED': return 'text-amber-400'
    case 'NEUTRAL': return 'text-zinc-400'
    default: return 'text-zinc-500'
  }
}

export function getDirectionIcon(direction: Direction): string {
  switch (direction) {
    case 'BULLISH': return '🟢'
    case 'BEARISH': return '🔴'
    case 'MIXED': return '🟡'
    case 'NEUTRAL': return '⚪'
    default: return '❓'
  }
}

export function getConfidenceColor(score: number): string {
  if (score >= 81) return 'text-emerald-400'
  if (score >= 61) return 'text-blue-400'
  if (score >= 31) return 'text-amber-400'
  return 'text-red-400'
}

export function getVerificationBadge(status: VerificationStatus): { label: string; className: string } {
  switch (status) {
    case 'OFFICIAL': return { label: 'OFFICIAL', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
    case 'CONFIRMED': return { label: 'CONFIRMED', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    case 'UNCONFIRMED': return { label: 'UNCONFIRMED', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
    case 'RUMOR': return { label: 'RUMOR', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' }
  }
}

export function getAirdropStatusColor(status: AirdropStatus): string {
  switch (status) {
    case 'CONFIRMED_AIRDROP': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'ACTIVE_CAMPAIGN': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'POTENTIAL_AIRDROP': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'SPECULATIVE': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  }
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'Low': return 'text-emerald-400'
    case 'Medium': return 'text-amber-400'
    case 'High': return 'text-red-400'
  }
}

export function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return `${diffDay}d ago`
}

export function getSourceTypeLabel(type: SourceType): string {
  switch (type) {
    case 'official': return 'Official'
    case 'government': return 'Government'
    case 'central_bank': return 'Central Bank'
    case 'financial_media': return 'Financial Media'
    case 'crypto_media': return 'Crypto Media'
    case 'social': return 'Social'
    case 'unverified': return 'Unverified'
  }
}

export function getAgentTypeLabel(type?: string): string {
  switch (type) {
    case 'crypto': return '🪙 Crypto Agent'
    case 'forex': return '💱 Forex Agent'
    case 'stocks': return '📈 Stock Agent'
    case 'commodities': return '🛢️ Commodity Agent'
    case 'macro': return '🏛️ Macro Agent'
    case 'geopolitical': return '🌍 Geopolitical Agent'
    case 'news': return '📰 News Scanner'
    case 'airdrop': return '🪂 Airdrop Agent'
    case 'chief': return '🧠 Chief Intelligence'
    default: return '🤖 Agent'
  }
}