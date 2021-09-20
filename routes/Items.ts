
// Dependencias
import { Router } from "express";
import asyncHandler from "express-async-handler";

/**
 * @desc Controlador
 */
import * as itemsController from "../controllers/Items";

// Logged the adding of this route
console.log( "Items.js: adding routes..." );

/**
 * @desc Items
 */
const api: Router = Router();

api.get( "/api/items",      asyncHandler( itemsController.getItems ) );
api.get( "/api/items/:id",  asyncHandler( itemsController.getItem ) );

export default api;

