import Car from '~/types'

/**
 * On imagine que ce sont des données reçues de la base de données
 *
 * On spécifie ici que `animals` est un tableau contenant des `Animal`
 */

const nowIso = () => new Date().toISOString();

export const cars: Car[] = [
    { id: 1, brand: 'Ford', country: 'USA', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 2, brand: 'Lamborghini', country: 'Italy', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 3, brand: 'Ferrari', country: 'Italy', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 4, brand: 'Volvo', country: 'Sweden', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 5, brand: 'Fiat', country: 'Italy', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 6, brand: 'Porsche', country: 'Germany', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 7, brand: 'Skoda', country: 'Czech Republic', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 8, brand: 'Seat', country: 'Spain', createdAt: nowIso(), updatedAt: nowIso() },
    { id: 9, brand: 'Peugeot', country: 'France', createdAt: nowIso(), updatedAt: nowIso() }
]