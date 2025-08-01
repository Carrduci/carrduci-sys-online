import { Injectable, signal, WritableSignal } from '@angular/core';
import { UtilidadesService } from '../utilidades/utilidades.service';
import { EspecificacionServicioNotificacion, EspecificacionNotificacion } from '../../../models/ux/control-notificaciones/control-notificaciones.model';
import { Modal } from 'bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ControlNotificacionesService {

  // especificacion: EspecificacionNotificacion = {
  //   tipo: 'toast',
  //   // duracionEnMs: 5000,
  //   cuerpoMensaje: '¡Hola! Esta es una notificación...',
  //   posicion: 'top_right',
  //   ancho: '18vw'
  // }

  estado_notifiaciones: WritableSignal<EspecificacionServicioNotificacion> = signal({
      toast: [],
      alert: [],
      modal: [],
  })

  // estado_notificaciones$ = this._notificaciones_subject.asObservable()
  
  constructor(
    private utiles: UtilidadesService
  ) { }

  private agregar_notif_a_arreglo(
    nueva_notif: EspecificacionNotificacion,
    tipo: 'alert' | 'toast' | 'modal',
  ) {
    this.estado_notifiaciones.update((value) => {
      const ESTADO_ACDTUALIZADO = {
        ...value,
        [tipo]: [...value[tipo], nueva_notif]
      }
      return ESTADO_ACDTUALIZADO
    })
  }

  eliminar_notificacion(
    id_notificacion: string | undefined, 
    tipo: 'alert' | 'toast' | 'modal',
  ) {
    // const ESTADO_ACTUAL = this.estado_notifiaciones.value
    if (tipo === 'modal' && id_notificacion) {
      this.cerrar_modal(id_notificacion)
      setTimeout(() => {
        this.estado_notifiaciones.update((value) => {
          const ARREGLO_ACTUALIZADO = value[tipo]
            .filter((notif) => notif.id !== id_notificacion)
          const ESTADO_ACTUALIZADO = {
            ...value,
            [tipo]: ARREGLO_ACTUALIZADO
          }
          return ESTADO_ACTUALIZADO
        })
      }, 500)
    } else {
      this.estado_notifiaciones.update((value) => {
        const ARREGLO_ACTUALIZADO = value[tipo]
          .filter((notif) => notif.id !== id_notificacion)
        const ESTADO_ACTUALIZADO = {
          ...value,
          [tipo]: ARREGLO_ACTUALIZADO
        }
        return ESTADO_ACTUALIZADO
      })
    }
  }

  private modificar_notif_de_arreglo(
    tipo: 'alert' | 'toast' | 'modal',
    datos: EspecificacionNotificacion,
  ) {
    this.estado_notifiaciones.update((value) => {
      const ARREGLO_ACTUALIZADO = value[tipo]
        .map(notif => notif.id !== datos.id? datos : notif)
      const ESTADO_ACTUALIZADO = {
        ...value,
        [tipo]: ARREGLO_ACTUALIZADO
      }
      return ESTADO_ACTUALIZADO
    })
  }

  private preparar_toast(
    datos: EspecificacionNotificacion,
  ) {
    if (!datos.posicion) datos.posicion = 'top_left'
    if (!datos.duracion_en_ms) datos.duracion_en_ms = 6000
    if (!datos.modo) datos.modo = 'neutro'
    switch (datos.modo) {
      case 'danger':
        datos.color_texto = 'text-danger-emphasis'
        datos.simbolo = 'bi bi-x-circle'
        break;
      case 'question':
        datos.simbolo = 'bi bi-question-circle'
        break;
      case 'info':
        datos.color_texto = 'text-info-emphasis'
        datos.simbolo = 'bi bi-info-circle'
        break;
      case 'notice':
        datos.color_texto = 'text-primary-emphasis'
        datos.simbolo = 'bi bi-bell'
        break;
      case 'success':
        datos.color_texto = 'text-success-emphasis'
        datos.simbolo = 'bi bi-check-circle'
        break;
      case 'warning':
        datos.color_texto = 'text-warning-emphasis'
        datos.simbolo = 'bi bi-exclamation-circle'
        break;
    }
  }

  private preparar_alert(
    datos: EspecificacionNotificacion,
  ) {
    if (!datos.posicion) datos.posicion = 'top_left'
    if (!datos.duracion_en_ms) datos.duracion_en_ms = 6000
    if (!datos.modo) datos.modo = 'neutro'
    switch (datos.modo) {
      case 'danger':
        datos.color_alert = 'alert-danger'
        datos.simbolo = 'bi bi-x-circle'
        break;
      case 'question':
        datos.color_alert = 'alert-dark'
        datos.simbolo = 'bi bi-question-circle'
        break;
      case 'info':
        datos.color_alert = 'alert-info'
        datos.simbolo = 'bi bi-info-circle'
        break;
      case 'notice':
        datos.color_alert = 'alert-primary'
        datos.simbolo = 'bi bi-bell'
        break;
      case 'success':
        datos.color_alert = 'alert-success'
        datos.simbolo = 'bi bi-check-circle'
        break;
      case 'warning':
        datos.color_alert = 'alert-warning'
        datos.simbolo = 'bi bi-exclamation-circle'
        break;
    }
  }

  private preparar_modal(
    datos: EspecificacionNotificacion,
  ) {
    // if (!datos.duracion_en_ms) datos.duracion_en_ms = 6000
    if (!datos.modo) datos.modo = 'neutro'
    switch (datos.modo) {
      case 'danger':
        datos.color_fondo = 'bg-black'
        datos.color_borde = 'border-danger'
        datos.color_texto = 'text-danger'
        datos.simbolo = 'bi bi-x-circle'
        break;
      case 'question':
        datos.color_fondo = 'bg-black'
        datos.color_borde = 'border-black'
        datos.color_texto = 'text-light'
        datos.simbolo = 'bi bi-question-circle'
        break;
      case 'info':
        datos.color_fondo = 'bg-black'
        datos.color_texto = 'text-info'
        datos.color_borde = 'border-black'
        datos.simbolo = 'bi bi-info-circle'
        break;
      case 'notice':
        datos.color_fondo = 'bg-black'
        datos.color_borde = 'border-primary'
        datos.color_texto = 'text-primary'
        datos.simbolo = 'bi bi-bell'
        break;
      case 'success':
        datos.color_fondo = 'bg-black'
        datos.color_borde = 'border-success'
        datos.color_texto = 'text-success'
        datos.simbolo = 'bi bi-check-circle'
        break;
      case 'warning':
        datos.color_fondo = 'bg-black'
        datos.color_borde = 'border-warning'
        datos.color_texto = 'text-warning'
        datos.simbolo = 'bi bi-exclamation-circle'
        break;
    }
  }

  private cerrar_modal(ID: string) {
    const elemento_modal = document.getElementById(ID) as HTMLElement;
    const modal = new Modal(elemento_modal);
    modal.hide()
  }

  crear_notificacion(datos: EspecificacionNotificacion) {
    const ID = this.utiles.crear_bsonobj_id_para_variable()
    datos.id = ID
    switch (datos.tipo) {
      case 'toast':
        this.preparar_toast(datos)
        this.agregar_notif_a_arreglo(datos, 'toast')
        setTimeout(() => {
          this.eliminar_notificacion(
            <string>datos.id, datos.tipo
          )
        }, (datos.duracion_en_ms ?? 0) + 200)
        break;
      case 'alert':
        this.preparar_alert(datos)
        this.agregar_notif_a_arreglo(datos, 'alert')
        setTimeout(() => {
          this.eliminar_notificacion(
            <string>datos.id, datos.tipo
          )
        }, (datos.duracion_en_ms ?? 0) + 200)
        break;
      case 'modal':
        this.preparar_modal(datos)
        this.agregar_notif_a_arreglo(datos, 'modal')
        break;
    }

    setTimeout(() => {
      if (datos.tipo === 'modal') {
        const elemento_modal = document.getElementById(ID) as HTMLElement;
        const modal = new Modal(elemento_modal);
        modal.show()
        if (datos?.duracion_en_ms) {
          setTimeout(() => {
            this.eliminar_notificacion(ID, 'modal')
          }, datos.duracion_en_ms)
        }
      }
    }, 0)

    return ID
  }

	gestionarError(err: any): string {
		if (!err.error && err.status !== 403) {
			// Si el error viene del GUI no tiene la propiedad
			// error y no muestra el mensaje. Si pasa esto
			// lo capturamos aqui
			throw err
		}
    let texto = ''

		texto = err.error

		if (err.error.data) {
			texto = err.error.data.mensaje

			if (err.error.data.errorGeneral) {
				if (err.error.data.errorGeneral.errors) {
					texto = this.recorrerErrores(
						err.error.data.errorGeneral.errors
					)
				} else {
					texto = `
            <div style="margin: 10px; padding: 2%;">
              <span class="font-bold h6">Esta es más información acerca del problema. </span>
              <br />
              <div class="saltos-linea-tabs">${err.error.data.errorGeneral}</div>
            </div>
          `
				}
			}
		}

		return texto
	}

  
	private recorrerErrores(errors: any): string {
		let footer =
			// tslint:disable-next-line:max-line-length
			'<span > <h4 class="text-muted animated tada text-center">Esta es más información acerca del problema. </h4>'
		for (const key in errors) {
			if (errors.hasOwnProperty(key)) {
				const objetoError = errors[key]
				footer += `<hr /><span class="text-rigth"><strong class="text-primary" >${key}: </strong>${objetoError.message}`

				if (objetoError.properties) {
					if (!!objetoError.properties.value) {
						footer += `<br /> El valor erroneo es: <span class="text-danger">${objetoError.properties.value} </span></span> `
					}
				}

				footer += '</br>'
			}
		}

		return footer
	}
  
}