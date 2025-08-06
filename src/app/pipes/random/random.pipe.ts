import { inject, Pipe, PipeTransform } from '@angular/core';
import { UtilidadesService } from '../../services/ux/utilidades/utilidades.service';

@Pipe({
    name: 'random',
    standalone: true,
})
export class RandomPipe implements PipeTransform {
    transform(start: number, end: number): unknown {
        return Math.floor(start + Math.random() * (end - start + 1));
    }
}
