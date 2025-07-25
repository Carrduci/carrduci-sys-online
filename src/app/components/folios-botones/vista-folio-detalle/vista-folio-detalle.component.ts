import { Component, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FoliosBotonesService } from '../folios-botones.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { CardComponent } from '../../utiles/card/card.component';

@Component({
  selector: 'csys-vista-folio-detalle',
  imports: [JsonPipe],
  templateUrl: './vista-folio-detalle.component.html',
  styleUrl: './vista-folio-detalle.component.scss',
  standalone: true,
})
export class VistaFolioDetalleComponent  implements OnInit{

  // (o==================================================================o)
  //   #region INICIALIZACION
  // (o-----------------------------------------------------------\/-----o)

  constructor(
    private folioService: FoliosBotonesService
  ) {

  }
  
  ngOnInit(): void {
    this.obtenerFolio()
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion INICIALIZACION
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region VARIABLES
  // (o-----------------------------------------------------------\/-----o)
  
  folioVendedor: WritableSignal<any> = signal(undefined)
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion VARIABLES
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region OBTENCION DE FOLIO
  // (o-----------------------------------------------------------\/-----o)
  
  obtenerFolio() {
    this.folioService.obtener_folio_vendedor_por_id('688157915ce40cce6f17ff43')
      .subscribe({
        next: (folio) => {
          this.folioVendedor.update((value) => {
            return folio
          })
        }
      })
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion OBTENCION DE FOLIO
  // (o==================================================================o)

}
