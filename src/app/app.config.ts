import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom([
      BrowserModule
    ]),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
    ),
  ]
};
