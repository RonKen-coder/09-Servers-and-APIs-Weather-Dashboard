import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService';
import weatherService from '../../service/weatherService';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    
  // TODO: GET weather data from city name
  await historyService.addCity(city);
  const weatherData = await weatherService.getWeatherForCity(city);

  res.status(200).json(weatherData);
} catch (error) {
  res.status(500).json({ error: 'An error occurred while retrieving weather data.' });
}
});

// TODO: save city to search history

// TODO: GET search history
router.get('/history', async (_: Request, res: Response) => {
  try {
    const history = await historyService.getHistory();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching search history.' });
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;


