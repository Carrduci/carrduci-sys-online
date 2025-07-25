import { AfterViewInit, Component, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { FoliosBotonesService } from '../folios-botones.service';
import { HeaderService } from '../../../services/utiles/header/header.service';
import { ControlQueriesService } from '../../../services/utiles/control-queries/control-queries.service';
import { LogoCarrduciSvgComponent } from '../../utiles/logo-carrduci-svg/logo-carrduci-svg.component';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'csys-vista-folio-detalle',
  imports: [LogoCarrduciSvgComponent, DatePipe, JsonPipe],
  templateUrl: './vista-folio-detalle.component.html',
  styleUrl: './vista-folio-detalle.component.scss',
  standalone: true,
})
export class VistaFolioDetalleComponent implements OnInit, AfterViewInit {

  // (o==================================================================o)
  //   #region INICIALIZACION
  // (o-----------------------------------------------------------\/-----o)
  
  constructor(
    private folio_service: FoliosBotonesService,
    private header_service: HeaderService,
    private query_service: ControlQueriesService,
  ) {

  }

  ngOnInit(): void {
    this.obtener_folio_vendedor()
  }

  ngAfterViewInit(): void {
    this.header_service.set_componente(this.TITULO_VISTA)
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion INICIALIZACION
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region VARIABLES
  // (o-----------------------------------------------------------\/-----o)
  
  @ViewChild('TITULO_VISTA') TITULO_VISTA!: TemplateRef<any>
  
  folio_vendedor: WritableSignal<any | undefined> = signal(undefined)
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion VARIABLES
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region OBTENCION FOLIOS
  // (o-----------------------------------------------------------\/-----o)
  
  obtener_folio_vendedor() {
    const ID_FOLIO = this.query_service.query_actual().id
    if (ID_FOLIO) {
      this.folio_service.obtener_folio_vendedor_por_id(ID_FOLIO)
        .subscribe({
          next: (folio) => {
            this.folio_vendedor.update((value) => folio)
          }
        })
    }
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion OBTENCION FOLIOS
  // (o==================================================================o)

}
