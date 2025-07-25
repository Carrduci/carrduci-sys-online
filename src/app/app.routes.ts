import { Routes } from '@angular/router';
import { PaginaNoEncontradaComponent } from './components/utiles/pagina-no-encontrada/pagina-no-encontrada.component';

export const routes: Routes = [
    { 
        path: '', 
        pathMatch: 'full',
        redirectTo: 'cotizaciones'
    },
    {
        path: 'cotizaciones',
        loadComponent: () => import('./components/folios-botones/vista-folio-detalle/vista-folio-detalle.component')
            .then(x => x.VistaFolioDetalleComponent)

    },
    { path: '*', redirectTo: '' },
    { path: '**', component: PaginaNoEncontradaComponent },
];
