import { fetchWeatherApi } from "openmeteo";

export async function getWeather(): Promise<WeatherData> {
  const params = {
    latitude: 55.6759,
    longitude: 12.5655,
    daily: ["weather_code", "temperature_2m_max"],
    timezone: "Europe/Berlin",
    forecast_days: 1,
    models: "dmi_seamless",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const daily = response.daily()!;

  return {
    time: new Date((Number(daily.time()) + utcOffsetSeconds) * 1000),
    weatherCode: daily.variables(0)!.valuesArray()![0],
    temperature2mMax: daily.variables(1)!.valuesArray()![0],
  };
}

export type WeatherData = {
  time: Date;
  weatherCode: number;
  temperature2mMax: number;
};

export function getWeatherIcon(weatherCode: number) {
  switch (weatherCode) {
    case 0:
      return "wi:day-sunny";
    case 1:
      return "wi:wi:day-sunny-overcast";
    case 2:
      return "wi:day-cloudy";
    case 3:
      return "wi:cloud";
    case 45:
      return "wi:day-fog";
    case 48:
      return "wi:day-fog";
    case 51:
      return "wi:day-cloudy";
    case 53:
      return "wi:day-cloudy";
    case 55:
      return "wi:day-cloudy";
    case 56:
      return "wi:day-sleet";
    case 57:
      return "wi:day-sleet";
    case 61:
      return "wi:day-rain";
    case 63:
      return "wi:day-rain";
    case 65:
      return "wi:day-rain";
    case 66:
      return "wi:day-sleet";
    case 67:
      return "wi:day-sleet";
    case 71:
      return "wi:day-snow";
    case 73:
      return "wi:day-snow";
    case 75:
      return "wi:day-snow";
    case 77:
      return "wi:day-snow";
    case 80:
      return "wi:day-snow";
    case 81:
      return "wi:day-snow";
    case 82:
      return "wi:day-snow";
    default:
      return "wi:day-cloudy";
  }
}
