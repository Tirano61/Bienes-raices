


import express from 'express';
import { admin, crear, guardar } from "../controllers/propiedadesController.js";
import { body } from "express-validator";

const router = express.Router();

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear', 
    body('titulo').notEmpty().withMessage('El título es obligatorio'),    
    guardar
);


export default router;