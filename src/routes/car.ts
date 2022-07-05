import express, { NextFunction, Request, Response } from 'express';
import CarController from '~/controllers/CarController';
import Car from '~/types';
import HttpError from '~/utils/HttpError';
import cacheManager from '~/utils/cacheManager';
import bodyValidationMiddleware from '~/middlewares/bodyValidatonMiddleware'

const router = express.Router();
const TTL = 5000;

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const cars = await CarController.findAll();
        return res.status(200).json(cars);
    } catch(errors) {
        next(errors)
    }
});

router.get('/:id([1-9]{1}[0-9]{0,})', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const car = await cacheManager.get(`cars/${id}`, { ttl: TTL, valueOrFunction: () => CarController.findOne(id) })
        res.status(200).json(car);
    } catch(errors) {
        next(errors)
    }
});

router.post('/', bodyValidationMiddleware([{name: 'brand', type: 'string'}, {name: 'country', type: 'string', pattern: '[A-Z]{1}\d*'}]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const car = await CarController.add(req.body as Car);
        res.status(201).json(car);
    } catch(errors) {
        next(errors)
    }
});

router.put('/:id([1-9]{1}[0-9]{0,})', bodyValidationMiddleware([{name: 'brand', type: 'string'}, {name: 'country', type: 'string', pattern: '[A-Z]{1}\d*'}]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (Object.keys(req.body).length !== 2 || Object.keys(req.body).some(key => !['brand', 'country'].includes(key))) {
            throw new HttpError(400, 'Bad request');
        }
        const id = parseInt(req.params.id);
        const car = await CarController.update(id, req.body);
        cacheManager.remove(`cars/${id}`)
        res.status(200).json(car);
    } catch(errors) {
        next(errors)
    }
});

router.delete('/:id([1-9]{1}[0-9]{0,})', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await CarController.delete(id);
        cacheManager.remove(`cars/${id}`)
        res.status(204).send();
    } catch(errors) {
        next(errors)
    }
});

export default router;
