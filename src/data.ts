import Car from '~/types'

/**
 * On imagine que ce sont des données reçues de la base de données
 *
 * On spécifie ici que `animals` est un tableau contenant des `Animal`
 */
export const cars: Car[] = [
    { id: 1, brand: 'Ford', country: 'USA' },
    { id: 2, brand: 'Lamborghini', country: 'Italy' },
    { id: 3, brand: 'Ferrari', country: 'Italy' },
    { id: 4, brand: 'Volvo', country: 'Sweden' },
    { id: 5, brand: 'Fiat', country: 'Italy' },
    { id: 6, brand: 'Porsche', country: 'Germany' },
    { id: 7, brand: 'Skoda', country: 'Czech Republic' },
    { id: 8, brand: 'Seat', country: 'Spain' },
    { id: 9, brand: 'Peugeot', country: 'France' }
]