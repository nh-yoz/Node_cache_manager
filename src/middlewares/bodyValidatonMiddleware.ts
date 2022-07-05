import type { RequestHandler } from 'express';

enum ParamTypes { 'string', 'integer', 'float', 'object', 'array', 'boolean', 'any' };

type Param = {
    name: string
} & ({ type: ParamTypes, pattern: undefined } | { type: 'string', pattern?: string });

// const matchPattern = (value: unknown, pattern: string) => typeof value === 'number';

const checkType: {[key: string]: (value: unknown) => boolean} = {
    'string': (value: unknown) => typeof value === 'string',
    'float': (value: unknown) => typeof value === 'number',
    'integer': (value: unknown) => typeof value === 'number' && Number.isInteger(value),
    'boolean': (value: unknown) => typeof value === 'boolean',
    'object': (value: unknown) => typeof value === 'object' && !Array.isArray(value) && value !== null,
    'array': (value: unknown) => Array.isArray(value)
}


const bodyValidationMiddleware = (requiredParams: Param[] = [], optionalParams: Param[] = []) => {
    const middleware: RequestHandler = (req, res, next) => {
        try {
            const validProperties = [ ...requiredParams, ...optionalParams ];
            const validPropertyNames = validProperties.map(param => param.name);
            const patternProperties = validProperties.filter(property => property.pattern);
            // Check for invalid properties
            Object.keys(req.body).forEach(key => {
                if (!validPropertyNames.includes(key)) {                    
                    throw `Invalid property: ${key}`;
                }
            })
            // Check all required params
            requiredParams.forEach(param => {
                if(!Object.keys(req.body).includes(param.name)) {
                    throw `Missing property: ${param.name}`;
                }               
                if (!checkType[param.type](req.body[param.name])) {
                    throw `The property ${param.name} should be of type ${param.type}`;
                }
            });
            // Check optional properties
            optionalParams.forEach(param => {
                if(Object.keys(req.body).includes(param.name) && !checkType[param.type](req.body[param.name])) {
                    throw `The property ${param.name} should be of type ${param.type}`;
                }
            });
            // Check for bad patterns
            patternProperties.forEach(property => {
                if (Object.keys(req.body).includes(property.name)) {
                    try {
                        var reg = new RegExp(property.pattern as string)
                    } catch {
                        console.error (`In bodyValidationMiddleware: Invalid pattern ${property.pattern}`);
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    }
                    if (!reg.exec(req.body[property.name])) {
                        throw `The property ${property.name} does not respect the patter ${property.pattern}`;
                    }
                }
            })
            return next();
        } catch(err) {
            return res.status(400).json({ status: 400, message: 'Bad request', data: err });
        }
    };
    return middleware;
};

export default bodyValidationMiddleware;
