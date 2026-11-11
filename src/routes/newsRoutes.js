import { Router } from 'express';
import { getDistricts, getNews, getStats, triggerScrape } from '../controllers/newsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/news', asyncHandler(getNews));
router.get('/districts', getDistricts);
router.get('/stats', asyncHandler(getStats));
router.post('/scrape/trigger', asyncHandler(triggerScrape));

export default router;
