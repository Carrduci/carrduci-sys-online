import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    effect,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Pipe,
    signal,
    TemplateRef,
    WritableSignal,
} from '@angular/core';
import { PaginadorGenericoComponent } from '../paginador-generico/paginador-generico.component';
import { BootstrapTooltipDirective } from '../../../../directives/utiles/varios/bootstrap-tooltip/bootstrap-tooltip.directive';
import { PipeDinamicoPipe } from '../../../../pipes/pipe-dinamico/pipe-dinamico.pipe';
import { DeteccionViewportService } from '../../../../services/ux/deteccion-viewport/deteccion-viewport.service';
import { ControlQueriesService } from '../../../../services/ux/control-queries/control-queries.service';
import { GetfieldPipe } from '../../../../pipes/getfield/getfield.pipe';
import { FlotanteGenericoDirective } from '../../../../directives/utiles/varios/flotante-generico/flotante-generico.directive';
import { CallfunctionPipe } from '../../../../pipes/callfunction/callfunction.pipe';
import { CardComponent } from '../../card/card/card.component';

@Component({
    selector: 'app-tabla-generica',
    imports: [
        BootstrapTooltipDirective,
        CommonModule,
        PipeDinamicoPipe,
        PaginadorGenericoComponent,
        GetfieldPipe,
        FlotanteGenericoDirective,
        CallfunctionPipe,
        CardComponent,
    ],
    templateUrl: './tabla-generica.component.html',
    styleUrl: './tabla-generica.component.scss',
    standalone: true,
})
export class TablaGenericaComponent implements OnDestroy {
    constructor(
        private viewport: DeteccionViewportService,
        private control_queries: ControlQueriesService
    ) {
        effect(() => {
            const QUERY_OBTENIDA =
                this.control_queries.query_actual().pagination;
            if (QUERY_OBTENIDA) {
                this.ordenes_columnas.update(() => QUERY_OBTENIDA.sorting_fields)
                this.detallePaginacion.update((value) => QUERY_OBTENIDA);
            }
            this.emisor_paginacion.emit(QUERY_OBTENIDA);
        });

        this.modo = this.viewport.modo_tabla_generica;
        this.modo_viewport = this.viewport.modo_viewport;
    }

    ngOnDestroy(): void {
        this.control_queries.queries.pagination.accion.ocultar();
    }

    // (o==================================================================o)
    //   #region VARIABLES (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    // (o-----------------------------------------( INPUTS Y OUTPUTS ))

    datos_tabla: WritableSignal<OPCIONES_TABLA_GENERICA<any>> = signal({
        columns: [],
        documentos: [],
    });
    columnas_computed = computed(() => this.datos_tabla().columns);
    @Input('datos_tabla')
    set _datos_tabla(datos: OPCIONES_TABLA_GENERICA<any> | undefined) {
        if (datos) {
            this.sobreescribir_valores_por_defecto(datos);
            this.datos_tabla.update((current_value) => ({
                ...current_value,
                ...datos,
            }));
        }
    }
    @Input('documentos') documentos: any[] = [];
    @Input('track_field') track_field: string = '_id'
    @Output('paginacion')
    emisor_paginacion: EventEmitter<Pagination> = new EventEmitter();
    @Output('click_fila')
    emisor_click_fila: EventEmitter<OPCIONES_FILA_TABLA_GENERICA<any>> =
        new EventEmitter();

    // (o-----------------------------------------( SOLO VARIABLES ))

    modo!: WritableSignal<'tabla' | 'columnas'>;
    modo_viewport!: WritableSignal<'movil' | 'escritorio'>;
    ordenes_columnas: WritableSignal<Pagination['sorting_fields']> =
        signal({});
    // datos_tabla!: OPCIONES_TABLA_GENERICA
    detallePaginacion: WritableSignal<Pagination> = signal({
        from: 0,
        limit: 5,
        current_page: 1,
        element_count: 0,
        page_count: 0,
        sorting_fields: {},
    });

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VARIABLES (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region ORDENAMIENTO DE COLUMNAS (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    ordenar_ascendente(column_field: string, nombre_real: string) {
        this.ordenes_columnas.update((value: Pagination['sorting_fields']) => {
            if (value) {
                value[column_field] = {
                    field: column_field,
                    title: nombre_real,
                    order: -1,
                };
            }
            return value;
        });
        this.definir_query_paginacion();
    }

    ordenar_descendente(column_field: string, nombre_real: string) {
        this.ordenes_columnas.update((value: Pagination['sorting_fields']) => {
            if (value) {
                value[column_field] = {
                    field: column_field,
                    title: nombre_real,
                    order: 1,
                };
            }
            return value;
        });
        this.definir_query_paginacion();
    }

    no_ordenar(column_field: string) {
        this.ordenes_columnas.update((value: Pagination['sorting_fields']) => {
            if (value) {
                delete value[column_field];
            }
            return value;
        });
        this.definir_query_paginacion();
    }

    definir_query_paginacion() {
        let paginacion: Pagination = {
            ...this.detallePaginacion(),
            sorting_fields: this.ordenes_columnas(),
        };
        this.detallePaginacion.update((value) => paginacion);
        this.control_queries.queries.pagination.accion.definir(paginacion);
    }

    resultado_paginacion_paginador(resultado_paginacion: Pagination) {
        let paginacion: Pagination = {
            ...resultado_paginacion,
            sorting_fields: this.ordenes_columnas(),
        };
        this.control_queries.queries.pagination.accion.definir(paginacion);
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion ORDENAMIENTO DE COLUMNAS (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region ACCIONES TABLA (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    definir_modo(modo: 'tabla' | 'columnas') {
        this.modo.update(() => modo);
    }

    definir_cantidad_columnas(cantidad: 1 | 2 | 3 | 4 | 5 = 3) {}

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion ACCIONES TABLA (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region VALORES POR DEFECTO (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    sobreescribir_valores_por_defecto(datos: OPCIONES_TABLA_GENERICA<any>) {
        this.si_no_existe(datos, 'mostrar_boton_seleccion', false);
        this.si_no_existe(datos, 'mostrar_boton_copia_portapapeles', true);
        this.si_no_existe(datos, 'mostrar_boton_descarga_excel', true);
        this.si_no_existe(datos, 'mostrar_boton_descarga_pdf', true);
        this.si_no_existe(datos, 'mostrar_boton_layout', true);
        this.si_no_existe(datos, 'mostrar_indice_fila', false);
        this.si_no_existe(datos, 'mostrar_paginador', true);
        this.si_no_existe(datos, 'mostrar_buscador', true);
        this.si_no_existe(datos, 'posicion_sub_titulo', 'bottom');
        this.si_no_existe(datos, 'mostrar_ordenadores', true);
    }

    si_no_existe(datos: any, valor_buscar: string, reemplazo_por_si_no: any) {
        if (
            !(datos[valor_buscar] !== undefined && datos[valor_buscar] !== null)
        ) {
            datos[valor_buscar] = reemplazo_por_si_no;
        }
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VALORES POR DEFECTO (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region CLICK
    // (o-----------------------------------------------------------\/-----o)
    
    emmit_click(index: number, document: any) {
        this.emisor_click_fila.emit({row_index: index, row_document: document})
    }
    
    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CLICK
    // (o==================================================================o)
}

export interface CLICK_FILA_TABLA_GENERICA {}

export interface COLUMNA_TABLA_GENERICA<OBJETO> {
    alignment?: 'left' | 'center' | 'right';
    header_tooltip?: TOOLTIP_TABLA_GENERICA<OBJETO>;
    avoid_click_detection?: boolean;
    content: CONTENIDO_TABLA_GENERICA<OBJETO>;
    column_title: string;
}

export interface TOOLTIP_TABLA_GENERICA<OBJETO> {
    content?: string;
    content_callback?: (objeto: OBJETO) => any;
    pipe?: Pipe;
    pipe_args?: any[];
    template_tooltip?: TemplateRef<any>;
}

export interface CONTENIDO_TABLA_GENERICA<OBJETO> {
    class_callback?: (objeto: OBJETO) => any;
    template?: TemplateRef<any>;
    callback?: (objeto: OBJETO) => any;
    pipe?: Pipe;
    pipe_args?: any[];
    field?: DeepKeys<OBJETO>
    tooltip?: TOOLTIP_TABLA_GENERICA<OBJETO>;
    default_value?: any;
}

export interface OPCIONES_FILA_TABLA_GENERICA<OBJETO> {
    row_index: number;
    row_document: OBJETO;
}

export interface CELDA_PIE_TABLA_GENERICA<OBJETO> {
    colspan?: number,
    content?: any,
    template?: TemplateRef<any>
    alignment?: 'center' | 'left' | 'right'
    classes?: string,
}

export interface FILA_PIE_TABLA_GENERICA<OBJETO> {
    cells: CELDA_PIE_TABLA_GENERICA<OBJETO>[];    
}

export interface OPCIONES_TABLA_GENERICA<OBJETO> {
    row_options?: OPCIONES_FILA_TABLA_GENERICA<OBJETO>;
    table_title?: string;
    table_sub_title?: string;
    sub_title_position?: 'inicio' | 'fin';
    show_pagination?: boolean;
    show_search_bar?: boolean;
    show_selection_button?: boolean;
    show_copy_button?: boolean;
    show_excel_button?: boolean;
    show_pdf_button?: boolean;
    show_layout_button?: boolean;
    show_index_column?: boolean;
    show_sorters?: boolean;
    sticky_header?: boolean;
    sticky_footer?: boolean;
    footer?: FILA_PIE_TABLA_GENERICA<OBJETO>[]
    columns: COLUMNA_TABLA_GENERICA<OBJETO>[];
}
