import { AfterViewInit, Component, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { FoliosBotonesService } from '../folios-botones.service';
import { HeaderService } from '../../../services/ux/header/header.service';
import { ControlQueriesService } from '../../../services/ux/control-queries/control-queries.service';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FolioVendedorPublicoRecibir } from '../folio-vendedor-public.model';
import { LogoCarrduciSvgComponent } from '../../ux/varios/logo-carrduci-svg/logo-carrduci-svg.component';
import { OPCIONES_FILA_TABLA_GENERICA, OPCIONES_TABLA_GENERICA, TablaGenericaComponent } from '../../ux/varios/tabla-generica/tabla-generica.component';
import { UtilidadesService } from '../../../services/ux/utilidades/utilidades.service';

@Component({
  selector: 'csys-PUBLICO-vista-folio-detalle',
  imports: [LogoCarrduciSvgComponent, DatePipe, TablaGenericaComponent],
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
    private utiles: UtilidadesService,
  ) {

  }

  ngOnInit(): void {
    this.obtener_folio_vendedor()
    this.crear_datos_tabla()
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
  folio_vendedor_original: WritableSignal<FolioVendedorPublicoRecibir | undefined> = signal(undefined)
  datos_tabla_generica!: OPCIONES_TABLA_GENERICA<FolioVendedorPublicoRecibir['folioLineas'][0]>;
  paginacion!: WritableSignal<Pagination>;

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
            this.folio_vendedor_original.update((value) => structuredClone(folio))
          }
        })
    }
  }
  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion OBTENCION FOLIOS
  // (o==================================================================o)

  // (o==================================================================o)
  //   #region TABLA GENERICA
  // (o-----------------------------------------------------------\/-----o)
  
    crear_datos_tabla() {
        this.datos_tabla_generica = {
            columns: [
                {
                  column_title: '#',
                  header_tooltip: {
                    content: 'El número de línea de la cotización (comienza desde 0)'
                  },
                  content: {
                    field: 'numeroDePedido'
                  }
                },
                {
                    column_title: 'SKU',
                    header_tooltip: {
                      content: 'El código del producto'
                    },
                    content: {
                        field: 'modeloCompleto.sku'
                    },
                },
                {
                  column_title: 'DESCRIPCIÓN',
                  header_tooltip: {
                    content: 'Una breve descripción del producto'
                  },
                  content: {
                    field: 'modeloCompleto.descripcionFactura',
                    default_value: 'N/A'
                  }
                },
                {
                  column_title: 'CANTIDAD',
                  header_tooltip: {
                    content: 'Las piezas de la línea'
                  },
                  content: {
                    field: 'cantidad',
                    pipe: DecimalPipe,
                    pipe_args: ['0.0', 'es-MX'],
                    default_value: 0,
                  }
                },
                {
                  column_title: 'PRECIO UNITARIO',
                  header_tooltip: {
                    content: 'El precio de una sola pieza'
                  },
                  content: {
                    field: 'precioUnitarioUsado',
                    pipe: CurrencyPipe,
                    pipe_args: ['MXN', 'symbol', '0.2-4', 'es-MX'],
                    default_value: 0,
                  }
                },
                {
                  column_title: 'PRECIO TOTAL',
                  header_tooltip: {
                      content: 'El precio de todas las piezas de la línea',
                  },
                  content: {
                      callback: (objeto) => {
                        return (objeto.cantidad ?? 0) * (objeto.precioUnitarioUsado ?? 0)
                      },
                      pipe: CurrencyPipe,
                      pipe_args: ['MXN', 'symbol', '0.2-4', 'es-MX'],
                      default_value: 0,
                  }
                }
            ],
            show_index_column: false,
            sticky_header: true,
            show_sorters: true,
        };
    }

    cambiar_ordenamiento(paginacion: Pagination) {
      try {
          this.paginacion.update((value) => paginacion);
      } catch (err) {
          this.paginacion = signal(paginacion);
      }
      this.folio_vendedor.update(
        (value) => {
          const HAY_ORDENAMIENTO = Object.keys(paginacion?.sorting_fields ?? {}).length > 0
          if (value && HAY_ORDENAMIENTO) {
            const LINEAS_ORDENADAS = this.utiles.sort_array(
              value.folioLineas, 
              this.utiles.convertir_paginacion_a_sort_spec(paginacion)
            )
            value.folioLineas = LINEAS_ORDENADAS
          } else if (!!value && !HAY_ORDENAMIENTO) {
            return structuredClone(this.folio_vendedor_original())
          }
          return value
        }
      )
    }

    accion_click_fila(datos: OPCIONES_FILA_TABLA_GENERICA<FolioVendedorPublicoRecibir>) {
        console.log(datos)
    }

  
  // (o-----------------------------------------------------------/\-----o)
  //   #endregion TABLA GENERICA
  // (o==================================================================o)

}
