import { AfterViewInit, Component, ElementRef, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { HeaderService } from '../../../../services/ux/header/header.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'csys-layout-publico',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout-publico.component.html',
  styleUrl: './layout-publico.component.scss',
  standalone: true,
})
export class LayoutPublicoComponent implements AfterViewInit, OnInit {
  constructor(
    public header_service: HeaderService,
  ) {
    this.titulo_componente = this.header_service.get_componente()
  }

  ngAfterViewInit(): void {
    this.crear_resize_observer()
    this.obtenerAlturaEncabezado()
  }

  ngOnInit(): void {
  }

  @ViewChild('backdropLayoutPublico') backdropLayoutPublico!: ElementRef
  @ViewChild('esquemaLayoutPublico') esquemaLayoutPublico!: ElementRef
  @ViewChild('encabezadoLayoutPublico') encabezadoLayoutPublico!: ElementRef
  @ViewChild('cuerpoLayoutPublico') cuerpoLayoutPublico!: ElementRef

  titulo_componente?: WritableSignal<TemplateRef<any> | undefined>
  protected readonly titulo_string = signal('CARRDUCIsys ONLINE');
  resize_observer!: ResizeObserver
  altoEncabezadoEnPx: WritableSignal<number> = signal(0)

  obtenerAlturaEncabezado() {
    const HEIGHT = (this.encabezadoLayoutPublico.nativeElement as HTMLElement).offsetHeight
    this.altoEncabezadoEnPx.update((value) => HEIGHT)
  }
  
  crear_resize_observer() {
    this.resize_observer = new ResizeObserver(
      (entries) => {
        this.obtenerAlturaEncabezado()
      }
    )
    this.resize_observer.observe(this.encabezadoLayoutPublico.nativeElement)
  }
}
