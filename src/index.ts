import cors from 'cors'
import express, { Request, Response } from 'express';
import { config } from '~/config';
import car from '~/routes/car';
import errorMiddleware from './middlewares/errorMiddleware';

/**
 * new express app
 */
const app = express();

/**
 * On dit à Express que l'on souhaite parser le body des requêtes en JSON
 *
 * @example app.post('/', (req) => req.body.prop)
 */
app.use(express.json());

/**
 * On dit à Express que l'on souhaite autoriser tous les noms de domaines
 * à faire des requêtes sur notre API.
 */
app.use(cors());


/**
 * Routes
 */

app.use('/cars', car);

app.all('*', (req: Request, res: Response) => 
    res.status(404).json({status: 404, message: 'Path or method not found'})
);

app.use(errorMiddleware);

/**
 * Gestion des erreurs
 * /!\ Cela doit être le dernier `app.use`
 */
// app.use(ExceptionsHandler)

/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */
app.listen(config.API_PORT, () => console.log('Ready to handle requests.'));