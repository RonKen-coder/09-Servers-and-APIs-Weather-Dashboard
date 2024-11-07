// import fs from 'node:fs/promises';
import dotenv from 'dotenv';
dotenv.config();


// TODO: Define an interface for the Coordinates object (lat and lon properties)
interface latitudeImage {
  url: string;
  title: string;
}

interface latitude {
  id: string;
  fullName: string;
  description: string;
  url: string;
  designation: string;
  images: latitudeImage[];
}

interface longitiude {
  id: string;
  fullName: string;
  description: string;
  url: string;
  designation: string;
  images: latitudeImage[];
}

// TODO: Define a class for the Weather object (city name, the date, an icon representation of weather conditions, a description of the weather for the icon's alt tag, the temperature, the humidity, and the wind speed)

class Weather {
  city_name: string;
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  wind_speed: number;

  constructor(city_name: string, date: string, icon: string, description: string, temperature: number, humidity: number, wind_speed: number) {
    this.city_name = city_name;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.wind_speed = wind_speed;
  }

  displayInfo(): string {
    return (
      `City: ${this.city_name}\n` +
      `Date: ${this.date}\n` +
      `Weather Icon: ${this.icon}\n` +
      `Description: ${this.description}\n` +
      `Temperature: ${this.temperature}°C\n` +
      `Humidity: ${this.humidity}%\n` +
      `Wind Speed: ${this.wind_speed} km/h\n`
    );
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private cityName: string;

  constructor(cityName: string) {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method
  //private async fetchLocationData(query: string) {}
  async fetchLocationData(query: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
      );
      const foundCoords = await response.json();

      return this.destructureLocationData(foundCoords[0].lat, foundCoords[0].lon);
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }

  // TODO: Create destructureLocationData method

private destructureLocationData(locationData: any): Coordinates {
  if (!locationData || locationData.length === 0) {
    throw new Error('Invalid location data');
  }
  const { lat, lon } = locationData[0];
  return { latitude: lat, longitude: lon };
}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    return `${this.cityName}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.name,
      new Date(response.dt * 1000).toISOString(),
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.main.humidity,
      response.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    // Example method logic to build forecast array; could be extended with more data
    return weatherData.map((data: any) => ({
      ...currentWeather,
      date: new Date(data.dt * 1000).toISOString(),
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      description: data.weather[0].description,
    }));
  }

  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherResponse = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherResponse);
  }
}
}

export default new WeatherService();
function __init__(self: Window & typeof globalThis, city_name: any, date: any, icon: any, description: any, temperature: any, humidity: any, wind_speed: any) {
  throw new Error('Function not implemented.');
}

