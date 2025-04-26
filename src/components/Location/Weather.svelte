<script lang="ts">
  import { getWeather, getWeatherIcon } from "./WeatherUtil";
  import Icon from "@iconify/svelte";
</script>

{#await getWeather()}
  <p>Loading...</p>
{:then weatherData}
  <Icon
    icon={getWeatherIcon(weatherData.weatherCode)}
    class={"inline-block text-[1.5rem]"}
  />
  {Math.round(weatherData.temperature2mMax)} &deg;C
{:catch error}
  <p>Error: {error.message}</p>
{/await}
