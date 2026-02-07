/**
 * Truncates text to a specified number of words
 * @param text - The text to truncate
 * @param wordLimit - Maximum number of words (default: 8)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateWords(text: string | null | undefined, wordLimit: number = 8): string {
  if (!text) return ''
  
  const words = text.trim().split(/\s+/)
  
  if (words.length <= wordLimit) {
    return text
  }
  
  return words.slice(0, wordLimit).join(' ') + '...'
}

/**
 * Truncates text to a specified character limit
 * @param text - The text to truncate
 * @param charLimit - Maximum number of characters
 * @returns Truncated text with ellipsis if needed
 */
export function truncateChars(text: string | null | undefined, charLimit: number = 100): string {
  if (!text) return ''
  
  if (text.length <= charLimit) {
    return text
  }
  
  return text.slice(0, charLimit).trim() + '...'
}

/**
 * Calculates average score from submission scores
 * @param scores - Array of score objects from database
 * @returns Formatted string like "85/100" or "N/A" if no scores
 */
export function calculateAverageScore(scores: any[] | null | undefined): string {
  if (!scores || scores.length === 0) return 'N/A'

  // Calculate average for each judge's score
  const judgeAverages = scores.map((score) => {
    const total =
      (score.impact || 0) +
      (score.execution || 0) +
      (score.innovation || 0) +
      (score.security || 0) +
      (score.ux_clarity || 0)
    return total / 5
  })

  // Average across all judges
  const overallAverage =
    judgeAverages.reduce((sum, avg) => sum + avg, 0) / judgeAverages.length

  return `${Math.round(overallAverage)}/100`
}
