import type { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {   
    if (err.length > 0) {
        err.status = 400;
        err.message = err.toString();
    }
    return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
        data: err.data || undefined
    });
};

export default errorMiddleware;
