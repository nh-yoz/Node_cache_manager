import cors from 'cors'
import express, { Request, Response } from 'express';
import { config } from '~/config';
import car from '~/routes/car';
import errorMiddleware from './middlewares/errorMiddleware';
import CacheManager from './utils/cacheManager';

/**
 * New express app
 */
const app = express();

/**
 * Parse bodies of json requests
 */
app.use(express.json());

/**
 * Use cors. All domains are allowed.
 */
app.use(cors());

export const cacheManager = new CacheManager();

/**
 * Routes
 */
app.use('/cars', car);

/**
 * Use the tryout with swagger-ui
 */
import { swaggerSpecification, swaggerOptions } from '../swagger.config';
import swaggerUi from 'swagger-ui-express';
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpecification, swaggerOptions));

/**
 * Default route if no other match
 */
app.all('*', (req: Request, res: Response) => 
    res.status(404).json({ status: 404, message: 'Path or method not found' }) 
);

/**
 * Capture and format thrown errors
 */
app.use(errorMiddleware);

/**
 * Listen for requests
 */
app.listen(config.API_PORT, () => console.log(`Ready to handle requests at http://localhost:${config.API_PORT}`));
