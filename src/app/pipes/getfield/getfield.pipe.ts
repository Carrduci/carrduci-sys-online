import { inject, Pipe, PipeTransform } from '@angular/core';
import { UtilidadesService } from '../../services/ux/utilidades/utilidades.service';

@Pipe({
  name: 'getfield',
  standalone: true,
})
export class GetfieldPipe implements PipeTransform {

  utilidades: UtilidadesService = inject(UtilidadesService)

  transform(objeto: any, ruta: string, reemplazoValorIndefinido = 'N/A'): unknown {
    return this.utilidades.seleccionar_campo_cualquier_nivel_profundo(
      objeto, 
      ruta, 
      '.', 
      {
        reemplazoValorIndefinido, 
        aplanarSubArreglos: true, 
        valorError: reemplazoValorIndefinido
      }
    )
  }

}
