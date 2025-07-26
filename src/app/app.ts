import { APP_BASE_HREF, CommonModule, JsonPipe, registerLocaleData } from '@angular/common';
import { Component, HostListener, LOCALE_ID, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.prod';
import { HeaderService } from './services/utiles/header/header.service';
import localeMx from '@angular/common/locales/es-MX'
import { DeteccionViewportService } from './services/utiles/deteccion-viewport/deteccion-viewport.service';
registerLocaleData(localeMx)

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
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
