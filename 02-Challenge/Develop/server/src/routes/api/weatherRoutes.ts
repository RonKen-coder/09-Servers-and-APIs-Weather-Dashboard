import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    
  // TODO: GET weather data from city name
  await historyService.addCity(cityName);
  const weatherData = await weatherService.getWeatherForCity(cityName);
  console.log(weatherData);

  res.status(200).json(weatherData);
} catch (error) {
  res.status(500).json({ error: 'An error occurred while retrieving weather data.' });
}
});

// TODO: save city to search history

// TODO: GET search history
router.get('/history', async (_: Request, res: Response) => {
  try {
    const history = await historyService.getCities();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching search history.' });
  }
});
// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;


