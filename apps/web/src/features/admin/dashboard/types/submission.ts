// Type for individual judge score
export interface JudgeScore {
  id: string
  judge_user_id: string
  judge_name: string
  impact: number
  execution: number
  innovation: number
  security: number
  ux_clarity: number
  notes?: string
  created_at: string
  total: number // Sum of all 5 criteria
}

// Type for submission with details from admin service
export interface SubmissionWithDetails {
  id: string
  challenge_id: string
  submitted_by: string
  developer_name: string
  email: string
  discord?: string
  project_title: string
  problem_statement?: string
  solution_description?: string
  github_url?: string
  demo_url?: string
  smart_contract_details?: string
  status: string
  is_public: boolean
  created_at: string
  // Joined fields
  challenge_name: string
  judge_names: string
  average_score: number
  score_count: number
  individual_scores?: JudgeScore[] // Individual scores from each judge
}
