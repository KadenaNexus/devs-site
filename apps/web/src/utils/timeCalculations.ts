/**
 * Calculates the time remaining until a target date
 * @param targetDate - The target date/time
 * @returns Formatted string like "1d 2h Left", "3h 45m Left", "LIVE", or "Ended"
 */
export function calculateTimeRemaining(targetDate: string | Date): string {
  const now = new Date()
  const target = new Date(targetDate)
  const diffMs = target.getTime() - now.getTime()

  // If the time has passed
  if (diffMs <= 0) {
    // Check if it ended within the last 24 hours to show "LIVE"
    if (diffMs > -24 * 60 * 60 * 1000) {
      return 'LIVE'
    }
    return 'Ended'
  }

  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  // More than 1 day
  if (diffDay > 0) {
    const remainingHours = diffHour % 24
    if (remainingHours > 0) {
      return `${diffDay}d ${remainingHours}h Left`
    }
    return `${diffDay}d Left`
  }

  // Less than 1 day, show hours and minutes
  if (diffHour > 0) {
    const remainingMin = diffMin % 60
    if (remainingMin > 0) {
      return `${diffHour}h ${remainingMin}m Left`
    }
    return `${diffHour}h Left`
  }

  // Less than 1 hour, show minutes
  if (diffMin > 0) {
    return `${diffMin}m Left`
  }

  // Less than 1 minute
  return 'Starting soon'
}

/**
 * Gets the category abbreviation for badge display
 * @param category - Full category name
 * @returns Abbreviated category (e.g., "AI" for "AI & Machine Learning")
 */
export function getCategoryAbbreviation(category: string | null | undefined): string {
  if (!category) return 'GEN'

  const categoryMap: Record<string, string> = {
    AI: 'AI',
    DeFi: 'DeFi',
    NFT: 'NFT',
    Gaming: 'GME',
    DAO: 'DAO',
    Infrastructure: 'INF',
    DApp: 'DApp',
    'Smart Contracts': 'SC',
    Other: 'GEN',
  }

  return categoryMap[category] || category.substring(0, 3).toUpperCase()
}

/**
 * Calculates time ago from a given date
 * @param date - The date to calculate from
 * @returns Formatted string like "5 min ago", "2 hr ago", "3 days ago"
 */
export function getTimeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()

  if (diffMs < 0) return 'just now'

  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffYear > 0) return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`
  if (diffMonth > 0) return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`
  if (diffWeek > 0) return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`
  if (diffDay > 0) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`
  if (diffHour > 0) return `${diffHour} hr ago`
  if (diffMin > 0) return `${diffMin} min ago`
  if (diffSec > 0) return `${diffSec} sec ago`
  
  return 'just now'
}
