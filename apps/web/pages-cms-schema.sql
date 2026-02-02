-- ========================================
-- CMS PAGES SYSTEM (ACF-like)
-- ========================================
-- Run this SQL in Supabase SQL Editor

-- Create enum for page status
CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');

-- Create pages table with flexible content structure
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content JSONB DEFAULT '[]'::jsonb, -- Flexible content blocks
    status page_status DEFAULT 'draft',
    meta_title TEXT,
    meta_description TEXT,
    featured_image TEXT,
    order_index INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_order ON pages(order_index);

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view published pages
CREATE POLICY "Public can view published pages"
ON pages
FOR SELECT
TO public
USING (status = 'published');

-- Policy: Authenticated users with admin role can do everything
CREATE POLICY "Admins can manage all pages"
ON pages
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_pages_updated_at
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_pages_updated_at();

-- Insert default pages
INSERT INTO pages (slug, title, description, status, order_index, content) VALUES
('home', 'Home', 'Landing page showing the hero statement, explaining Kadena Devs, value proposition, and main call-to-actions.', 'published', 1, 
'[
  {"type": "hero", "data": {"title": "Welcome to Kadena Devs", "subtitle": "Build real-world solutions on Kadena blockchain", "cta": "Get Started"}},
  {"type": "features", "data": {"title": "Why Kadena Devs?", "items": [{"title": "Real Challenges", "description": "Work on actual problems"}, {"title": "Expert Mentorship", "description": "Learn from the best"}, {"title": "Win Rewards", "description": "Get recognized and rewarded"}]}},
  {"type": "cta", "data": {"title": "Ready to start building?", "buttonText": "View Challenges", "buttonLink": "/challenges"}}
]'::jsonb),

('challenges', 'Challenges', 'List of active and upcoming real-world Kadena challenges with brief descriptions.', 'published', 2,
'[
  {"type": "header", "data": {"title": "Active Challenges", "description": "Browse and participate in current challenges"}},
  {"type": "challenge_list", "data": {"source": "database", "filter": "active"}}
]'::jsonb),

('how-it-works', 'How It Works', 'Step-by-step flow for how it works: pick a challenge → build MVP → submit → review → rewards.', 'published', 3,
'[
  {"type": "header", "data": {"title": "How It Works", "description": "Your journey from challenge to reward"}},
  {"type": "steps", "data": {"items": [
    {"step": 1, "title": "Pick a Challenge", "description": "Browse active challenges and choose one that interests you"},
    {"step": 2, "title": "Build MVP", "description": "Develop your solution using Kadena blockchain technology"},
    {"step": 3, "title": "Submit Project", "description": "Submit your GitHub repo, demo, and documentation"},
    {"step": 4, "title": "Review Process", "description": "Expert judges evaluate your submission"},
    {"step": 5, "title": "Get Rewards", "description": "Winners receive recognition and rewards"}
  ]}}
]'::jsonb),

('submit-project', 'Submit Project', 'Submission form for teams to submit GitHub repo, live demo, and technical explanation.', 'published', 4,
'[
  {"type": "header", "data": {"title": "Submit Your Project", "description": "Share your solution with us"}},
  {"type": "submission_form", "data": {"redirect": "/my-submissions"}}
]'::jsonb),

('winners', 'Winners & Rewards', 'Showcase past winners, rewards, judging outcomes, and recognition.', 'published', 5,
'[
  {"type": "header", "data": {"title": "Winners & Rewards", "description": "Celebrating successful projects"}},
  {"type": "winners_list", "data": {"source": "database"}},
  {"type": "rewards_info", "data": {"title": "Reward Structure", "description": "Learn about our rewards and recognition program"}}
]'::jsonb),

('team-governance', 'Team & Governance', 'Founder, Core team, advisors, and judging governance to establish credibility and transparency.', 'published', 6,
'[
  {"type": "header", "data": {"title": "Team & Governance", "description": "Meet the people behind Kadena Devs"}},
  {"type": "team_grid", "data": {"teams": [
    {"category": "Founders", "members": []},
    {"category": "Core Team", "members": []},
    {"category": "Advisors", "members": []},
    {"category": "Judges", "members": []}
  ]}},
  {"type": "governance", "data": {"title": "Governance Model", "description": "How we ensure fairness and transparency"}}
]'::jsonb),

('faq', 'FAQ', 'Common questions about eligibility, judging, rewards, timelines, and submissions.', 'published', 7,
'[
  {"type": "header", "data": {"title": "Frequently Asked Questions", "description": "Find answers to common questions"}},
  {"type": "faq_list", "data": {"items": [
    {"question": "Who can participate?", "answer": "Anyone with blockchain development skills can participate."},
    {"question": "How are projects judged?", "answer": "Projects are evaluated based on innovation, technical implementation, and real-world applicability."},
    {"question": "What are the rewards?", "answer": "Rewards vary by challenge and include cash prizes, recognition, and potential partnerships."},
    {"question": "What is the submission deadline?", "answer": "Each challenge has its own deadline listed on the challenge page."}
  ]}}
]'::jsonb),

('contact', 'Contact', 'Contact form and official communication channels.', 'published', 8,
'[
  {"type": "header", "data": {"title": "Contact Us", "description": "Get in touch with the Kadena Devs team"}},
  {"type": "contact_form", "data": {"fields": ["name", "email", "subject", "message"]}},
  {"type": "contact_info", "data": {"email": "hello@kadenadevs.com", "discord": "kadenadevs", "twitter": "@kadenadevs"}}
]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Verify the pages were created
SELECT slug, title, status FROM pages ORDER BY order_index;
