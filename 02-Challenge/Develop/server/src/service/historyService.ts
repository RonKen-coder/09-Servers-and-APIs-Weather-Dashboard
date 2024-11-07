import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

//TODO: Define a City class with name and id properties

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  getHistory() {
    throw new Error('Method not implemented.');
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  private async read(): Promise<string> {
    return await fs.readFile('db/db.json', 'utf-8');
  }
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }


  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}

  private async write(cities: City[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }

  async addCity(city: string) {
    if (!city) {
      throw new Error('city cannot be blank');
    }
    const newCity: City = { name: city, id: uuidv4() };

    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities: City[]) => this.write(filteredCities));
  }
}

export default new HistoryService();
