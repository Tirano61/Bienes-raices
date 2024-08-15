


import express from 'express';
import { admin, crear, guardar } from "../controllers/propiedadesController.js";
import { body } from "express-validator";

const router = express.Router();

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear', 
    body('titulo').notEmpty().withMessage('El título es obligatorio'),    
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria')
        .isLength({max: 200}).withMessage('La descripción es muy larga'), 
    body('categoria').isNumeric().withMessage('Selecciona una Categoría'),       
    body('precio').isNumeric().withMessage('Selecciona un rango de Precios'),       
    body('habitaciones').isNumeric().withMessage('Selecciona cantidad de Habitaciones'),       
    body('estacionamiento').isNumeric().withMessage('Selecciona los Estacionamientos'),       
    body('wc').isNumeric().withMessage('Selecciona la cantidad de Baños'),       
    body('lat').notEmpty().withMessage('Ubica la propiiedad en el mapa'),       
    guardar
);


export default router;