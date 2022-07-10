import express, { NextFunction, Request, Response } from 'express';
import CarController from '~/controllers/CarController';
import Car from '~/types';
import { cacheManager } from '~/index';
import bodyValidationMiddleware from '~/middlewares/bodyValidatonMiddleware'

const router = express.Router();
const TTL = 10000; // TimeToLive for each cached value, in ms.

/**
 * Get all cars in db.
 */ 
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const cars = await CarController.findAll();
        return res.status(200).json(cars);
    } catch(errors) {
        next(errors)
    }
});

/**
 * Get the car having the id defined in path. The id must be an integer not starting with a 0.
 */ 
router.get('/:id([1-9]{1}[0-9]{0,})', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        // Get value from cache. If not there, the callback will get the value and put it into cache
        const car = await cacheManager.get(`cars/${id}`, { ttl: TTL, valueOrFunction: () => CarController.findOne(id) })
        res.status(200).json(car);
    } catch(errors) {
        next(errors)
    }
});

/**
 * Add a car to db. The request body must be a json-object:
 * {
 *   brand: string,
 *   country: string
 * }
 * 
 * The pattern '^[A-Z]{1}[a-z]*( [A-Z]{1}[a-z]*)*$' is only given for example, change to whatever suits you needs
 */ 
router.post('/', bodyValidationMiddleware([{property: 'brand', type: 'string'}, {property: 'country', type: 'string', pattern: '^[A-Z]{1}[a-z]*( [A-Z]{1}[a-z]*)*$'}]), async (req: Request, res: Response, next: NextFunction) => {
    try {       
        const car = await CarController.add(req.body as Car);
        res.status(201).json(car);
    } catch(errors) {
        next(errors)
    }
});

/**
 * Update the car having the id defined in path. The id must be an integer not starting with a 0.
 * The request body must be a json-object:
 * {
 *   brand: string,
 *   country: string
 * }
 * 
 * The pattern '^[A-Z]{1}[a-z]+$' is only given for example, incomplete to describe name of countries
 */ 
router.put('/:id([1-9]{1}[0-9]{0,})', bodyValidationMiddleware([{property: 'brand', type: 'string'}, {property: 'country', type: 'string', pattern: '^[A-Z]{1}[a-z]*( [A-Z]{1}[a-z]*)*$'}]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const car = await CarController.update(id, req.body);
        // The car has been modified, delete the cached entry if exists
        cacheManager.delete(`cars/${id}`)
        res.status(200).json(car);
    } catch(errors) {
        next(errors)
    }
});

/**
 * Delete the car having the id defined in path. The id must be an integer not starting with a 0. 
 */ 
router.delete('/:id([1-9]{1}[0-9]{0,})', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await CarController.delete(id);
        // The car has been deleted, delete the cached entry if exists
        cacheManager.delete(`cars/${id}`)
        res.status(204).send();
    } catch(errors) {
        next(errors)
    }
});

export default router;
