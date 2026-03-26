import type {
  CampaignConfig,
  ParsedProduct,
  PreviewCounts,
  ProductInput,
} from '@/types/campaign'

export function parseProducts(input: ProductInput): ParsedProduct[] {
  const asins = input.asins
    .split(/[\n,]+/)
    .map((a) => a.trim().toUpperCase())
    .filter((a) => a.length > 0)

  const skus = input.skus
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  return asins.map((asin, i) => ({
    asin,
    sku: skus[i] || undefined,
  }))
}

export function calculatePreview(
  products: ParsedProduct[],
  config: CampaignConfig
): PreviewCounts {
  const productCount = products.length
  if (productCount === 0) {
    return { campaigns: 0, adGroups: 0, keywords: 0, productTargets: 0, ads: 0 }
  }

  const targetingTypes: string[] = []
  if (config.targeting.auto.enabled) targetingTypes.push('auto')
  if (config.targeting.keyword.enabled) targetingTypes.push('keyword')
  if (config.targeting.product.enabled) targetingTypes.push('product')

  let campaigns = 0
  let adGroups = 0
  let keywords = 0
  let productTargets = 0

  if (config.structure === 'single-product') {
    campaigns = productCount * targetingTypes.length
    adGroups = campaigns
  } else if (config.structure === 'multi-product') {
    campaigns = targetingTypes.length
    adGroups = campaigns
  } else if (config.structure === 'single-keyword') {
    campaigns = productCount * targetingTypes.length
    adGroups = campaigns
  }

  if (config.targeting.keyword.enabled) {
    const kwLines = config.targeting.keyword.keywords
      .split(/[\n,]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const matchTypeCount = Object.values(config.targeting.keyword.matchTypes).filter(Boolean).length
    const kwCount = kwLines.length || 1

    if (config.structure === 'single-product') {
      keywords = productCount * kwCount * matchTypeCount
    } else {
      keywords = kwCount * matchTypeCount
    }
  }

  if (config.targeting.product.enabled) {
    const ptLines = config.targeting.product.asins
      .split(/[\n,]+/)
      .map((a) => a.trim())
      .filter((a) => a.length > 0)

    const ptCount = ptLines.length || 1

    if (config.structure === 'single-product') {
      productTargets = productCount * ptCount
    } else {
      productTargets = ptCount
    }
  }

  const ads = config.structure === 'single-product' ? productCount : productCount

  return { campaigns, adGroups, keywords, productTargets, ads }
}

export function formatDate(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}

export function generateCampaignName(
  template: string,
  product: ParsedProduct,
  targetType: string,
  index: number
): string {
  return template
    .replace('{ASIN}', product.asin)
    .replace('{SKU}', product.sku || product.asin)
    .replace('{TYPE}', targetType.toUpperCase())
    .replace('{INDEX}', String(index + 1))
}

interface BulkRow {
  [key: string]: string | number
}

export function generateBulkSheet(
  products: ParsedProduct[],
  config: CampaignConfig
): BulkRow[] {
  const rows: BulkRow[] = []
  const startDate = formatDate(config.startDate)
  const state = config.state === 'enabled' ? 'enabled' : 'paused'

  const targetingTypes: ('auto' | 'keyword' | 'product')[] = []
  if (config.targeting.auto.enabled) targetingTypes.push('auto')
  if (config.targeting.keyword.enabled) targetingTypes.push('keyword')
  if (config.targeting.product.enabled) targetingTypes.push('product')

  let campaignIndex = 0

  for (const targetType of targetingTypes) {
    const campaignsForType =
      config.structure === 'multi-product' ? [products] : products.map((p) => [p])

    for (const productGroup of campaignsForType) {
      const firstProduct = productGroup[0]
      const campaignName = generateCampaignName(
        config.campaignNameTemplate,
        firstProduct,
        targetType,
        campaignIndex
      )
      campaignIndex++

      const biddingStrategyMap: Record<string, string> = {
        fixed: 'Fixed bid',
        'down-only': 'Dynamic bids - down only',
        'up-down': 'Dynamic bids - up and down',
      }

      // Campaign row
      rows.push({
        'Record Type': 'Campaign',
        'Campaign Name': campaignName,
        'Campaign Type': 'Sponsored Products',
        'Targeting Type': targetType === 'auto' ? 'Auto' : 'Manual',
        State: state,
        'Daily Budget': config.dailyBudget || '10',
        'Start Date': startDate,
        'Bidding Strategy': biddingStrategyMap[config.biddingStrategy] || 'Fixed bid',
        'Placement Top': config.placement.topOfSearch
          ? Number(config.placement.topOfSearch)
          : 0,
        'Placement Product Page': config.placement.productPages
          ? Number(config.placement.productPages)
          : 0,
      })

      const adGroupName = config.adGroupNameTemplate
        .replace('{ASIN}', firstProduct.asin)
        .replace('{SKU}', firstProduct.sku || firstProduct.asin)
        .replace('{TYPE}', targetType.toUpperCase())

      // Ad Group row
      rows.push({
        'Record Type': 'Ad Group',
        'Campaign Name': campaignName,
        'Ad Group Name': adGroupName,
        State: state,
        'Default Bid': config.defaultBid || '0.75',
      })

      // Product ads
      for (const product of productGroup) {
        rows.push({
          'Record Type': 'Product Ad',
          'Campaign Name': campaignName,
          'Ad Group Name': adGroupName,
          ASIN: product.asin,
          SKU: product.sku || '',
          State: state,
        })
      }

      // Targeting rows
      if (targetType === 'auto') {
        const groups = config.targeting.auto.groups
        const autoGroups: Record<string, string> = {}
        if (groups.closeMatch) autoGroups['close-match'] = 'close-match'
        if (groups.looseMatch) autoGroups['loose-match'] = 'loose-match'
        if (groups.substitutes) autoGroups['substitutes'] = 'substitutes'
        if (groups.complements) autoGroups['complements'] = 'complements'

        for (const [, expressionType] of Object.entries(autoGroups)) {
          rows.push({
            'Record Type': 'Targeting',
            'Campaign Name': campaignName,
            'Ad Group Name': adGroupName,
            'Targeting Expression': expressionType,
            'Targeting Expression Type': 'Auto',
            State: state,
            Bid: config.targeting.auto.defaultBid || config.defaultBid || '0.75',
          })
        }
      } else if (targetType === 'keyword') {
        const keywords = config.targeting.keyword.keywords
          .split(/[\n,]+/)
          .map((k) => k.trim())
          .filter((k) => k.length > 0)

        const matchTypes: Array<'exact' | 'phrase' | 'broad'> = []
        if (config.targeting.keyword.matchTypes.exact) matchTypes.push('exact')
        if (config.targeting.keyword.matchTypes.phrase) matchTypes.push('phrase')
        if (config.targeting.keyword.matchTypes.broad) matchTypes.push('broad')

        for (const kw of keywords) {
          for (const match of matchTypes) {
            rows.push({
              'Record Type': 'Keyword',
              'Campaign Name': campaignName,
              'Ad Group Name': adGroupName,
              Keyword: kw,
              'Match Type': match.charAt(0).toUpperCase() + match.slice(1),
              State: state,
              Bid: config.targeting.keyword.defaultBid || config.defaultBid || '0.75',
            })
          }
        }
      } else if (targetType === 'product') {
        const ptAsins = config.targeting.product.asins
          .split(/[\n,]+/)
          .map((a) => a.trim().toUpperCase())
          .filter((a) => a.length > 0)

        for (const ptAsin of ptAsins) {
          rows.push({
            'Record Type': 'Targeting',
            'Campaign Name': campaignName,
            'Ad Group Name': adGroupName,
            'Targeting Expression': `asin="${ptAsin}"`,
            'Targeting Expression Type': 'Manual',
            State: state,
            Bid: config.targeting.product.defaultBid || config.defaultBid || '0.75',
          })
        }
      }

      // Negative keywords
      const negKwCampaign = config.negativeKeywords.campaign
        .split(/[\n,]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      const negKwAdGroup = config.negativeKeywords.adGroup
        .split(/[\n,]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      for (const kw of negKwCampaign) {
        rows.push({
          'Record Type': 'Negative Keyword',
          'Campaign Name': campaignName,
          Keyword: kw,
          'Match Type': 'Negative Exact',
          State: state,
        })
      }

      for (const kw of negKwAdGroup) {
        rows.push({
          'Record Type': 'Negative Keyword',
          'Campaign Name': campaignName,
          'Ad Group Name': adGroupName,
          Keyword: kw,
          'Match Type': 'Negative Exact',
          State: state,
        })
      }

      // Negative products
      const negProducts = config.negativeProducts
        .split(/[\n,]+/)
        .map((a) => a.trim().toUpperCase())
        .filter((a) => a.length > 0)

      for (const asin of negProducts) {
        rows.push({
          'Record Type': 'Negative Targeting',
          'Campaign Name': campaignName,
          'Ad Group Name': adGroupName,
          'Targeting Expression': `asin="${asin}"`,
          State: state,
        })
      }
    }
  }

  return rows
}
