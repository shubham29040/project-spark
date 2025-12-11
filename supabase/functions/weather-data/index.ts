import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate AQI from PM2.5 concentration using EPA standard
function calculateAQIFromPM25(pm25: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 12, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow;
      return Math.round(aqi);
    }
  }

  // If PM2.5 exceeds 500.4, cap AQI at 500
  return pm25 > 500.4 ? 500 : 0;
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
      // Calculate proper AQI from PM2.5 using EPA standard
      aqi = calculateAQIFromPM25(pm25);
      console.log(`PM2.5: ${pm25} µg/m³, Calculated AQI: ${aqi}`);
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
