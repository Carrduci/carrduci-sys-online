import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicioGenerico } from '../../clases-abstractas/servicio-generico.abstract';
import { environment } from '../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoliosBotonesService extends ServicioGenerico {
  
  constructor(
    private http: HttpClient,
  ) {
    super()
    this.ruta_base = environment.RUTA_FOLIOS_VENDEDOR
  }

  ruta_base!: string
  
  PUBLICO_obtener_folio_vendedor_por_id(id: string) {
    const URL = this.obtener_url([this.ruta_base, 'obtenerCotizacionPublica'], { id })
    return this.http.get(URL).pipe(
      map((respuesta: any) => {
        return respuesta.datos
      }),
      catchError(err => {
        return throwError(() => new Error())
      })
    )
  }
  
}
