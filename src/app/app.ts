import { APP_BASE_HREF, CommonModule, JsonPipe, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, signal, TemplateRef, WritableSignal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.prod';
import { HeaderService } from './services/utiles/header/header.service';
import localeMx from '@angular/common/locales/es-MX'
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
export class App {

  constructor(
    public header_service: HeaderService,
  ) {
    this.titulo_componente = this.header_service.get_componente()
  }

  titulo_componente?: WritableSignal<TemplateRef<any> | undefined>
  protected readonly titulo_string = signal('CARRDUCIsys ONLINE');
}
