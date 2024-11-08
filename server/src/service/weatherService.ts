// import fs from 'node:fs/promises';
import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();


// Define an interface for the Coordinates object (lat and lon properties)
interface Coordinates {
  latitude: number;
  longitude: number;
}
// interface latitudeImage {
//   url: string;
//   title: string;
// }

// interface latitude {
//   id: string;
//   fullName: string;
//   description: string;
//   url: string;
//   designation: string;
//   images: latitudeImage[];
// }

// interface longitiude {
//   id: string;
//   fullName: string;
//   description: string;
//   url: string;
//   designation: string;
//   images: latitudeImage[];
// }

// TODO: Define a class for the Weather object (city name, the date, an icon representation of weather conditions, a description of the weather for the icon's alt tag, the temperature, the humidity, and the wind speed)

class Weather {
  city: string;
  date: Dayjs | string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  wind_speed: number;

  constructor(city: string, date: string, icon: string, description: string, temperature: number, humidity: number, wind_speed: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temperature = temperature; // temp
    this.humidity = humidity;
    this.wind_speed = wind_speed; // wind || speed
  }

  displayInfo(): string {
    return (
      `City: ${this.city}\n` +
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
  private city: string;

  constructor(city: string) {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = city;
  }

  // TODO: Create fetchLocationData method
  //private async fetchLocationData(query: string) {}
  async fetchLocationData(query: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
      );
      const foundCoords = await response.json();

      return foundCoords;
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
  // return new Coordinates(lat, lon);
}

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.city);
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
    const date = dayjs.unix(response.dt).format('M/D/YYYY');
    
    return new Weather(
      this.city,
      date,
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.main.humidity,
      response.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

    const filteredWeatherData = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });

    // Rather than looping through all the weather data, you want to use a filter method to return JUST the 5 day forecast
    const forecastArray = filteredWeatherData.map((weather) => {
      return new Weather(
        currentWeather.city,
        dayjs.unix(weather.dt).format('M/D/YYYY'),
        weather.weather[0].icon,
        weather.weather[0].description,
        weather.main.temp,
        weather.main.humidity,
        weather.wind.speed
      );
    });

    return forecastArray // forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherResponse.list[0]);
    // console.log('weatherResponse:', weatherResponse);
    const forecastArray = this.buildForecastArray(currentWeather, weatherResponse.list);

    return forecastArray;
  }
}

export default new WeatherService('DefaultCityName');