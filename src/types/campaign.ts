export type AccountType = 'seller' | 'vendor'
export type CampaignStructure = 'single-product' | 'multi-product' | 'single-keyword'
export type BiddingStrategy = 'fixed' | 'down-only' | 'up-down'
export type MatchType = 'exact' | 'phrase' | 'broad'
export type TargetingType = 'auto' | 'keyword' | 'product'
export type CampaignState = 'enabled' | 'paused'

export interface AutoTargetingGroups {
  closeMatch: boolean
  looseMatch: boolean
  substitutes: boolean
  complements: boolean
}

export interface TargetingConfig {
  auto: {
    enabled: boolean
    groups: AutoTargetingGroups
    defaultBid: string
  }
  keyword: {
    enabled: boolean
    matchTypes: {
      exact: boolean
      phrase: boolean
      broad: boolean
    }
    keywords: string
    defaultBid: string
  }
  product: {
    enabled: boolean
    asins: string
    defaultBid: string
  }
}

export interface PlacementAdjustments {
  topOfSearch: string
  restOfSearch: string
  productPages: string
}

export interface NegativeKeywordConfig {
  campaign: string
  adGroup: string
}

export interface CampaignConfig {
  accountType: AccountType
  structure: CampaignStructure
  dailyBudget: string
  defaultBid: string
  campaignNameTemplate: string
  adGroupNameTemplate: string
  startDate: string
  state: CampaignState
  biddingStrategy: BiddingStrategy
  targeting: TargetingConfig
  placement: PlacementAdjustments
  negativeKeywords: NegativeKeywordConfig
  negativeProducts: string
}

export interface ProductInput {
  asins: string
  skus: string
}

export interface PreviewCounts {
  campaigns: number
  adGroups: number
  keywords: number
  productTargets: number
  ads: number
}

export interface ParsedProduct {
  asin: string
  sku?: string
}
