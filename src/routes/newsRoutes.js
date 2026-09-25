import { Router } from 'express';
import { getDistricts, getNews, triggerScrape } from '../controllers/newsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/news', asyncHandler(getNews));
router.get('/districts', getDistricts);
router.post('/scrape/trigger', asyncHandler(triggerScrape));

export default router;
