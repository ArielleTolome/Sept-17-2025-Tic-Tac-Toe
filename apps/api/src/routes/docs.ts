import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const router = Router();

const openApiPath = resolve(process.cwd(), 'openapi.json');
const document = JSON.parse(readFileSync(openApiPath, 'utf-8'));

router.use('/', swaggerUi.serve, swaggerUi.setup(document, { explorer: true }));
router.get('/openapi.json', (_req, res) => {
  res.json(document);
});

export default router;
