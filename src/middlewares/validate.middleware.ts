import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateTask = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Intenta validar lo que viene en el cuerpo de la petición
            schema.parse(req.body);
            next(); 
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    status: "error_validacion",
                    errors: error.errors.map(err => ({
                        campo: err.path[0],
                        mensaje: err.message
                    }))
                });
                return;
            }
            next(error); 
        }
    };
};