import Car from "~/types";
import { CarsService } from "~/services/CarService";
import HttpError from "~/utils/HttpError";

const service = new CarsService()

class CarController {
    public static async add(car: Car) {
        return await service.create(car);
    }

    public static async findAll() {
        return await service.findAll();
    }

    public static async findOne(id: number) {
        const car =  await service.findOne(id);
        if (!car) {
            throw new HttpError(404, 'Entity not found');
        }
        return car;
    }

    public static async update(id: number, carData: Car) {
        await this.findOne(id);
        return service.update(id, carData);
    }

    public static async delete(id: number) {        
        await this.findOne(id);
        return service.delete(id);
    }
}

export default CarController;