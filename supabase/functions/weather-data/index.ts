import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Calculate AQI from PM2.5 concentration using India's National Air Quality Index (NAQI) breakpoints
function calculateNAQIFromPM25(pm25: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },       // Good
    { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },     // Satisfactory
    { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },    // Moderately Polluted
    { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },   // Poor
    { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },  // Very Poor
    { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },  // Severe
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow;
      return Math.round(aqi);
    }
  }

  // If PM2.5 exceeds 500, cap AQI at 500
  return pm25 > 500 ? 500 : 0;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();
    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OPENWEATHER_API_KEY is not configured');
    }

    console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);

    // Fetch current weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('OpenWeather API error:', weatherResponse.status, errorText);
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', weatherData.name);

    // Fetch air quality data
    const airQualityResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );

    let aqi = 0;
    if (airQualityResponse.ok) {
      const airQualityData = await airQualityResponse.json();
      // Get PM2.5 concentration from components
      const pm25 = airQualityData.list[0]?.components?.pm2_5 || 0;
      // Calculate NAQI from PM2.5 using India's National Air Quality Index breakpoints
      aqi = calculateNAQIFromPM25(pm25);
      console.log(`PM2.5: ${pm25} µg/m³, Calculated NAQI: ${aqi}`);
    }

    // Calculate risk levels based on environmental data
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const rainfall = weatherData.rain?.['1h'] || 0;
    const windSpeed = weatherData.wind.speed * 3.6; // Convert m/s to km/h

    // Risk assessment logic
    const floodRisk = rainfall > 10 ? 'High' : rainfall > 5 ? 'Moderate' : 'Low';
    const heatwaveRisk = temperature > 40 ? 'High' : temperature > 35 ? 'Moderate' : 'Low';
    const airQualityRisk = aqi > 150 ? 'High' : aqi > 100 ? 'Moderate' : 'Low';
    const stormRisk = windSpeed > 50 ? 'High' : windSpeed > 30 ? 'Moderate' : 'Low';

    const response = {
      location: weatherData.name,
      temperature: Math.round(temperature),
      humidity,
      rainfall: Math.round(rainfall * 10) / 10,
      windSpeed: Math.round(windSpeed),
      aqi: Math.round(aqi),
      description: weatherData.weather[0].description,
      risks: {
        flood: floodRisk,
        heatwave: heatwaveRisk,
        airQuality: airQualityRisk,
        storm: stormRisk,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('Sending response:', response);

    // Store weather data in history table
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const { error: insertError } = await supabase
          .from('weather_history')
          .insert({
            location: weatherData.name,
            latitude: lat,
            longitude: lon,
            temperature: Math.round(temperature),
            humidity,
            rainfall: Math.round(rainfall * 10) / 10,
            wind_speed: Math.round(windSpeed),
            aqi: Math.round(aqi),
            description: weatherData.weather[0].description,
            flood_risk: floodRisk,
            heatwave_risk: heatwaveRisk,
            air_quality_risk: airQualityRisk,
            storm_risk: stormRisk,
          });

        if (insertError) {
          console.error('Error storing weather history:', insertError);
        } else {
          console.log('Weather data stored in history');
        }
      }
    } catch (historyError) {
      console.error('Failed to store weather history:', historyError);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weather-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
