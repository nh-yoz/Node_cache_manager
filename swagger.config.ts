const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Cache manager (local)',
            version: '1.0.0',
            description: '## API documentation for cache-manager with tryout\n\n' +
                'Cache is only used by the route /cars/{id}.\n\n' +
                'The cache\'s time to live is in this example set to 10 seconds.\n\n' +
                'To simulate a db-call, all responses from an api-call not using a cached value are delayed between 50 and 100 ms: When trying out, see the response-time field of the result.'
        },
        host: 'localhost:3000',
        basePath: '/',
        servers: [
            {
                url: 'http://localhost:3000/'
            }
        ]
    },
    apis: ['./doc/**/*.yaml'],
};

const swaggerOptions = {
    swaggerOptions: {
        displayRequestDuration: true, // on each request in try out, shows the response-time
        defaultModelsExpandDepth: -1, // will hide the list of the models at the bottom of page
        filter: false // disables a field to filter the tags
    }
}

const swaggerSpecification = swaggerJsdoc(options);
export { swaggerSpecification, swaggerOptions };
