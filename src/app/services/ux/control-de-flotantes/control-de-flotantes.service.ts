import { Injectable, Renderer2, RendererFactory2 } from '@angular/core'
import { FlotanteGenericoDirective } from '../../../directives/utiles/varios/flotante-generico/flotante-generico.directive'

@Injectable({
	providedIn: 'root'
})
export class ControlDeFlotantesService {
	flotantesActivos = new Map<HTMLElement, FlotanteGenericoDirective>()
	private _ultimoFlotanteRegistrado?: HTMLElement
	// private renderer2: Renderer2

	constructor(rendererFactory: RendererFactory2) {
		// this.renderer2 = rendererFactory.createRenderer(null, null)
	}

	get ultimoFlotanteRegistrado(): HTMLElement | undefined {
		return this._ultimoFlotanteRegistrado
	}

	registrarFlotante(
		flotante: HTMLElement,
		directiva: FlotanteGenericoDirective
	) {
		this._ultimoFlotanteRegistrado = flotante
		this.flotantesActivos.set(flotante, directiva)
	}

	eliminarFlotante(flotante: HTMLElement) {
		this.flotantesActivos.delete(flotante)
		if (flotante === this._ultimoFlotanteRegistrado) {
			delete this._ultimoFlotanteRegistrado
		}
	}

	cerrarTodosLosFlotantes() {
		this.flotantesActivos.forEach((directiva, flotante) => {
			directiva.ocultar()
		})
	}

	elementoEstaDentroDeFlotante(elemento: Node): boolean {
		const DENTRO_FLOTANTE = Array.from(this.flotantesActivos).some(
			unFlotante => {
				return unFlotante[0].contains(elemento)
			}
		)
		return DENTRO_FLOTANTE
	}
}
