import axios from 'axios'

/* Obtiene listado de items */
export async function searchItems( query: string ): Promise<any> {

    try {        
        
        const { data } = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${query}&limit=4`);
        
        return data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error)
            return false;
          } else {
            console.log(error)
            return false;
          }
        
    }
       
}

/* Obtiene un item  */
export async function getItem( id: string ): Promise<any> {

  try {        
      const { data } = await axios.get(`https://api.mercadolibre.com/items/${id}`);
      
      return data;

  } catch (error) {
      if (axios.isAxiosError(error)) {
          console.log(error)
          return false;
        } else {
          console.log(error)
          return false;
        }
      
  }
     
}

/* Obtiene la descripcion un item  */
export async function getItemDescription( id: string ): Promise<any> {

  try {        
      const { data } = await axios.get(`https://api.mercadolibre.com/items/${id}/description`);
      
      return data;

  } catch (error) {
      if (axios.isAxiosError(error)) {
          console.log(error)
          return false;
        } else {
          console.log(error)
          return false;
        }
      
  }
     
}

