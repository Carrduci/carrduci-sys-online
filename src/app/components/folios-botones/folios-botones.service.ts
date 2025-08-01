import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicioGenerico } from '../../clases-abstractas/servicio-generico.abstract';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { FolioVendedorPublicoRecibir } from './folio-vendedor-public.model';
import { ControlNotificacionesService } from '../../services/ux/control-notificaciones/control-notificaciones.service';

@Injectable({
  providedIn: 'root',
})
export class FoliosBotonesService extends ServicioGenerico {
  constructor(private http: HttpClient, private notificaciones: ControlNotificacionesService) {
    super();
    this.ruta_base = environment.RUTA_FOLIOS_VENDEDOR;
  }

  ruta_base!: string;
  options = {
    headers: {
      'proxy-authorization': environment.PROXY_AUTH
    }
  }

  PUBLICO_obtener_folio_vendedor_por_id(
    id: string
  ): Observable<FolioVendedorPublicoRecibir> {
    const URL = this.obtener_url([this.ruta_base, 'obtenerCotizacionPublica'], {
      id,
    });
    return this.http.get<FolioVendedorPublicoRecibir>(URL, this.options).pipe(
      map((respuesta: any) => {
        this.notificaciones.crear_notificacion({
          tipo: 'alert',
          modo: 'success',
          titulo: 'Correcto',
          cuerpo_mensaje: 'Se obtuvo una cotización'
        })
        return new FolioVendedorPublicoRecibir(respuesta.datos);
      }),
      catchError((err) => {
        this.notificaciones.crear_notificacion({
          tipo: 'modal',
          modo: 'danger',
          titulo: 'Error',
          cuerpo_mensaje: this.notificaciones.gestionarError(err)
        })
        return throwError(() => new Error());
      })
    );
  }

  PUBLICO_aprobar_folio_de_vendedor(
    id: string
  ): Observable<FolioVendedorPublicoRecibir> {
    const URL = this.obtener_url(
      [
        this.ruta_base, 
        'autorizarCotizacionPublica'
      ], 
      { id }
    );

    return this.http.put<FolioVendedorPublicoRecibir>(URL, {}, this.options).pipe(
      map((respuesta: any) => {
        this.notificaciones.crear_notificacion({
          tipo: 'alert',
          modo: 'success',
          titulo: 'Correcto',
          cuerpo_mensaje: respuesta.mensaje
        })
        return new FolioVendedorPublicoRecibir(respuesta.datos);
      }),
      catchError((err) => {
        this.notificaciones.crear_notificacion({
          tipo: 'modal',
          modo: 'danger',
          titulo: 'Error',
          cuerpo_mensaje: this.notificaciones.gestionarError(err)
        })
        return throwError(() => new Error());
      })
    );
  }
    
}
