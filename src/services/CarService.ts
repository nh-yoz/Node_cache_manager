import { cars } from '~/data'
import Car from '~/types';

export class CarsService {
    cars: Car[] = cars;
    ids: number[] = cars.map(car => car.id);

    async findAll(): Promise<Car[]> {
        return new Promise(resolve => resolve(this.cars));
    } 


    async findOne(id: number): Promise<Car | undefined> {
        return new Promise((resolve, reject) => {
            try {
                const car = this.cars.find(car => car.id === id);
                if (car) {
                    resolve(Object.assign(new Car, car));
                } else {
                    resolve(undefined);
                }
            } catch (err) {
                reject(err);
            }
        });
    }


    async create(carData: Omit<Car, 'id'>): Promise<Car> {
        return new Promise((resolve, reject) => {
            try {
                const newCar = Object.assign(new Car, carData);               
                newCar.id = (this.ids.at(-1) ?? 0) + 1; 
                this.cars.push(newCar);
                this.ids.push(newCar.id);
                resolve(newCar);
            } catch(err) {
                reject(err);
            }
        });
    };

    async update(id:number, carData: Omit<Car, 'id'>): Promise<Car> {
        return new Promise((resolve, reject) => {
            const idx = cars.findIndex(car => car.id === id);
            if (idx === -1) {
                reject(new Error('Entity does not exist'));
            }
            const existingCar = cars[idx]; 
            cars[idx] = { ...Object.assign(existingCar, carData), id: existingCar.id };
            resolve(cars[idx]);
        });
    };

    async delete(id: number): Promise<Car> {
        return new Promise((resolve, reject) => {
            const idx = cars.findIndex(car => car.id === id);
            if (idx === -1) {
                reject(new Error('Entity does not exist'));
            }
            resolve(this.cars.splice(idx, 1)[0]);
        });
    }

}
