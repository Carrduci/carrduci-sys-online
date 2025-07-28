import { APP_BASE_HREF, CommonModule, registerLocaleData } from '@angular/common';
import { Component, HostListener, LOCALE_ID, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderService } from './services/ux/header/header.service';
import localeMx from '@angular/common/locales/es-MX'
import { DeteccionViewportService } from './services/ux/deteccion-viewport/deteccion-viewport.service';
import { ControlNotificacionesComponent } from './components/ux/varios/control-notificaciones/control-notificaciones.component';
registerLocaleData(localeMx)

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, ControlNotificacionesComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  providers: [
      // Configuraciones de idioma.
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: LOCALE_ID, useValue: 'es-MX' },
  ],
})
export class App implements OnInit{

  constructor(
    public header_service: HeaderService,
    public viewport_service: DeteccionViewportService,
  ) {
    this.titulo_componente = this.header_service.get_componente()
  }

  ngOnInit(): void {
    this.viewport_service.calcular_ancho_viewport()
  }

  titulo_componente?: WritableSignal<TemplateRef<any> | undefined>
  protected readonly titulo_string = signal('CARRDUCIsys ONLINE');

  // (o==================================================================o)
  //   #region DETECCION DE VIEWPORT (INICIO)
  // (o-----------------------------------------------------------\/-----o)

  @HostListener('window:resize')
  acciones_de_deteccion_de_viewport() {
      this.viewport_service.calcular_ancho_viewport();
  }

  // (o-----------------------------------------------------------/\-----o)
  //   #endregion DETECCION DE VIEWPORT (FIN)
  // (o==================================================================o)
}
