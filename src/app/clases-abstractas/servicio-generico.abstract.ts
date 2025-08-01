import { environment } from '../../environments/environment';

export abstract class ServicioGenerico {
  obtener_url(ruta: string[], query?: { [type: string]: any }) {
    const ENTRIES_QUERY = Object.entries(query ?? {});
    const STRING_QUERY = ENTRIES_QUERY.map((entry) => {
      const LLAVE = entry[0];
      const VALOR = entry[1];
      return `${LLAVE}=${VALOR}`;
    }).join('&');
    const URL_BASE = environment.DIRECCION_TUNEL;
    let url_formada = URL_BASE.concat(
      STRING_QUERY.length > 0 ? `/${ruta.join('/')}?${STRING_QUERY}` : ''
    );
    return url_formada;
  }
}
