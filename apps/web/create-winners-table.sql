-- Create winners table
CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 10),
  prize_amount DECIMAL(10, 2),
  announced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, submission_id),
  UNIQUE(challenge_id, rank)
);

-- Enable RLS
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for winners table
-- Anyone can view winners
CREATE POLICY "Anyone can view winners"
  ON public.winners
  FOR SELECT
  USING (true);

-- Only admins can insert winners
CREATE POLICY "Admins can insert winners"
  ON public.winners
  FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update winners
CREATE POLICY "Admins can update winners"
  ON public.winners
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete winners
CREATE POLICY "Admins can delete winners"
  ON public.winners
  FOR DELETE
  USING (is_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS winners_challenge_id_idx ON public.winners(challenge_id);
CREATE INDEX IF NOT EXISTS winners_submission_id_idx ON public.winners(submission_id);
CREATE INDEX IF NOT EXISTS winners_rank_idx ON public.winners(rank);
