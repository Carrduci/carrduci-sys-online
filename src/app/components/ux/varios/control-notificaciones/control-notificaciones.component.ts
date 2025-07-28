import { Component, effect, signal, WritableSignal } from '@angular/core';
import { BootstrapHideAutoDirective } from '../../../../directives/utiles/varios/bootstrap-hide-auto/bootstrap-hide-auto.directive';
import { BootstrapShowAutoDirective } from '../../../../directives/utiles/varios/bootstrap-show-auto/bootstrap-show-auto.directive';
import { EspecificacionServicioNotificacion } from '../../../../models/ux/control-notificaciones/control-notificaciones.model';
import { ControlNotificacionesService } from '../../../../services/ux/control-notificaciones/control-notificaciones.service';
import { ModalNormalComponent } from "../../flotantes/modal/modal-normal/modal-normal.component";

@Component({
    selector: 'app-control-notificaciones',
    imports: [
    BootstrapShowAutoDirective,
    BootstrapHideAutoDirective,
],
    templateUrl: './control-notificaciones.component.html',
    styleUrl: './control-notificaciones.component.scss',
    standalone: true,
})
export class ControlNotificacionesComponent{

  constructor(
    public controlNotifs: ControlNotificacionesService,
  ) {
    effect((onCleanup) => {
      const ESTADO_NOTIFS = this.controlNotifs.estado_notifiaciones()
      this.notificaciones.update(() => ESTADO_NOTIFS)
      onCleanup(() => {

      })
    })
  }

  notificaciones: WritableSignal<EspecificacionServicioNotificacion> = signal({
    alert: [],
    modal: [],
    toast: [],
  })

}
