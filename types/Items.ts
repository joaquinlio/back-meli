declare namespace meli.items {

    export interface items {        
        author: author,
        categories: string[],
        items: item[]          
    } 

    export interface author {
        name: string,
        lastname: string
    } 

    export interface itemParced {
        author: author;
        item: item
    }
    export interface item {
        thumbnail_id?: string;       
        currency_id?: string,
        thumbnail?: string,
        address?: any,
        shipping?: {
            free_shipping: boolean
        },                
        id: string,
        title: string,
        price: price,
        picture: string,
        condition: string,
        free_shipping: boolean,  
        sold_quantity?: number,
        description?: string
             
    }  
    
    export interface price {
        currency: string,
        amount: number,
        decimals: number
    }
  }