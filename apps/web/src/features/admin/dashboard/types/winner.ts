// Type for winner with details from admin service
export interface WinnerWithDetails {
  id: string
  challenge_id: string
  submission_id: string
  rank: number
  prize_amount?: number
  announced_at: string
  // Joined fields
  challenge_name: string
  developer_name: string
  project_title: string
}
