import { APP_BASE_HREF, CommonModule, JsonPipe } from '@angular/common';
import { Component, LOCALE_ID, signal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.prod';

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
  protected readonly title = signal('carrduci-sys-online');
  
  prueba = environment.__;
}
