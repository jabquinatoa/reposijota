import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
// Jose Quinatoa 4to "B"
export const validateTask = (schema: AnyZodObject) => {
    // PARTE 1: Configuración / Fábrica del Middleware
    // Esta parte recibe el esquema de validación como parámetro y retorna 
    // la función asíncrona real que Express usará como middleware. 
    // Esto permite que el middleware sea reutilizable con diferentes esquemas.
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // PARTE 2: Ejecución y Validación Exitosa (El camino feliz)
            // Intenta validar lo que viene en el cuerpo de la petición (req.body) 
            // contra el esquema de Zod. Si los datos son correctos y pasan la prueba,
            // se ejecuta next() para permitir que la petición continúe hacia el controlador.
            schema.parse(req.body); 
            next();
        } catch (error) {
            // PARTE 3: Manejo de Errores
            // Si la validación de la Parte 2 falla, el código cae aquí. 
            // Verifica si el error es de Zod (ZodError) y, de ser así, responde al 
            // cliente con un código HTTP 400 (Bad Request) y una lista de los campos 
            // que fallaron. Si es otro tipo de error, lo pasa al manejador global con next(error).
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