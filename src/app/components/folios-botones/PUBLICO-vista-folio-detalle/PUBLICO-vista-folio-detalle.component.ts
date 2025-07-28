import { AfterViewInit, Component, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { FoliosBotonesService } from '../folios-botones.service';
import { HeaderService } from '../../../services/ux/header/header.service';
import { ControlQueriesService } from '../../../services/ux/control-queries/control-queries.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { FolioVendedorPublicoRecibir } from '../folio-vendedor-public.model';
import { LogoCarrduciSvgComponent } from '../../ux/varios/logo-carrduci-svg/logo-carrduci-svg.component';

@Component({
  selector: 'csys-PUBLICO-vista-folio-detalle',
  imports: [LogoCarrduciSvgComponent, DatePipe, JsonPipe],
  templateUrl: './PUBLICO-vista-folio-detalle.component.html',
  styleUrl: './PUBLICO-vista-folio-detalle.component.scss',
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
  
  folio_vendedor: WritableSignal<FolioVendedorPublicoRecibir | undefined> = signal(undefined)
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion VARIABLES
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region OBTENCION FOLIOS
  // (o-----------------------------------------------------------\/-----o)
  
  obtener_folio_vendedor() {
    const ID_FOLIO = this.query_service.query_actual().id
    if (ID_FOLIO) {
      this.folio_service.PUBLICO_obtener_folio_vendedor_por_id(ID_FOLIO)
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
