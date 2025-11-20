import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      // Convert AQI scale (1-5) to more standard 0-500 scale
      aqi = airQualityData.list[0].main.aqi * 50;
      console.log('AQI data received:', aqi);
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
