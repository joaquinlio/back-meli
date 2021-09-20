
import { Request, Response } from "express";

/**
 * @desc Utilidades
 */
import * as response from "../utils/Response";

/**
 * @desc Servicios
 */
import * as Meli from "../services/Meli"
import { CONDITIONS } from "../utils/constants";

/**
 * Lista de items
 * @returns void
 */
export async function getItems( req: Request, res: Response): Promise<void> {

    try {
        
        // Parametro de busqueda
        const query = req.query.q as string
         
        if( !query )
            return response.error(req, res, `controllers/Items.ts (getItems): Parametro requerido: 'query'`, 400);
            
        // Obtiene los items del servicio de MELI
        const result = await Meli.searchItems( query )

        if( !result ){
            return response.error(req, res, `controllers/Items.ts (getItems): error al obtener los items`, 500); 
        }

        // Filtra las categorias
        const categories = await getCategories(result);

        if( !categories ){
            return response.error(req, res, `controllers/Items.ts (getItems): error al obtener los items`, 500); 
        }

        // Obtiene los items parseados
        const items = await getParsedItems( result )

        // Estructura de la respuesta
        const data: meli.items.items = {
            author: {
                name: "Joaquin",
                lastname: "Lio"
            },
            categories,            
            items
        }

        if(!data)
            return response.error(req, res, `controllers/Items.ts (getItems): error al obtener los items`, 500);          

        return response.success(req, res, data, 200);
        
    } catch (error) {
        
        // Logea el error
        console.log(error);

        return response.error(req, res, `controllers/Items.ts (getItems): error al obtener los items [${error}]`, 500);
    }
}

/* Filtra las categorias */
export async function getCategories( result: { filters: any[]; } ): Promise<string[] | undefined> {

    try {
        
        // Busca en los filtros las categorias 
        const categories = result?.filters.find((filter: { id: string; }) => filter.id === 'category' );

        // Inicialisa el array
        let parsedCategories: string[] = []

        // Recorre las categorias y guarda los nombres
        categories?.values.forEach((category: { name: string; } ) => {
            
            parsedCategories.push( category.name )

        });

        // Devuelve el array de categorias
        return parsedCategories;
        
    } catch (error) {

        // Logea el error
        console.log(error);

        return undefined;

    }
}

/* Devuelve los items parseados */
export async function getParsedItems( result: { results: any; } ): Promise<meli.items.item[] | undefined> {

    try {
        
        // Busca en los filtros las categorias 
        const items = result?.results

        // Inicialisa el array
        let parsedItems: meli.items.item[] = []

        // Recorre las categorias y guarda los nombres
        items.forEach(( item: meli.items.item ) => {
                
            // Divide el entero del decimal del precio
            const [ amount, decimals ] = item.price.toString().split(".")
            
            let parsedItem: meli.items.item = {
                id: item.id,
                title: item.title,
                price: {
                    currency: item.currency_id,
                    amount: Number(amount) || 0,                    
                    decimals: Number(decimals) || 0
                },
                picture: `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-O.webp`,
                condition: item.condition,
                free_shipping: item?.shipping.free_shipping,
                address: item.address?.state_name
            }
            
            // Agrega un elemento al array
            parsedItems.push( parsedItem )

        });

        // Devuelve el array de categorias
        return parsedItems;
        
    } catch (error) {

        // Logea el error
        console.log(error);

        return undefined;

    }
}

/**
 * Devuelve un item
 * @returns void
 */
export async function getItem( req: Request, res: Response): Promise<void> {

    try {
        
        // Parametro de busqueda
        const id = req.params.id as string
         
        if( !id )
            return response.error(req, res, `controllers/Items.ts (getItem): Parametro requerido: 'id'`, 400);
            
        // Obtiene el item del servicio de MELI
        const item = await Meli.getItem( id )

        if(!item)
            return response.error(req, res, `controllers/Items.ts (getItem): error al obtener el item`, 500); 

        // Obtiene la descripcion del item del servicio de MELI
        const itemDescription = await Meli.getItemDescription( id )
        
        if(!itemDescription)
            return response.error(req, res, `controllers/Items.ts (getItem): error al obtener la descripcion del item`, 500);  
        
        // Divide el entero del decimal del precio
        const [ amount, decimals ] = item.price.toString().split(".")
        
        // Obtiene la condicion
        const condition = getCondition(item.condition);

        // Estructura de la respuesta
        const data: meli.items.itemParced = {
            author: {
                name: "Joaquin",
                lastname: "Lio"
            },            
            item: {
                id: item.id,
                title: item.title,
                price: {
                    currency: item.currency_id,
                    amount: Number(amount) || 0,                    
                    decimals: Number(decimals) || 0
                },
                picture: `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-O.webp`,
                condition,
                free_shipping: item?.shipping.free_shipping,
                sold_quantity: item.sold_quantity,
                description: itemDescription?.plain_text
            }
        }

        if(!data)
            return response.error(req, res, `controllers/Items.ts (getItem): error al obtener el item`, 500);          

        return response.success(req, res, data, 200);
        
    } catch (error) {
        
        // Logea el error
        console.log(error);

        return response.error(req, res, `controllers/Items.ts (getItem): error al obtener el item [${error}]`, 500);
    }
}

/* Devuelve el valor de la condicion  */
function getCondition( condition: string ): string {
    
    try {
        switch (condition) {
            case CONDITIONS.new:                
                return "Nuevo";

            case CONDITIONS.not_specified:
                return "No especificado";
             
            case CONDITIONS.used:
                return "Usado";               
        }
    } catch (error) {
        console.log(error)
    }

}


