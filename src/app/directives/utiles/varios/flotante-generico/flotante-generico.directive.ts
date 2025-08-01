import {
	ChangeDetectorRef,
	Directive,
	ElementRef,
	EmbeddedViewRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	TemplateRef,
} from '@angular/core'
import { ControlDeFlotantesService } from '../../../../services/ux/control-de-flotantes/control-de-flotantes.service'
import { UtilidadesService } from '../../../../services/ux/utilidades/utilidades.service'
import { DeteccionViewportService } from '../../../../services/ux/deteccion-viewport/deteccion-viewport.service'

@Directive({
	selector: '[flotante-generico]',
	standalone: true,
})
export class FlotanteGenericoDirective implements OnInit, OnDestroy {
	// (o==================================================================o)
	//   #region INPUTS (INICIO)
	// (o-----------------------------------------------------------\/-----o)

	@Input('flotante-generico') htmlTemplate: string | undefined
	@Input() backgroundColor: string = 'rgba(0, 0, 0, .5)'
	colorBorde: string = 'transparent'
	anchoBorde: string = '0px'
	estiloBorde: string = 'solid'
	@Input('colorBorde') set _colorBorde(value: {
		color: string
		ancho: string
		estilo: string
	}) {
		this.funcionesPostCreado['colorBorde'] = () => {
			this.colorBorde = value.color
			this.anchoBorde = value.ancho
			this.estiloBorde = value.estilo
			this.renderer.setStyle(
				this.contenedorFlotante,
				'border',
				`${this.anchoBorde} ${this.estiloBorde} ${this.colorBorde}`
			)
		}
	}
	@Input() textColor: string = 'white'
	@Input() padding: string = '5px'
	@Input() mostrarConClick: boolean = false
	@Input() noUsarHover: boolean = false
	// @Input() maxHeight?: string
	@Input() maxWidth?: string = '20dvw'
	@Input() minWidth?: string
	@Input() maxHeight?: string
	@Input() minHeight?: string
	@Input() extenderAlturaAlMaximo?: boolean
	@Input() extenderAnchoAlMaximo?: boolean
	@Input('posicion') set _posicion(
		value: 'top' | 'bottom' | 'left' | 'right'
	) {
		this.posicion = value
	}
	@Input() template?: TemplateRef<any>
	@Input() contextoTemplate?: any
	@Input('mostrarFlotante') set mostrarFlotante(value: boolean) {
		if (!!value) {
			this.mostrar()
			this.mostrandoConCLick = false
		}
	}
	@Input('ocultarFlotante') set ocultarFlotante(value: boolean) {
		if (!!value) {
			this.ocultar()
			this.mostrandoConCLick = false
		}
	}
	@Input() forzarFlotanteDentroDeContenedor: boolean = false
	@Input() set correccionZIndex(value: number) {
		this.funcionesPostCreado['correccionZIndex'] = () => {
			this.renderer.setStyle(
				this.contenedorFlotante,
				'z-index',
				String(100 + value)
			)
			setTimeout(() => {
				this.embeddedView?.detectChanges()
			}, 0)
		}
	}
	definirScrollMaximoAutomatico: boolean = false
	@Input('definirScrollMaximoAutomatico') set _definirScrollMaximoAutomatico(
		value: boolean
	) {
		this.definirScrollMaximoAutomatico = value
	}
	clasesRecuadro: string = ''
	@Input('clasesRecuadro') set _clasesRecuadro(value: string) {
		this.clasesRecuadro = value
		this.funcionesPostCreado['clasesRecuadro'] = () => {
			value.split(' ').forEach(clase => {
				this.renderer.addClass(this.contenedorFlotante, clase)
			})
		}
	}
	@Input() noEliminar: boolean = false
	@Input('leerCambiosManualmente') set _detectarCambios(value: boolean) {
		if (value) {
			if (this.embeddedView) {
				this.embeddedView.detectChanges()
			}
			if (this.contenedorFlotante) {
				this.cdr.detectChanges()
			}
		}
	}
	noCerrarConClicksExternos: boolean = false
	@Input('noCerrarConClicksExternos') set agregarBotonCerrar(value: boolean) {
		this.noCerrarConClicksExternos = value
		if (value) {
			this.funcionesPostCreado['agregarBotonCerrar'] = () => {
				if (this.contenedorFlotante) {
					this.contenedorFlotante.appendChild(this.botonCerrar)
				}
			}
		} else {
			try {
				delete this.funcionesPostCreado['agregarBotonCerrar']
			} catch {}
		}
	}
	@Input('encabezado') encabezado?: string
	usarEncabezado: boolean = false
	@Input('usarEncabezado') set _usarEncabezado(value: boolean) {
		this.usarEncabezado = value
		if (value) {
			this.funcionesPostCreado['usarEncabezado'] = () => {
				if (!!this.contenedorFlotante) {
				this.contenedorFlotante.insertBefore(
						this.HTMLencabezado,
						this.contenedorFlotante.firstChild
					)
				}
			}
		} else {
			try {
				delete this.funcionesPostCreado['usarEncabezado']
			} catch {}
		}
	}
	@Input('ocultar_con_click_interno') ocultar_al_dar_click: boolean = false

	@Output('flotanteDestruido') emisorFlotanteDestruido: EventEmitter<void> =
		new EventEmitter()

	funcionesPostCreado: { [type: string]: any } = {}

	// (o-----------------------------------------------------------/\-----o)
	//   #endregion INPUTS (FIN)
	// (o==================================================================o)

	// (o==================================================================o)
	//   #region VARIABLES (INICIO)
	// (o-----------------------------------------------------------\/-----o)

	posicion: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
	// private posicionOriginal:  'top' | 'bottom' | 'left' | 'right' = 'bottom'

	private contenedorFlotante?: HTMLElement
	private contenidoContenedor!: HTMLElement
	private botonCerrar!: HTMLElement
	private HTMLencabezado!: HTMLElement
	private embeddedView?: EmbeddedViewRef<any>
	private elementoPadre!: HTMLElement
	private mostrandoConCLick = false
	private seEstaMostrando = false
	private topContenedor!: number
	private leftContenedor!: number
	private ID_CONTENEDOR!: string
	private ID_BOTON_CERRAR!: string
	private resizeObserver?: ResizeObserver
	private posicionadoPorSalirDePantalla: boolean = false
	private enMovil: boolean = false

	// (o-----------------------------------------------------------/\-----o)
	//   #endregion VARIABLES (FIN)
	// (o==================================================================o)

	// (o==================================================================o)
	//   #region INICIALIZACION (INICIO)
	// (o-----------------------------------------------------------\/-----o)

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private utiles: UtilidadesService,
		private controlFLotantesService: ControlDeFlotantesService,
		private cdr: ChangeDetectorRef,
		private viewport: DeteccionViewportService
	) {}

	ngOnInit() {
		this.detectarTamDispositivo()
		this.renderer.addClass(
			this.elementRef.nativeElement,
			'padre-flotante-generico'
		)
	}

	@HostListener('window:resize')
	detectarTamDispositivo() {
		this.viewport.calcular_ancho_viewport()
		this.enMovil = this.viewport.modo_viewport() === 'movil'
		if (this.enMovil) {
			this.noCerrarConClicksExternos = true
			this.funcionesPostCreado['agregarBotonCerrar'] = () => {
				if (this.contenedorFlotante) {
					this.contenedorFlotante.appendChild(this.botonCerrar)
				}
			}
		}
	}

	private crearFlotante() {
		if (!this.ID_CONTENEDOR) {
			this.ID_CONTENEDOR =
				this.utiles.crear_bsonobj_id_para_variable()
		}
		if (!this.ID_BOTON_CERRAR) {
			this.ID_BOTON_CERRAR =
				this.utiles.crear_bsonobj_id_para_variable()
			let textoCerrar = this.renderer.createElement('span')
			this.renderer.setProperty(textoCerrar, 'innerHTML', 'Cerrar')
			this.renderer.addClass(textoCerrar, 'h6')
			this.botonCerrar = this.renderer.createElement('div')
			let boton = this.renderer.createElement('button')
			this.renderer.setProperty(boton, 'type', 'button')
			this.renderer.addClass(boton, 'btn')
			this.renderer.addClass(boton, 'btn-sm')
			this.renderer.addClass(boton, 'btn-light')
			this.renderer.setAttribute(boton, 'id', this.ID_BOTON_CERRAR)
			boton.appendChild(textoCerrar)
			this.botonCerrar.appendChild(boton)
			this.renderer.setStyle(this.botonCerrar, 'bottom', '0')
			this.renderer.setStyle(this.botonCerrar, 'position', 'sticky')
			this.renderer.setStyle(this.botonCerrar, 'z-index', '9999999999')
			this.renderer.addClass(this.botonCerrar, 'text-right')
			this.renderer.addClass(this.botonCerrar, 'p-3')
			this.renderer.addClass(this.botonCerrar, 'recuadro-completo')
			const paddingUsado = parseInt(this.padding) || 0
			this.renderer.addClass(this.botonCerrar, 'border-top')
			this.renderer.addClass(this.botonCerrar, 'border-light')
			this.renderer.addClass(this.botonCerrar, 'mt-1')
			this.renderer.setStyle(
				this.botonCerrar,
				'bottom',
				`-${paddingUsado}px`
			)
		}
		if (!!this.encabezado) {
			this.HTMLencabezado = this.renderer.createElement('div')
			this.renderer.setProperty(
				this.HTMLencabezado,
				'innerHTML',
				this.encabezado
			)
			this.renderer.setStyle(this.HTMLencabezado, 'position', 'sticky')
			this.renderer.setStyle(this.HTMLencabezado, 'z-index', '9999999999')
			this.renderer.addClass(this.HTMLencabezado, 'p-3')
			this.renderer.addClass(this.HTMLencabezado, 'recuadro-completo')
			const paddingUsado = parseInt(this.padding) || 0
			this.renderer.addClass(this.HTMLencabezado, 'border-bottom')
			this.renderer.addClass(this.HTMLencabezado, 'border-light')
			this.renderer.addClass(this.HTMLencabezado, 'mb-1')
			this.renderer.setStyle(
				this.HTMLencabezado,
				'top',
				`-${paddingUsado}px`
			)
		}
		this.elementoPadre = this.elementRef.nativeElement
		this.contenedorFlotante = this.renderer.createElement('div')
		this.contenidoContenedor = this.renderer.createElement('div')

		this.resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				setTimeout(() => {
					if (this.seEstaMostrando) {
						this.posicionarContenedorFlotante(true)
						this.relocalizarPorSalirDePantalla()
						this.cdr.detectChanges()
					}
				})
			}
		})

		if (this.contenedorFlotante) {
			this.resizeObserver.observe(this.contenedorFlotante)
		}

		this.renderer.setProperty(
			this.contenedorFlotante,
			'id',
			this.ID_CONTENEDOR
		)
		this.renderer.addClass(this.contenedorFlotante, 'flotante')
		this.renderer.addClass(this.contenedorFlotante, 'shadow')
		this.renderer.addClass(this.contenedorFlotante, 'border')
		this.renderer.addClass(this.contenedorFlotante, 'border-secondary')
		this.renderer.addClass(this.contenedorFlotante, 'shadow-hover-md')
		this.renderer.addClass(this.contenedorFlotante, 'scale-hover-xl')
		this.renderer.addClass(this.contenidoContenedor, 'flotante')
		this.renderer.addClass(this.contenidoContenedor, 'flex-wrap')
		this.renderer.setStyle(this.contenedorFlotante, 'isolation', 'isolate')
		this.renderer.setStyle(this.contenedorFlotante, 'position', 'fixed')
		this.renderer.setStyle(this.contenedorFlotante, 'contain', 'layout')
		if (!this.enMovil) {
			this.renderer.setStyle(
				this.contenedorFlotante,
				'border-radius',
				'10px'
			)
		} else {
			this.renderer.setStyle(this.contenedorFlotante, 'position', 'fixed')
			// this.renderer.setStyle(this.contenedorFlotante, 'border-top-left-radius', '10px')
			// this.renderer.setStyle(this.contenedorFlotante, 'border-top-right-radius', '10px')
		}
		this.renderer.setStyle(
			this.contenedorFlotante,
			'box-shadow',
			'0px 4px 8px rgba(0, 0, 0, 0.3)'
		)
		this.renderer.setStyle(this.contenedorFlotante, 'display', 'none') // esconder al inicio
		this.renderer.setStyle(this.contenedorFlotante, 'z-index', '9999')
		this.renderer.setStyle(
			this.contenedorFlotante,
			'backdrop-filter',
			'blur(15px)'
		)
		this.renderer.setStyle(this.contenidoContenedor, 'line-break', 'auto')
		this.renderer.setStyle(this.contenidoContenedor, 'text-wrap', 'wrap')
		this.renderer.setStyle(
			this.contenedorFlotante,
			'border',
			`${this.anchoBorde} ${this.estiloBorde} ${this.colorBorde}`
		)
		this.renderer.setStyle(this.contenedorFlotante, 'top', `0`)
		this.renderer.setStyle(this.contenedorFlotante, 'left', `0`)
		// this.renderer.setStyle(this.contenedorFlotante, 'overflow', `clip`)
		this.clasesRecuadro.split(' ').forEach(clase => {
			this.renderer.addClass(this.contenedorFlotante, clase)
		})
		this.renderer.setStyle(this.contenidoContenedor, 'overflow-y', `auto`)
		this.renderer.setStyle(this.contenidoContenedor, 'overflow-x', `hidden`)
		this.renderer.setStyle(this.contenedorFlotante, 'overflow', `hidden`)

		if (this.template) {
			this.embeddedView = this.template.createEmbeddedView(
				this.contextoTemplate || {}
			)
			this.embeddedView.rootNodes.forEach(node => {
				this.renderer.appendChild(this.contenidoContenedor, node)
			})
			this.embeddedView?.detectChanges()
		} else if (this.htmlTemplate) {
			this.renderer.setProperty(
				this.contenidoContenedor,
				'innerHTML',
				this.htmlTemplate
			)
			try {
				this.cdr?.detectChanges()
			} catch (error) {
				// console.debug('Se omitió la actualización del contenedor: ', error)
			}
		}
		this.renderer.appendChild(
			this.contenedorFlotante,
			this.contenidoContenedor
		)
		this.cdr?.detectChanges()
		this.embeddedView?.detectChanges()

		if (!this.enMovil) {
			if (this.maxWidth) {
				this.renderer.setStyle(
					this.contenedorFlotante,
					'max-width',
					this.maxWidth
				)
			}
			if (this.minWidth) {
				this.renderer.setStyle(
					this.contenedorFlotante,
					'min-width',
					this.minWidth
				)
			}
			if (this.maxWidth) {
				this.renderer.setStyle(
					this.contenedorFlotante,
					'max-width',
					this.maxWidth
				)
			}
			if (this.maxHeight) {
				this.renderer.setStyle(
					this.contenedorFlotante,
					'max-height',
					this.maxHeight
				)
			}
			if (this.minHeight) {
				this.renderer.setStyle(
					this.contenedorFlotante,
					'min-height',
					this.minHeight
				)
			}
			if (this.maxWidth) {
				this.renderer.setStyle(
					this.contenidoContenedor,
					'max-width',
					this.maxWidth
				)
			}
			if (this.minWidth) {
				this.renderer.setStyle(
					this.contenidoContenedor,
					'min-width',
					this.minWidth
				)
			}
			if (this.maxWidth) {
				this.renderer.setStyle(
					this.contenidoContenedor,
					'max-width',
					this.maxWidth
				)
			}
			if (this.maxHeight) {
				this.renderer.setStyle(
					this.contenidoContenedor,
					'max-height',
					this.maxHeight
				)
			}
			if (this.minHeight) {
				this.renderer.setStyle(
					this.contenidoContenedor,
					'min-height',
					this.minHeight
				)
			}
		}
		if (this.extenderAlturaAlMaximo || this.enMovil) {
			this.renderer.setStyle(this.contenedorFlotante, 'height', '100%')
			this.renderer.setStyle(this.contenidoContenedor, 'height', '100%')
		}
		if (this.extenderAnchoAlMaximo || this.enMovil) {
			this.renderer.setStyle(this.contenedorFlotante, 'width', '100%')
			this.renderer.setStyle(this.contenidoContenedor, 'width', '100%')
		}

		this.renderer.setStyle(
			this.contenidoContenedor,
			'padding',
			this.padding || '15px'
		)
		this.renderer.setStyle(
			this.contenedorFlotante,
			'background',
			this.backgroundColor
		)
		this.renderer.setStyle(this.contenedorFlotante, 'color', this.textColor)

		this.aplicarEstilosPersonalizados()

		if (this.forzarFlotanteDentroDeContenedor) {
			this.renderer.setStyle(this.elementoPadre, 'position', 'relative')
			this.renderer.appendChild(
				this.elementoPadre,
				this.contenedorFlotante
			)
		} else {
			this.renderer.appendChild(document.body, this.contenedorFlotante)
		}
		// this.renderer.listen(this.contenedorFlotante, 'scroll', () => {
		// 	this.actualizarClipPath(this.contenidoContenedor)
		// })
		// this.actualizarClipPath(this.contenidoContenedor)

		if (this.contenedorFlotante) {
			this.controlFLotantesService.registrarFlotante(
				this.contenedorFlotante,
				this
			)
		}
		
	}

	// (o-----------------------------------------------------------/\-----o)
	//   #endregion INICIALIZACION (FIN)
	// (o==================================================================o)

	// (o==================================================================o)
	//   #region VISIBILIDAD FLOTANTE (INICIO)
	// (o-----------------------------------------------------------\/-----o)

	public ocultar(forzado: boolean = false) {
		this.mostrandoConCLick = false
		this.seEstaMostrando = false
		if (this.noEliminar && !forzado) {
			if (!!this.contenedorFlotante) {
				this.renderer.setStyle(
					this.contenedorFlotante,
					'display',
					'none'
				)
			}
		} else {
			if (!!this.contenedorFlotante) {
				if (this.embeddedView && !this.embeddedView.destroyed) {
					this.embeddedView.destroy()
					delete this.embeddedView
				}
				this.controlFLotantesService.eliminarFlotante(
					this.contenedorFlotante
				)
				this.renderer.removeChild(
					document.body,
					this.contenedorFlotante
				)
				this.emisorFlotanteDestruido.emit()
				this.posicionadoPorSalirDePantalla = false
				delete this.contenedorFlotante
			}
		}
	}

	public mostrar(forzado: boolean = false) {
		if (!this.contenedorFlotante) {
			this.crearFlotante()
		}
		try {
			this.seEstaMostrando = true
			this.posicionarContenedorFlotante()
			setTimeout(() => {
				Object.keys(this.funcionesPostCreado).map(funcion => {
					try {
						this.funcionesPostCreado[funcion]()
						this.cdr?.detectChanges()
						this.embeddedView?.detectChanges()
					} catch (err) {
						// console.debug(`La función ${funcion}() para los flotantes no funcionó (¡Vaja esa velocidad!): ${err}`)
					}
				})
				try {
					this.renderer.setStyle(
						this.contenedorFlotante,
						'display',
						'block'
					)
					this.relocalizarPorSalirDePantalla()
				} catch (err) {
					// console.debug(`Omitiendo mostrado de flotante (¡Demasiadas actualizaciones!): ${err}`)
				}
				this.definirAlturaContenido()
				this.cdr?.detectChanges()
				this.embeddedView?.detectChanges()
			}, 0)
		} catch (err) {
			// console.debug(`No se pudo mostrar un flotante: ${err}`)
		}
	}

	ngOnDestroy(): void {
		if (this.embeddedView && !this.embeddedView.destroyed) {
			this.embeddedView.destroy()
			delete this.embeddedView
		}
		// console.debug('DESTRUYENDO')
		if (this.resizeObserver) {
			this.resizeObserver.disconnect()
		}
		this.ocultar(true)
	}

	// (o-----------------------------------------------------------/\-----o)
	//   #endregion VISIBILIDAD FLOTANTE (FIN)
	// (o==================================================================o)

	// (o==================================================================o)
	//   #region LISTENERS (INICIO)
	// (o-----------------------------------------------------------\/-----o)

	@HostListener('mouseenter')
	onMouseEnter() {
		if (this.enMovil) return
		if (!this.mostrarConClick) {
			if (!this.noUsarHover) {
				this.mostrar()
			}
		}
	}

	@HostListener('mouseleave')
	onMouseLeave() {
		if (!this.mostrarConClick) {
			if (!this.noUsarHover) {
				// console.debug('ON LEAVE')
				this.ocultar()
			}
		}
	}

	@HostListener('click', ['$event'])
	onMouseClick(event: MouseEvent) {
		if (!this.mostrarConClick) return
		if (this.mostrandoConCLick && !!this.contenedorFlotante) {
			if (
				this.controlFLotantesService.elementoEstaDentroDeFlotante(
					this.contenedorFlotante as Node
				) &&
				this.controlFLotantesService.elementoEstaDentroDeFlotante(
					event.target as Node
				)
			) {
				try {
					this.embeddedView?.detectChanges()
				} catch (error) {
					// console.debug('Se omitió la actualización de la vista embebida: ', error)
				}
			}
			// console.debug('POR CLICK REPETIDO')
			this.ocultar()
			this.mostrandoConCLick = false
			try {
				this.cdr?.detectChanges()
			} catch (error) {
				// console.debug('Se omitió la actualización del contenedor: ', error)
			}
		} else {
			this.mostrar()
			this.mostrandoConCLick = true
			try {
				this.cdr?.detectChanges()
			} catch (error) {
				// console.debug('Se omitió la actualización del contenedor: ', error)
			}
		}
	}

	@HostListener('window:resize')
	redimensionarConZoom() {
		if (this.seEstaMostrando) {
			this.mostrar()
		}
	}

	// Si se da click afuera del flotante, desaparecerlo
	@HostListener('document:click', ['$event'])
	onClickOutside(event: MouseEvent) {
		if (this.noCerrarConClicksExternos) {
			const ELEM_CLICK = event.target as HTMLElement
			const BOTON_CERRAR = ELEM_CLICK.closest(`#${this.ID_BOTON_CERRAR}`)
			const OTRO_CONTENEDOR = ELEM_CLICK.closest(
				`.padre-flotante-generico`
			)
			const ES_COMPATIBLE = ELEM_CLICK.closest(`.compatible-con-flotante`)
			if (!ES_COMPATIBLE) {
				if (!!BOTON_CERRAR && this.seEstaMostrando) {
					this.ocultar()
				}
				if (OTRO_CONTENEDOR && this.seEstaMostrando) {
					if (OTRO_CONTENEDOR !== this.elementoPadre) {
						this.ocultar()
					}
				}
			}
		}
		if (!this.contenedorFlotante) return
		if (
			this.controlFLotantesService.elementoEstaDentroDeFlotante(
				event.target as Node
			)
		) {
			try {
				this.embeddedView?.detectChanges()
			} catch (error) {
				// console.debug('Se omitió la actualización de la vista embebida: ', error)
			}
		}
		const nivelParentesco =
			this.utiles.obtenerNivelDeDescendenciaEntreNodosHTML(
				this.contenedorFlotante,
				event.target as HTMLElement
			)
		// const ID_ULTIMO_FLOTANTE = this.controlFLotantesService.ultimoFlotanteRegistrado.id
		let contenedorNoContieneElTarget = !this.contenedorFlotante.contains(
			event.target as Node
		)
		let padreNoContieneElTarget = !this.elementoPadre.contains(
			event.target as Node
		)
		let elTargetNoEstaEnAlgunContenedor = !(
			event.target as HTMLElement
		).closest('.flotante')
		let compatibleConFlotante = !!(event.target as HTMLElement).closest(
			'.compatible-con-flotante'
		)
		// let ultimoFlotanteTieneMismoId = ID_ULTIMO_FLOTANTE === this.ID_CONTENEDOR
		// let elContenedorDelTargetTieneElMismoId = !!(event.target as HTMLElement).closest(`#${this.ID_CONTENEDOR}`)

		if (
			padreNoContieneElTarget && 
			!contenedorNoContieneElTarget &&
			this.ocultar_al_dar_click
		) {
			this.ocultar(true)
			return
		}
		
		if (
			contenedorNoContieneElTarget &&
			padreNoContieneElTarget &&
			nivelParentesco === -1 &&
			elTargetNoEstaEnAlgunContenedor &&
			!compatibleConFlotante
			// || (
			//   ultimoFlotanteTieneMismoId
			//   && ( this.mostrandoConCLick || this.seEstaMostrando )
			// )
		) {
			// console.debug('CLICK EXTERNO')
			if (!this.noCerrarConClicksExternos) {
				this.ocultar()
			}
		} else {
			try {
				this.embeddedView?.detectChanges()
			} catch (error) {
				// console.debug('Se omitió la actualización de la vista embebida: ', error)
			}
			return
		}
	}

	// (o-----------------------------------------------------------/\-----o)
	//   #endregion LISTENERS (FIN)
	// (o==================================================================o)

	// (o==================================================================o)
	//   #region POSICION Y TRANSICION (INICIO)
	// (o-----------------------------------------------------------\/-----o)

	// definirOffsetParaDeslizamientoUnaVez = false
	private posicionarContenedorFlotante(noOcultar: boolean = false) {
		if (this.enMovil) {
			try {
				this.aplicarEstilosPersonalizados()
			} catch (err) {
				// console.debug(`Omitiendo posicionamiento de flotante (¡Demasiadas actualizaciones!): ${err}`)
			}
			this.cdr?.detectChanges()
			if (this.embeddedView) {
				this.embeddedView.detectChanges()
			}
			return
		}
		const posicionHost =
			this.elementRef.nativeElement.getBoundingClientRect()
		const scrollYAxis = window.scrollY || document.documentElement.scrollTop
		const scrollXAxis =
			window.scrollX || document.documentElement.scrollLeft
		if (!noOcultar) {
			this.renderer.setStyle(
				this.contenedorFlotante,
				'visibility',
				'hidden'
			)
			this.renderer.setStyle(this.contenedorFlotante, 'display', 'block')
		}
		const alturaFLotante = this.contenedorFlotante?.offsetHeight
		const anchoFlotante = this.contenedorFlotante?.offsetWidth
		if (!noOcultar) {
			this.renderer.setStyle(this.contenedorFlotante, 'display', 'none')
			this.renderer.removeStyle(this.contenedorFlotante, 'visibility')
		}
		let posicionAValorar = this.posicion

		if (!this.posicionadoPorSalirDePantalla) {
			switch (posicionAValorar) {
				case 'top':
					this.topContenedor =
						posicionHost.top + scrollYAxis - (alturaFLotante ?? 0) - 5
					this.leftContenedor = posicionHost.left + scrollXAxis
					break
				case 'bottom':
					this.topContenedor = posicionHost.bottom + scrollYAxis + 5
					this.leftContenedor = posicionHost.left + scrollXAxis
					break
				case 'right':
					this.topContenedor = posicionHost.top
					this.leftContenedor = posicionHost.right + scrollXAxis + 5
					break
				case 'left':
					this.topContenedor = posicionHost.top
					this.leftContenedor = posicionHost.left - (anchoFlotante ?? 0) - 5
					break
				default:
					this.topContenedor =
						posicionHost.top + scrollYAxis - (alturaFLotante ?? 0) - 5
					this.leftContenedor = posicionHost.left + scrollXAxis
					break
			}
		}
		if (
			!this.forzarFlotanteDentroDeContenedor &&
			!!this.contenedorFlotante
		) {
			// setTimeout(() => {
			try {
				this.aplicarEstilosPersonalizados()
				this.renderer.setStyle(
					this.contenedorFlotante,
					'top',
					`${this.topContenedor}px`
				)
				this.renderer.setStyle(
					this.contenedorFlotante,
					'left',
					`${this.leftContenedor}px`
				)
				if (this.definirScrollMaximoAutomatico) {
					this.recalcularScroll()
				}
			} catch (err) {
				// console.debug(`Omitiendo posicionamiento de flotante (¡Demasiadas actualizaciones!): ${err}`)
			}
			// })
		}
		setTimeout(() => {
			this.definirAlturaContenido()
			this.cdr.detectChanges()
			this.embeddedView?.detectChanges()
		}, 0)
	}

	private recalcularScroll(alturaCompletaViewport: boolean = false) {
		const viewPortHeight = window.innerHeight
		const espacioInferiorSuperiorMinimo = 20
		const alturaMaximaScroll = alturaCompletaViewport
			? viewPortHeight - espacioInferiorSuperiorMinimo
			: viewPortHeight -
			  this.topContenedor -
			  espacioInferiorSuperiorMinimo
		this.maxHeight = `${alturaMaximaScroll}px`
		this.renderer.setStyle(
			this.contenedorFlotante,
			'max-height',
			`${alturaMaximaScroll}px`
		)
		// this.renderer.removeStyle(this.contenidoContenedor, 'overflow')
		this.renderer.setStyle(this.contenidoContenedor, 'overflow-y', `auto`)
		this.renderer.setStyle(this.contenidoContenedor, 'overflow-x', `hidden`)
	}

	// private quitarCalculoDeScroll() {
	// 	this.renderer.removeStyle(this.contenedorFlotante, 'max-height')
	// 	this.renderer.removeStyle(this.contenedorFlotante, 'overflow-y')
	// 	this.renderer.removeStyle(this.contenedorFlotante, 'overflow-x')
	// }

	private relocalizarPorSalirDePantalla() {
		// if (this.definirScrollMaximoAutomatico) return
		if (this.enMovil) {
			setTimeout(() => {
				this.cdr?.detectChanges()
				if (this.embeddedView) {
					this.embeddedView.detectChanges()
				}
			}, 0)
			return
		}
		setTimeout(() => {
			try {
				const rectFlotante =
					this.contenedorFlotante?.getBoundingClientRect()
				const viewPortWidth = window.innerWidth
				const viewPortHeight = window.innerHeight
				let posicionAValorar = this.posicion
				let puntoOverflow: 'left' | 'right' | 'top' | 'bottom' = 'right'
				if (rectFlotante && this.contenedorFlotante) {
					let nuevoTop = rectFlotante.top
					let nuevoLeft = rectFlotante.left
					if (rectFlotante.right > viewPortWidth) {
						puntoOverflow = 'right'
						this.leftContenedor =
							viewPortWidth - this.contenedorFlotante.offsetWidth - 10
					}
					if (rectFlotante.bottom > viewPortHeight) {
						puntoOverflow = 'bottom'
						this.topContenedor =
							viewPortHeight -
							this.contenedorFlotante.offsetHeight -
							10
					}
					if (rectFlotante.left < 0) {
						puntoOverflow = 'left'
						this.leftContenedor = 10
					}
					if (rectFlotante.top < 0) {
						puntoOverflow = 'top'
						this.topContenedor = 10
					}
					// this.posicionadoPorSalirDePantalla = true

					if (!!puntoOverflow) {

						switch (posicionAValorar) {
							case 'top':
								if (puntoOverflow === 'top') {
									this.posicion = 'bottom'
									this.posicionarContenedorFlotante()
								} else {
									this.renderer.setStyle(
										this.contenedorFlotante,
										'top',
										`${this.topContenedor}px`
									)
									this.renderer.setStyle(
										this.contenedorFlotante,
										'left',
										`${this.leftContenedor}px`
									)
								}
								break
							case 'bottom':
								if (puntoOverflow === 'bottom') {
									this.posicion = 'top'
									this.posicionarContenedorFlotante()
								} else {
									this.renderer.setStyle(
										this.contenedorFlotante,
										'top',
										`${this.topContenedor}px`
									)
									this.renderer.setStyle(
										this.contenedorFlotante,
										'left',
										`${this.leftContenedor}px`
									)
								}
								break
							case 'right':
								this.renderer.setStyle(
									this.contenedorFlotante,
									'top',
									`${this.topContenedor}px`
								)
								this.renderer.setStyle(
									this.contenedorFlotante,
									'left',
									`${this.leftContenedor}px`
								)
								break
							case 'left':
								this.renderer.setStyle(
									this.contenedorFlotante,
									'top',
									`${this.topContenedor}px`
								)
								this.renderer.setStyle(
									this.contenedorFlotante,
									'left',
									`${this.leftContenedor}px`
								)
								break
							default:
								this.renderer.setStyle(
									this.contenedorFlotante,
									'top',
									`${this.topContenedor}px`
								)
								this.renderer.setStyle(
									this.contenedorFlotante,
									'left',
									`${this.leftContenedor}px`
								)
								break
					}
	
					}
					if (posicionAValorar === 'bottom' || posicionAValorar === 'top') {
						this.recalcularScroll(false)
					} else {
						this.recalcularScroll(true)
					}
				}
			} catch (err) {
				console.debug(`No se pudo reposicionar un flotante: ${err}`)
			}
			this.definirAlturaContenido()
			this.cdr.detectChanges()
			this.embeddedView?.detectChanges()
		}, 0)
	}

	private encontrarTodosLosElementosShadowRoot(
		elemento: HTMLElement,
		query: string
	) {
		const elementos: HTMLElement[] = Array.from(
			elemento.querySelectorAll(query)
		)
		elemento.childNodes.forEach((child: any) => {
			if (child.shadowRoot) {
				elementos.push(
					...this.encontrarTodosLosElementosShadowRoot(
						child.shadowRoot,
						query
					)
				)
			}
		})
		return elementos
	}

	private encontrarTodosLosElementosSoloQuerySelector(
		elemento: HTMLElement,
		query: string
	) {
		if (this.contenedorFlotante) {
			const elementos = Array.from(
				this.contenedorFlotante.querySelectorAll(query)
			)
			return elementos
		} else {
			return []
		}
	}

	private obtenerHijos(elemento: HTMLElement, query: string) {
		return [
			...this.encontrarTodosLosElementosShadowRoot(elemento, query),
			...this.encontrarTodosLosElementosSoloQuerySelector(elemento, query)
		]
	}

	private aplicarEstilosPersonalizados() {
		if (this.contenedorFlotante) {
			const textoDeColores = this.obtenerHijos(
				this.contenedorFlotante,
				'text-danger, text-dark, text-muted, text-secondary, text-primary, text-info, text-warning'
			)
			const elementosHR = this.obtenerHijos(
				this.contenedorFlotante,
				'hr.hr-completo'
			)
			const elementosCompletos = this.obtenerHijos(
				this.contenedorFlotante,
				'.recuadro-completo'
			)
			const paddingUsado = parseInt(this.padding) || 0
			textoDeColores.forEach(elemTexto => {
				// this.renderer.setStyle(this.contenedorFlotante, '-webkit-text-stroke', '0.1px white')
				this.renderer.setStyle(
					this.contenedorFlotante,
					'background-color',
					'rgba(255, 255, 255, 0.1)'
				)
				this.renderer.setStyle(
					this.contenedorFlotante,
					'border-radius',
					'5px'
				)
				this.renderer.setStyle(
					this.contenedorFlotante,
					'padding-top',
					'1px'
				)
				this.renderer.setStyle(
					this.contenedorFlotante,
					'padding-bottom',
					'1px'
				)
				this.renderer.setStyle(
					this.contenedorFlotante,
					'padding-left',
					'2px'
				)
				this.renderer.setStyle(
					this.contenedorFlotante,
					'padding-right',
					'2px'
				)
			})
			let iElemenCompleto = 0
			elementosCompletos.forEach(elemCompleto => {
				this.renderer.setStyle(
					elemCompleto,
					'width',
					`calc(100% + ${2 * paddingUsado}px)`
				)
				this.renderer.setStyle(
					elemCompleto,
					'margin-top',
					`-${paddingUsado}px`
				)
				this.renderer.setStyle(
					elemCompleto,
					'margin-bottom',
					`-${paddingUsado}px`
				)
				this.renderer.setStyle(
					elemCompleto,
					'margin-left',
					`-${paddingUsado}px`
				)
				this.renderer.setStyle(
					elemCompleto,
					'margin-right',
					`-${paddingUsado}px`
				)
				// this.renderer.setStyle(elemCompleto, 'border-color', 'white')
				// this.renderer.setStyle(elemCompleto, 'background-color', 'white')
				// this.renderer.setStyle(elemCompleto, 'border-width', '1px')
				// this.renderer.setStyle(elemCompleto, 'box-sizing', 'border-box')
				iElemenCompleto++
			})
			elementosHR.forEach(elementoHR => {
				this.renderer.setStyle(
					elementoHR,
					'width',
					`calc(100% + ${2 * paddingUsado}px)`
				)
				this.renderer.setStyle(elementoHR, 'margin-top', `7px`)
				this.renderer.setStyle(elementoHR, 'margin-bottom', `7px`)
				this.renderer.setStyle(
					elementoHR,
					'margin-left',
					`-${paddingUsado}px`
				)
				this.renderer.setStyle(
					elementoHR,
					'margin-right',
					`-${paddingUsado}px`
				)
				this.renderer.setStyle(elementoHR, 'border-color', 'white')
				this.renderer.setStyle(elementoHR, 'background-color', 'white')
				this.renderer.setStyle(elementoHR, 'border-width', '1px')
				this.renderer.setStyle(elementoHR, 'box-sizing', 'border-box')
			})
			try {
				this.cdr?.detectChanges()
				if (this.embeddedView) {
					this.embeddedView.detectChanges()
				}
			} catch (error) {
				// console.debug('Se omitió la actualización del contenedor: ', error)
			}
		}
	}

	private definirAlturaContenido() {
		let altura = this.maxHeight ?? this.contenedorFlotante?.offsetHeight
		if (!!this.noCerrarConClicksExternos && !this.usarEncabezado) {
			altura = `calc( ${altura} - ${this.botonCerrar.offsetHeight}px)`
		} else if (!!this.usarEncabezado && !this.noCerrarConClicksExternos) {
			altura = `calc( ${altura} - ${this.HTMLencabezado.offsetHeight}px)`
		} else if (!!this.usarEncabezado && !!this.noCerrarConClicksExternos) {
			altura = `calc(${altura} - ${this.HTMLencabezado.offsetHeight}px - ${this.botonCerrar.offsetHeight}px)`
		}
		// this.renderer.setStyle(this.contenidoContenedor, 'max-height', altura)
		if (!!this.maxHeight) {
			this.renderer.setStyle(
				this.contenidoContenedor,
				'max-height',
				altura
			)
		}
		if (!!this.minHeight) {
			this.renderer.setStyle(
				this.contenidoContenedor,
				'min-height',
				altura
			)
		}
	}

	// (o-----------------------------------------------------------/\-----o)
	//   #endregion POSICION Y TRANSICION (FIN)
	// (o==================================================================o)
}
