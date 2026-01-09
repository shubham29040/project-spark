-- Create a table for storing weather history
CREATE TABLE public.weather_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  temperature DECIMAL(5, 2) NOT NULL,
  humidity INTEGER NOT NULL,
  rainfall DECIMAL(6, 2) NOT NULL DEFAULT 0,
  wind_speed DECIMAL(6, 2) NOT NULL,
  aqi INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  flood_risk TEXT NOT NULL DEFAULT 'Low',
  heatwave_risk TEXT NOT NULL DEFAULT 'Low',
  air_quality_risk TEXT NOT NULL DEFAULT 'Low',
  storm_risk TEXT NOT NULL DEFAULT 'Low',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weather_history ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (weather data is public)
CREATE POLICY "Weather history is publicly readable"
ON public.weather_history
FOR SELECT
USING (true);

-- Create policy for edge function to insert data (using service role)
CREATE POLICY "Allow service role to insert weather data"
ON public.weather_history
FOR INSERT
WITH CHECK (true);

-- Create index for efficient time-based queries
CREATE INDEX idx_weather_history_recorded_at ON public.weather_history(recorded_at DESC);
CREATE INDEX idx_weather_history_location ON public.weather_history(location);

-- Create a composite index for location + time queries
CREATE INDEX idx_weather_history_location_time ON public.weather_history(location, recorded_at DESC);