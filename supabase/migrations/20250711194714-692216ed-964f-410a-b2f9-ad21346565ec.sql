
-- Create users table to store participant information
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, mobile)
);

-- Create spins table to store complete spin history
CREATE TABLE public.spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  segment_id INTEGER NOT NULL,
  offer_label TEXT NOT NULL,
  spin_result TEXT NOT NULL,
  round_number INTEGER NOT NULL DEFAULT 0,
  spin_number_in_round INTEGER NOT NULL,
  total_spin_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_state table for global counters and settings
CREATE TABLE public.system_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offer_segments table for round-based offer distribution tracking
CREATE TABLE public.offer_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_number INTEGER NOT NULL,
  label TEXT NOT NULL,
  max_per_round INTEGER NOT NULL,
  current_count INTEGER NOT NULL DEFAULT 0,
  round_number INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(segment_number, round_number)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_segments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (since this is a public kiosk app)
CREATE POLICY "Allow public access to users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public access to spins" ON public.spins FOR ALL USING (true);
CREATE POLICY "Allow public access to system_state" ON public.system_state FOR ALL USING (true);
CREATE POLICY "Allow public access to offer_segments" ON public.offer_segments FOR ALL USING (true);

-- Insert initial system state
INSERT INTO public.system_state (key, value) VALUES 
  ('total_spins', '0'),
  ('current_round', '0'),
  ('spins_in_current_round', '0');

-- Insert initial offer segments for round 0
INSERT INTO public.offer_segments (segment_number, label, max_per_round, current_count, round_number) VALUES
  (1, '10% OFF', 25, 0, 0),
  (2, '2% OFF', 20, 0, 0),
  (3, '0.50g silver coin', 15, 0, 0),
  (4, '1 Gold Coin', 5, 0, 0),
  (5, '15% OFF', 15, 0, 0),
  (6, '5% OFF', 15, 0, 0),
  (7, '10% OFF Premium', 3, 0, 0),
  (8, '50% OFF', 2, 0, 0);

-- Create indexes for performance
CREATE INDEX idx_users_mobile ON public.users(mobile);
CREATE INDEX idx_users_name_mobile ON public.users(name, mobile);
CREATE INDEX idx_spins_user_id ON public.spins(user_id);
CREATE INDEX idx_spins_total_spin_number ON public.spins(total_spin_number);
CREATE INDEX idx_spins_round_number ON public.spins(round_number);
CREATE INDEX idx_system_state_key ON public.system_state(key);
CREATE INDEX idx_offer_segments_round ON public.offer_segments(round_number);
CREATE INDEX idx_offer_segments_segment_round ON public.offer_segments(segment_number, round_number);
