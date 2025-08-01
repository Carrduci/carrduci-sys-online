import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withHashLocation, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import localeMx from '@angular/common/locales/es-MX'
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
registerLocaleData(localeMx, 'es-MX')

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: APP_BASE_HREF, useValue: '/' },
    {provide: LOCALE_ID, useValue: 'es-MX'},
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    importProvidersFrom([
      BrowserModule
    ]),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
    ),
  ]
};
