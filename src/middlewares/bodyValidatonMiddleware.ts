import type { RequestHandler } from 'express';

enum ParamTypes { 'string', 'integer', 'float', 'object', 'array', 'boolean', 'any' }; // available types

type Param = { property: string }
    & ({ type: ParamTypes, pattern: undefined } | { type: 'string', pattern?: string });

/*
 * Object holding the typecheck functions with the type as keys
 */
const checkType: {[key: string]: (value: unknown) => boolean} = {
    'string': (value: unknown) => typeof value === 'string',
    'float': (value: unknown) => typeof value === 'number',
    'integer': (value: unknown) => typeof value === 'number' && Number.isInteger(value),
    'boolean': (value: unknown) => typeof value === 'boolean',
    'object': (value: unknown) => typeof value === 'object' && !Array.isArray(value) && value !== null,
    'array': (value: unknown) => Array.isArray(value)
}

/**
 * Bodyvalidation. Checks if
 * - all required parameters are present in body
 * - only required or optional parameters are present in body (non defined parameters are not allowed)
 * - the types for each parameter are good
 * @param {Param[]} requiredParams - The required properties in body with type
 * @param {Param[]} optionalParams - The optional properties in body with type
 * 
 * If a type is 'string' an additional reqExp pattern may be defined.
 */
const bodyValidationMiddleware = (requiredParams: Param[] = [], optionalParams: Param[] = []) => {
    const middleware: RequestHandler = (req, res, next) => {
        try {
            const allowedProperties = [ ...requiredParams, ...optionalParams ]; // All allowed properties
            const allowedPropertyNames = allowedProperties.map(param => param.property); // Names of the allowed properties
            const patternProperties = allowedProperties.filter(property => property.pattern); // The properties for which a pattern is supplied 
            
            // Check for invalid properties (not in allowedProperties)
            Object.keys(req.body).forEach(key => {
                if (!allowedPropertyNames.includes(key)) {                    
                    throw `Invalid property: ${key}`;
                }
            })

            // Check if all required properties are present and of the right type
            requiredParams.forEach(param => {
                if(!Object.keys(req.body).includes(param.property)) {
                    throw `Missing property: ${param.property}`;
                }               
                if (!checkType[param.type](req.body[param.property])) {
                    throw `The property ${param.property} should be of type ${param.type}`;
                }
            });

            // Check if any optional properties are present and of the right type
            optionalParams.forEach(param => {
                if(Object.keys(req.body).includes(param.property) && !checkType[param.type](req.body[param.property])) {
                    throw `The property ${param.property} should be of type ${param.type}`;
                }
            });

            // Check for bad patterns
            patternProperties.forEach(property => {
                if (Object.keys(req.body).includes(property.property)) {
                    try {
                        var reg = new RegExp(property.pattern as string)
                    } catch {
                        console.error (`In bodyValidationMiddleware: Invalid pattern ${property.pattern}`);
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    }
                    if (!reg.exec(req.body[property.property])) {
                        throw `The property ${property.property} does not respect the pattern ${property.pattern}`;
                    }
                }
            })

            // test passed ok
            return next();
        } catch(err) {
            return res.status(400).json({ status: 400, message: 'Bad request', data: err });
        }
    };
    return middleware;
};

export default bodyValidationMiddleware;
