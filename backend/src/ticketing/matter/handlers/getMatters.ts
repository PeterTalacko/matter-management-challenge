import { Request, Response } from 'express';
import { z } from 'zod';
import logger from '../../../utils/logger.js';
import { MatterListResponse } from '../../types.js';
import { getCache, setCache } from '../cache/';
import { MatterService } from '../service/matter_service.js';

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 25)),
  sortBy: z.string().optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional().default(''),
});

function normalizeCacheKey(params: z.infer<typeof querySchema>): string {
  return `getMatters?page=${params.page},limit=${params.limit},sortBy=${params.sortBy},sortOrder=${params.sortOrder},search=${params.search}`;
}

export async function getMatters(req: Request, res: Response): Promise<void> {
  try {
    const params = querySchema.parse(req.query);

    const cacheKey = normalizeCacheKey(params);
    const cachedResult = getCache<MatterListResponse[]>(cacheKey);
    if (cachedResult) {
      res.json(cachedResult);
      return;
    }

    const matterService = new MatterService();
    const result = await matterService.getMatters(params);

    setCache(cacheKey, result);

    res.json(result);
  } catch (error) {
    logger.error('Error fetching matters', { error });

    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: error.errors,
      });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}
