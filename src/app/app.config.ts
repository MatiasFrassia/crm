import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { tokenInterceptor } from './utils/token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Único detector de cambios (resuelve la pantalla congelada)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2. Registro único de rutas
    provideRouter(routes),

    // 3. Cliente HTTP ÚNICO con el interceptor de JWT
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),

    // 4. Escuchadores globales, SSR Hydration y Notificaciones Toastr
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      easeTime: 0,
    })
  ]
};